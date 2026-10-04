import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
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
    const filter: Record<string, any> = { role: "CUSTOMER" };
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: safe, $options: "i" } },
        { email: { $regex: safe, $options: "i" } },
        { phone: { $regex: safe, $options: "i" } },
      ];
    }
    const [customers, total] = await Promise.all([
      User.find(filter)
        .select("_id name email phone avatar createdAt isActive")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);
    const ids = customers.map((c) => c._id);
    const aggregates: any[] = await Order.aggregate([
      { $match: { userId: { $in: ids } } },
      {
        $group: {
          _id: "$userId",
          orders: { $sum: 1 },
          spent: {
            $sum: { $cond: [{ $ne: ["$status", "CANCELLED"] }, "$total", 0] },
          },
          lastOrder: { $max: "$createdAt" },
        },
      },
    ]);
    const byId = new Map(aggregates.map((item) => [String(item._id), item]));
    return NextResponse.json({
      customers: customers.map((u) => {
        const stats = byId.get(String(u._id));
        return {
          ...u,
          id: String(u._id),
          _id: undefined,
          orders: stats?.orders || 0,
          totalSpent: stats?.spent || 0,
          lastOrder: stats?.lastOrder || null,
        };
      }),
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
