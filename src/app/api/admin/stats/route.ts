import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const params = new URL(req.url).searchParams;
    const from = params.get("from");
    const to = params.get("to");
    const orderDate: Record<string, Date> = {};
    if (from && !Number.isNaN(Date.parse(from)))
      orderDate.$gte = new Date(`${from}T00:00:00.000Z`);
    if (to && !Number.isNaN(Date.parse(to)))
      orderDate.$lte = new Date(`${to}T23:59:59.999Z`);
    const orderMatch = Object.keys(orderDate).length
      ? { createdAt: orderDate }
      : {};
    const [
      products,
      customers,
      orders,
      deliveredRevenue,
      pendingOrders,
      cancelledOrders,
      lowStock,
      outOfStock,
      avgOrder,
      topProducts,
      daily,
    ] = await Promise.all([
      Product.countDocuments({ active: true }),
      User.countDocuments({ role: "CUSTOMER", isActive: { $ne: false } }),
      Order.countDocuments(orderMatch),
      Order.aggregate([
        { $match: { ...orderMatch, status: "DELIVERED" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({
        ...orderMatch,
        status: {
          $in: [
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
          ],
        },
      }),
      Order.countDocuments({ ...orderMatch, status: "CANCELLED" }),
      Product.countDocuments({
        active: true,
        stock: { $gt: 0 },
        $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      }),
      Product.countDocuments({ active: true, stock: 0 }),
      Order.aggregate([
        { $match: { ...orderMatch, status: { $ne: "CANCELLED" } } },
        { $group: { _id: null, value: { $avg: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { ...orderMatch, status: { $ne: "CANCELLED" } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            quantity: { $sum: "$items.quantity" },
            revenue: {
              $sum: { $multiply: ["$items.price", "$items.quantity"] },
            },
          },
        },
        { $sort: { quantity: -1 } },
        { $limit: 8 },
      ]),
      Order.aggregate([
        { $match: orderMatch },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 60 },
      ]),
    ]);
    return NextResponse.json({
      stats: {
        products,
        customers,
        orders,
        revenue: Number(deliveredRevenue[0]?.total || 0),
        pendingOrders,
        cancelledOrders,
        lowStock,
        outOfStock,
        averageOrderValue: Number(avgOrder[0]?.value || 0),
        topProducts,
        daily: daily.map((item) => ({
          date: item._id,
          orders: item.orders,
          revenue: item.revenue,
        })),
      },
    });
  } catch (e) {
    const forbidden = e instanceof Error && e.message === "FORBIDDEN";
    return NextResponse.json(
      { error: forbidden ? "Forbidden" : "Unauthorized" },
      { status: forbidden ? 403 : 401 },
    );
  }
}
