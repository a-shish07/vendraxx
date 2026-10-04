import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { productInput } from "@/lib/product-input";
import { assertSameOrigin, securityError } from "@/lib/security";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const params = new URL(req.url).searchParams;

    const page = Math.max(
      1,
      Number(params.get("page") || 1) || 1,
    );

    const limit = Math.min(
      50,
      Math.max(
        10,
        Number(params.get("limit") || 50) || 50,
      ),
    );

    const search = (params.get("search") || "")
      .trim()
      .slice(0, 100);

    const category = (params.get("category") || "").trim();
    const stock = params.get("stock") || "";
    const active = params.get("active") || "";

    // Read sorting option from query parameters
    const sortBy = params.get("sortBy") || "";

    const filter: Record<string, any> = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (active === "active") {
      filter.active = true;
    }

    if (active === "inactive") {
      filter.active = false;
    }

    if (stock === "out") {
      filter.stock = 0;
    }

    if (stock === "low") {
      filter.$expr = {
        $and: [
          { $gt: ["$stock", 0] },
          {
            $lte: [
              "$stock",
              "$lowStockThreshold",
            ],
          },
        ],
      };
    }

    if (stock === "healthy") {
      filter.$expr = {
        $gt: [
          "$stock",
          "$lowStockThreshold",
        ],
      };
    }

    if (search) {
      const safe = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      filter.$or = [
        {
          name: {
            $regex: safe,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: safe,
            $options: "i",
          },
        },
        {
          category: {
            $regex: safe,
            $options: "i",
          },
        },
        {
          subcategory: {
            $regex: safe,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: safe,
            $options: "i",
          },
        },
      ];
    }

    /*
     * Sorting
     *
     * price-low  -> lowest price first
     * price-high -> highest price first
     * stock      -> lowest stock first
     * default    -> newest products first
     *
     * Explicit typing prevents the TypeScript/Mongoose
     * incompatibility that caused the build error.
     */
    const sort: Record<string, 1 | -1> =
      sortBy === "price-low"
        ? { price: 1 }
        : sortBy === "price-high"
          ? { price: -1 }
          : sortBy === "stock"
            ? { stock: 1 }
            : { createdAt: -1 };

    const [products, total, summary] =
      await Promise.all([
        Product.find(filter)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),

        Product.countDocuments(filter),

        Promise.all([
          Product.countDocuments(),

          Product.countDocuments({
            active: true,
          }),

          Product.countDocuments({
            active: true,
            stock: 0,
          }),

          Product.countDocuments({
            active: true,
            $expr: {
              $and: [
                { $gt: ["$stock", 0] },
                {
                  $lte: [
                    "$stock",
                    "$lowStockThreshold",
                  ],
                },
              ],
            },
          }),

          Product.aggregate([
            {
              $match: {
                active: true,
              },
            },
            {
              $group: {
                _id: null,
                stock: {
                  $sum: "$stock",
                },
              },
            },
          ]),
        ]),
      ]);

    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        id: String(p._id),
        images: p.images ?? [],
        _id: undefined,
      })),

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },

      summary: {
        total: summary[0],
        active: summary[1],
        outOfStock: summary[2],
        lowStock: summary[3],
        units: summary[4][0]?.stock || 0,
      },
    });
  } catch (e) {
    const forbidden =
      e instanceof Error &&
      e.message === "FORBIDDEN";

    const unauthorized =
      e instanceof Error &&
      e.message === "UNAUTHORIZED";

    return NextResponse.json(
      {
        error: forbidden
          ? "Forbidden"
          : "Unauthorized",
      },
      {
        status: forbidden
          ? 403
          : unauthorized
            ? 401
            : 500,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);

    await requireAdmin();
    await connectDB();

    const input = productInput(
      await req.json(),
    );

    const product = await Product.create(input);

    return NextResponse.json(
      {
        product: {
          ...product.toObject(),
          id: String(product._id),
          _id: undefined,
        },
      },
      {
        status: 201,
      },
    );
  } catch (e) {
    const safe = securityError(e);

    if (safe) {
      return safe;
    }

    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      e.code === 11000
    ) {
      return NextResponse.json(
        {
          error:
            "A product with that slug or SKU already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const forbidden =
      e instanceof Error &&
      e.message === "FORBIDDEN";

    const unauthorized =
      e instanceof Error &&
      e.message === "UNAUTHORIZED";

    return NextResponse.json(
      {
        error: forbidden
          ? "Forbidden"
          : unauthorized
            ? "Unauthorized"
            : e instanceof Error
              ? e.message
              : "Unable to create product.",
      },
      {
        status: forbidden
          ? 403
          : unauthorized
            ? 401
            : 400,
      },
    );
  }
}