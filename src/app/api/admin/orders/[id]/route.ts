import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import { assertSameOrigin, securityError } from "@/lib/security";

const nextStatus: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};
const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    await connectDB();
    const order: any = await Order.findById(id)
      .populate("userId", "name email phone avatar")
      .lean();
    if (!order)
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({
      order: { ...order, id: String(order._id), _id: undefined },
    });
  } catch (e) {
    const forbidden = e instanceof Error && e.message === "FORBIDDEN";
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: forbidden ? "Forbidden" : "Unauthorized" },
      { status: forbidden ? 403 : 401 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let dbSession: mongoose.ClientSession | undefined;
  try {
    assertSameOrigin(req);
    const admin = await requireAdmin();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const body = await req.json();
    const status = String(body.status || "");
    const note = String(body.note || "")
      .trim()
      .slice(0, 500);
    if (!statuses.includes(status) || status === "PENDING")
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 },
      );
    await connectDB();
    dbSession = await mongoose.startSession();
    let changed = false;
    await dbSession.withTransaction(async () => {
      const order: any = await Order.findById(id).session(dbSession!);
      if (!order) return;
      if (status === "CANCELLED") {
        if (note.length < 5) throw new Error("Provide a cancellation reason.");
        if (!["PENDING", "CONFIRMED"].includes(order.status))
          throw new Error("Only pending or confirmed orders can be cancelled.");
        order.status = status;
        order.cancellationReason = note;
        order.cancelledBy = admin.sub;
        order.cancelledAt = new Date();
        order.statusHistory.push({
          status,
          note,
          changedBy: admin.sub,
          at: new Date(),
        });
        await order.save({ session: dbSession });
        for (const item of order.items)
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.quantity } },
          ).session(dbSession!);
        changed = true;
      } else {
        if (nextStatus[order.status] !== status)
          throw new Error("Order status must advance one step at a time.");
        order.status = status;
        if (status === "DELIVERED") order.paymentStatus = "COD";
        order.statusHistory.push({
          status,
          note,
          changedBy: admin.sub,
          at: new Date(),
        });
        await order.save({ session: dbSession });
        changed = true;
      }
    });
    if (!changed)
      return NextResponse.json(
        { error: "Order could not be updated." },
        { status: 409 },
      );
    const updated: any = await Order.findById(id)
      .populate("userId", "name email phone")
      .lean();
    return NextResponse.json({
      order: updated
        ? { ...updated, id: String(updated._id), _id: undefined }
        : null,
    });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const forbidden = e instanceof Error && e.message === "FORBIDDEN";
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    const known =
      e instanceof Error &&
      [
        "Provide a cancellation reason.",
        "Only pending or confirmed orders can be cancelled.",
        "Order status must advance one step at a time.",
      ].includes(e.message);
    return NextResponse.json(
      {
        error: forbidden
          ? "Forbidden"
          : unauthorized
            ? "Unauthorized"
            : e instanceof Error
              ? e.message
              : "Unable to update order.",
      },
      { status: forbidden ? 403 : unauthorized ? 401 : known ? 409 : 500 },
    );
  } finally {
    await dbSession?.endSession();
  }
}
