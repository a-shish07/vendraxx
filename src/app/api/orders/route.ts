import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import Cart from "@/models/Cart";
import { requireUser } from "@/lib/auth";
import { assertSameOrigin, securityError } from "@/lib/security";

const phonePattern = /^[6-9]\d{9}$/;
const pincodePattern = /^\d{6}$/;

export async function GET() {
  try {
    const user = await requireUser();
    await connectDB();
    const orders = await Order.find({ userId: user.sub })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json({
      orders: orders.map((o) => ({ ...o, id: String(o._id), _id: undefined })),
    });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "Unable to load orders." },
      { status: unauthorized ? 401 : 500 },
    );
  }
}

export async function POST(req: Request) {
  let dbSession: mongoose.ClientSession | undefined;
  try {
    assertSameOrigin(req);
    const user = await requireUser();
    const body = await req.json();
    if (
      !Array.isArray(body.items) ||
      !body.items.length ||
      body.items.length > 50
    )
      return NextResponse.json(
        { error: "Your cart is empty or contains too many products." },
        { status: 400 },
      );
    const quantities = new Map<string, number>();
    for (const item of body.items) {
      const productId = String(item?.productId || "");
      const quantity = Number(item?.quantity);
      if (
        !mongoose.isValidObjectId(productId) ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      )
        return NextResponse.json(
          { error: "Cart contains an invalid product or quantity." },
          { status: 400 },
        );
      quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    }
    const customer = body.customer || {};
    const name = String(customer.name || "")
      .trim()
      .slice(0, 100);
    const phone = String(customer.phone || "").replace(/\D/g, "");
    const address = String(customer.address || "")
      .trim()
      .slice(0, 240);
    const city = String(customer.city || "")
      .trim()
      .slice(0, 100);
    const state = String(customer.state || "")
      .trim()
      .slice(0, 100);
    const pincode = String(customer.pincode || "").trim();
    const notes = String(customer.notes || "")
      .trim()
      .slice(0, 500);
    if (
      !name ||
      !phonePattern.test(phone) ||
      !address ||
      !city ||
      !state ||
      !pincodePattern.test(pincode)
    )
      return NextResponse.json(
        { error: "Enter valid contact and delivery details." },
        { status: 400 },
      );

    await connectDB();
    dbSession = await mongoose.startSession();
    let created: {
      id: string;
      orderNumber: string;
      total: number;
      status: string;
    } | null = null;
    await dbSession.withTransaction(async () => {
      const products = await Product.find({
        _id: { $in: [...quantities.keys()] },
        active: true,
      })
        .session(dbSession!)
        .lean();
      const byId = new Map(products.map((p) => [String(p._id), p]));
      const items = [...quantities].map(([productId, quantity]) => {
        const p = byId.get(productId);
        if (!p || p.stock < quantity)
          throw new Error(
            `Product unavailable or insufficient stock: ${p?.name || "item"}`,
          );
        return {
          productId: p._id,
          name: p.name,
          image: p.image,
          price: p.price,
          sku: p.sku || "",
          quantity,
        };
      });
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const shipping = subtotal >= 999 ? 0 : 79;
      const total = subtotal + shipping;
      for (const item of items) {
        const result = await Product.updateOne(
          { _id: item.productId, active: true, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
        ).session(dbSession!);
        if (result.modifiedCount !== 1)
          throw new Error(
            `Insufficient stock for ${item.name}. Please update your cart.`,
          );
      }
      const account: any = await User.findById(user.sub)
        .select("name email phone")
        .session(dbSession!)
        .lean();
      if (!account) throw new Error("Account not found.");
      const [order] = await Order.create(
        [
          {
            orderNumber: `VX-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`,
            userId: user.sub,
            items,
            subtotal,
            shipping,
            total,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            customer: {
              name,
              phone,
              email: account.email,
              address,
              city,
              state,
              pincode,
              notes,
            },
            status: "PENDING",
            statusHistory: [
              { status: "PENDING", note: "Order placed", changedBy: user.sub },
            ],
          },
        ],
        { session: dbSession },
      );
      await Cart.updateOne(
        { userId: user.sub },
        { $set: { items: [] } },
        { session: dbSession },
      );
      created = {
        id: String(order._id),
        orderNumber: order.orderNumber,
        total,
        status: order.status,
      };
    });
    return NextResponse.json({ order: created }, { status: 201 });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const message = e instanceof Error ? e.message : "Unable to place order.";
    const unauthorized = message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : message },
      { status: unauthorized ? 401 : 400 },
    );
  } finally {
    await dbSession?.endSession();
  }
}
