import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const rows = await Product.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          subcategories: { $addToSet: "$subcategory" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return NextResponse.json({
      categories: rows.map((row) => ({
        name: row._id,
        count: row.count,
        subcategories: row.subcategories.filter(Boolean).sort(),
      })),
    });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
