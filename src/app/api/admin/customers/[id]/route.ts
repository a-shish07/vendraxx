import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import User from "@/models/User";
import Order from "@/models/Order";
import Address from "@/models/Address";
import { assertSameOrigin, securityError } from "@/lib/security";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    await connectDB();
    const [user, orders, addresses] = await Promise.all([
      User.findOne({ _id: id, role: "CUSTOMER" })
        .select("_id name email phone avatar createdAt isActive")
        .lean() as any,
      Order.find({ userId: id }).sort({ createdAt: -1 }).limit(100).lean(),
      Address.find({ userId: id })
        .sort({ isDefault: -1, updatedAt: -1 })
        .lean(),
    ]);
    if (!user)
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    const activeOrders = orders.filter(
      (order: any) => order.status !== "CANCELLED",
    );
    return NextResponse.json({
      customer: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt,
        orderCount: orders.length,
        totalSpent: activeOrders.reduce(
          (sum: number, order: any) => sum + order.total,
          0,
        ),
      },
      orders: orders.map((order: any) => ({
        ...order,
        id: String(order._id),
        _id: undefined,
      })),
      addresses: addresses.map((address: any) => ({
        ...address,
        id: String(address._id),
        _id: undefined,
      })),
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
  try {
    assertSameOrigin(req);
    await requireAdmin();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    const body = await req.json();
    if (typeof body.isActive !== "boolean")
      return NextResponse.json(
        { error: "Invalid account status." },
        { status: 400 },
      );
    await connectDB();
    const user: any = await User.findOneAndUpdate(
      { _id: id, role: "CUSTOMER" },
      { $set: { isActive: body.isActive }, $inc: { sessionVersion: 1 } },
      { new: true },
    )
      .select("_id name email phone avatar createdAt isActive")
      .lean();
    if (!user)
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    return NextResponse.json({
      customer: { ...user, id: String(user._id), _id: undefined },
    });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const forbidden = e instanceof Error && e.message === "FORBIDDEN";
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      {
        error: forbidden
          ? "Forbidden"
          : unauthorized
            ? "Unauthorized"
            : "Unable to update customer.",
      },
      { status: forbidden ? 403 : unauthorized ? 401 : 500 },
    );
  }
}
