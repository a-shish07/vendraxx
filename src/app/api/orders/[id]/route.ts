import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { requireUser } from "@/lib/auth";
import mongoose from "mongoose";
import { assertSameOrigin, securityError } from "@/lib/security";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    await connectDB();
    const order: any = await Order.findOne({
      _id: id,
      userId: user.sub,
    }).lean();
    if (!order)
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({
      order: { ...order, id: String(order._id), _id: undefined },
    });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error && e.message === "UNAUTHORIZED"
            ? "Unauthorized"
            : "Unable to load order.",
      },
      {
        status: e instanceof Error && e.message === "UNAUTHORIZED" ? 401 : 500,
      },
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
    const user = await requireUser();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const body = await req.json();
    const reason = String(body.reason || "")
      .trim()
      .slice(0, 500);
    if (reason.length < 5)
      return NextResponse.json(
        { error: "Please provide a cancellation reason." },
        { status: 400 },
      );
    await connectDB();
    dbSession = await mongoose.startSession();
    let cancelled = false;
    await dbSession.withTransaction(async () => {
      const order = await Order.findOneAndUpdate(
        {
          _id: id,
          userId: user.sub,
          status: { $in: ["PENDING", "CONFIRMED"] },
        },
        {
          $set: {
            status: "CANCELLED",
            cancellationReason: reason,
            cancelledBy: user.sub,
            cancelledAt: new Date(),
          },
          $push: {
            statusHistory: {
              status: "CANCELLED",
              note: reason,
              changedBy: user.sub,
              at: new Date(),
            },
          },
        },
        { new: true, session: dbSession },
      );
      if (!order) return;
      for (const item of order.items)
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
        ).session(dbSession!);
      cancelled = true;
    });
    if (!cancelled)
      return NextResponse.json(
        {
          error:
            "This order cannot be cancelled. Only pending or confirmed orders can be cancelled.",
        },
        { status: 409 },
      );
    return NextResponse.json({ ok: true });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "Unable to cancel order." },
      { status: unauthorized ? 401 : 500 },
    );
  } finally {
    await dbSession?.endSession();
  }
}
