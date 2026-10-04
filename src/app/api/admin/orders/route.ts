import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const params = new URL(req.url).searchParams;
    const page = Math.max(1, Number(params.get("page") || 1) || 1);
    const limit = Math.min(
      50,
      Math.max(10, Number(params.get("limit") || 25) || 25),
    );
    const search = (params.get("search") || "").trim().slice(0, 100);
    const status = params.get("status") || "";
    const from = params.get("from");
    const to = params.get("to");
    const filter: Record<string, any> = {};
    if (
      status &&
      [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ].includes(status)
    )
      filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from && !Number.isNaN(Date.parse(from)))
        filter.createdAt.$gte = new Date(`${from}T00:00:00.000Z`);
      if (to && !Number.isNaN(Date.parse(to)))
        filter.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
      if (!Object.keys(filter.createdAt).length) delete filter.createdAt;
    }
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { orderNumber: { $regex: safe, $options: "i" } },
        { "customer.name": { $regex: safe, $options: "i" } },
        { "customer.phone": { $regex: safe, $options: "i" } },
        { "customer.email": { $regex: safe, $options: "i" } },
      ];
    }
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId", "name email phone")
        .lean(),
      Order.countDocuments(filter),
    ]);
    return NextResponse.json({
      orders: orders.map((o) => ({ ...o, id: String(o._id), _id: undefined })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    const forbidden = e instanceof Error && e.message === "FORBIDDEN";
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: forbidden ? "Forbidden" : "Unauthorized" },
      { status: forbidden ? 403 : unauthorized ? 401 : 500 },
    );
  }
}
