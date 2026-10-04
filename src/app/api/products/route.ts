import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"),
      subcategory = searchParams.get("subcategory"),
      q = searchParams.get("search") || searchParams.get("q"),
      featured = searchParams.get("featured");
    const requestedPage = Number(searchParams.get("page") || 1);
    const requestedLimit = Number(
      searchParams.get("limit") || (searchParams.has("page") ? 24 : 0),
    );
    const page = Number.isSafeInteger(requestedPage)
      ? Math.min(100000, Math.max(1, requestedPage))
      : 1;
    const limit = Number.isSafeInteger(requestedLimit)
      ? Math.min(100, Math.max(0, requestedLimit))
      : 24;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const escapeRegex = (value: string) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 100);
    const filter: Record<string, unknown> = { active: true };
    if (category && category !== "all") filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (featured === "true") filter.featured = true;
    if (minPrice || maxPrice) {
      const price: Record<string, number> = {};
      if (
        minPrice &&
        Number.isFinite(Number(minPrice)) &&
        Number(minPrice) >= 0
      )
        price.$gte = Number(minPrice);
      if (
        maxPrice &&
        Number.isFinite(Number(maxPrice)) &&
        Number(maxPrice) >= 0
      )
        price.$lte = Number(maxPrice);
      if (Object.keys(price).length) filter.price = price;
    }
    if (q) {
      const safeQuery = escapeRegex(q);
      filter.$or = [
        { name: { $regex: safeQuery, $options: "i" } },
        { category: { $regex: safeQuery, $options: "i" } },
        { subcategory: { $regex: safeQuery, $options: "i" } },
        { description: { $regex: safeQuery, $options: "i" } },
        { sku: { $regex: safeQuery, $options: "i" } },
      ];
    }
    const sortKey = searchParams.get("sort");
    const sort: Record<string, 1 | -1> =
      sortKey === "price-asc"
        ? { price: 1 }
        : sortKey === "price-desc"
          ? { price: -1 }
          : sortKey === "name"
            ? { name: 1 }
            : sortKey === "newest"
              ? { createdAt: -1 }
              : { featured: -1, createdAt: -1 };
    let query = Product.find(filter).sort(sort);
    if (limit > 0) {
      query = query.limit(limit);
      if (searchParams.has("page")) query = query.skip((page - 1) * limit);
    }
    const products = await query.lean();
    const response: Record<string, unknown> = {
      products: products.map((p) => ({
        ...p,
        id: String(p._id),
        images: p.images ?? [],
        _id: undefined,
      })),
    };
    if (searchParams.has("page") && limit > 0) {
      const total = await Product.countDocuments(filter);
      response.pagination = {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      };
    }
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Unable to load products." },
      { status: 500 },
    );
  }
}
