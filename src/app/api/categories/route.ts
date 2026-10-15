import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import { assertSameOrigin, securityError } from "@/lib/security";

export async function GET() {
  try {
    await connectDB();
    const [saved, rows] = await Promise.all([
      Category.find().sort({ name: 1 }).lean(),
      Product.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          subcategories: { $addToSet: "$subcategory" },
        },
      },
      { $sort: { _id: 1 } },
      ]),
    ]);
    const categories = new Map<string, { name: string; count: number; subcategories: Set<string> }>();
    for (const category of saved) {
      categories.set(category.name, {
        name: category.name,
        count: 0,
        subcategories: new Set(
          category.subcategories.map((item: { name: string }) => item.name),
        ),
      });
    }
    for (const row of rows) {
      const category = categories.get(row._id) || {
        name: row._id,
        count: 0,
        subcategories: new Set<string>(),
      };
      category.count = row.count;
      for (const subcategory of row.subcategories || []) {
        if (subcategory) category.subcategories.add(subcategory);
      }
      categories.set(row._id, category);
    }
    return NextResponse.json({
      categories: [...categories.values()]
        .map((category) => ({
          name: category.name,
          count: category.count,
          subcategories: [...category.subcategories].sort(),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}

function categoryName(value: unknown, label: string) {
  if (typeof value !== "string") throw new Error(`A ${label} is required.`);
  const name = value.trim();
  if (!name || name.length > 100) throw new Error(`Invalid ${label}.`);
  return name;
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    await requireAdmin();
    const body = await req.json();
    const name = categoryName(body.name, "category name");
    const subcategory = body.subcategory
      ? categoryName(body.subcategory, "subcategory name")
      : "";
    await connectDB();
    const category = await Category.create({
      name,
      subcategories: subcategory ? [{ name: subcategory }] : [],
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    const safe = securityError(error);
    if (safe) return safe;
    if (error && typeof error === "object" && "code" in error && error.code === 11000)
      return NextResponse.json({ error: "That category already exists." }, { status: 409 });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create category." },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    assertSameOrigin(req);
    await requireAdmin();
    const body = await req.json();
    const name = categoryName(body.name, "category name");
    const subcategory = categoryName(body.subcategory, "subcategory name");
    await connectDB();
    const category = await Category.findOneAndUpdate(
      { name, "subcategories.name": { $ne: subcategory } },
      { $addToSet: { subcategories: { name: subcategory } } },
      { new: true },
    );
    if (!category) {
      const exists = await Category.exists({ name });
      return NextResponse.json(
        { error: exists ? "That subcategory already exists." : "Category not found." },
        { status: exists ? 409 : 404 },
      );
    }
    return NextResponse.json({ category });
  } catch (error) {
    const safe = securityError(error);
    if (safe) return safe;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add subcategory." },
      { status: 400 },
    );
  }
}
