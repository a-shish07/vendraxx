import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/auth";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { assertSameOrigin, securityError } from "@/lib/security";

export async function GET() {
  try {
    const user = await requireUser();
    await connectDB();
    const cart: any = await Cart.findOne({ userId: user.sub }).lean();
    if (!cart?.items?.length) return NextResponse.json({ items: [] });
    const products = await Product.find({
      _id: { $in: cart.items.map((item: any) => item.productId) },
      active: true,
    }).lean();
    const byId = new Map(
      products.map((product) => [String(product._id), product]),
    );
    const items = cart.items.flatMap((item: any) => {
      const product = byId.get(String(item.productId));
      return product
        ? [
            {
              id: String(product._id),
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
              quantity: item.quantity,
              stock: product.stock,
            },
          ]
        : [];
    });
    return NextResponse.json({ items });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "Unable to load cart." },
      { status: unauthorized ? 401 : 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    assertSameOrigin(req);
    const user = await requireUser();
    const body = await req.json();
    if (!Array.isArray(body.items) || body.items.length > 50)
      return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
    const quantities = new Map<string, number>();
    for (const item of body.items) {
      const id = String(item?.id || "");
      const quantity = Number(item?.quantity);
      if (
        !mongoose.isValidObjectId(id) ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      )
        return NextResponse.json(
          { error: "Cart contains an invalid item or quantity." },
          { status: 400 },
        );
      const total = (quantities.get(id) || 0) + quantity;
      if (total > 50)
        return NextResponse.json(
          { error: "Each product is limited to 50 units per cart." },
          { status: 400 },
        );
      quantities.set(id, total);
    }
    await connectDB();
    if (quantities.size) {
      const products = await Product.find({
        _id: { $in: [...quantities.keys()] },
        active: true,
      })
        .select("_id stock")
        .lean();
      const stockById = new Map(
        products.map((product) => [String(product._id), product.stock]),
      );
      for (const [id, quantity] of quantities)
        if (!stockById.has(id) || (stockById.get(id) || 0) < quantity)
          return NextResponse.json(
            {
              error:
                "A product is unavailable or the requested quantity exceeds stock.",
            },
            { status: 409 },
          );
    }
    await Cart.updateOne(
      { userId: user.sub },
      {
        $set: {
          items: [...quantities].map(([productId, quantity]) => ({
            productId,
            quantity,
          })),
        },
      },
      { upsert: true, runValidators: true },
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "Unable to save cart." },
      { status: unauthorized ? 401 : 500 },
    );
  }
}
