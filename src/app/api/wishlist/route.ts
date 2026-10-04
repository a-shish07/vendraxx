import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/auth";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { assertSameOrigin, securityError } from "@/lib/security";

export async function GET() {
  try {
    const user = await requireUser();
    await connectDB();
    const wishlist: any = await Wishlist.findOne({ userId: user.sub }).lean();
    if (!wishlist?.productIds.length)
      return NextResponse.json({ products: [] });
    const products = await Product.find({
      _id: { $in: wishlist.productIds },
      active: true,
    }).lean();
    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        id: String(p._id),
        images: p.images ?? [],
        _id: undefined,
      })),
    });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "Unable to load wishlist." },
      { status: unauthorized ? 401 : 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    assertSameOrigin(req);
    const user = await requireUser();
    const body = await req.json();
    const productId = String(body.productId || "");
    if (
      !mongoose.isValidObjectId(productId) ||
      !["add", "remove"].includes(body.action)
    )
      return NextResponse.json(
        { error: "Invalid wishlist request." },
        { status: 400 },
      );
    await connectDB();
    if (body.action === "add") {
      if (!(await Product.exists({ _id: productId, active: true })))
        return NextResponse.json(
          { error: "Product is unavailable." },
          { status: 404 },
        );
      await Wishlist.updateOne(
        { userId: user.sub },
        { $addToSet: { productIds: productId } },
        { upsert: true, runValidators: true },
      );
    } else
      await Wishlist.updateOne(
        { userId: user.sub },
        { $pull: { productIds: productId } },
      );
    return NextResponse.json({ ok: true });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "Unable to update wishlist." },
      { status: unauthorized ? 401 : 500 },
    );
  }
}
