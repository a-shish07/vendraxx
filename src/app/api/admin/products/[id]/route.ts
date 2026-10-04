import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import mongoose from "mongoose";
import { productInput } from "@/lib/product-input";
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
        { error: "Product not found." },
        { status: 404 },
      );
    await connectDB();
    const product: any = await Product.findById(id).lean();
    return product
      ? NextResponse.json({
          product: { ...product, id: String(product._id), _id: undefined },
        })
      : NextResponse.json({ error: "Product not found." }, { status: 404 });
  } catch (e) {
    const forbidden = e instanceof Error && e.message === "FORBIDDEN";
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      {
        error: forbidden
          ? "Forbidden"
          : unauthorized
            ? "Unauthorized"
            : "Unable to load product.",
      },
      { status: forbidden ? 403 : unauthorized ? 401 : 500 },
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
        { error: "Product not found." },
        { status: 404 },
      );
    const body = await req.json();
    const input = productInput(body, true);
    await connectDB();
    const product: any = await Product.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true },
    ).lean();
    return product
      ? NextResponse.json({
          product: { ...product, id: String(product._id), _id: undefined },
        })
      : NextResponse.json({ error: "Product not found." }, { status: 404 });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    if (e && typeof e === "object" && "code" in e && e.code === 11000)
      return NextResponse.json(
        { error: "A product with that slug or SKU already exists." },
        { status: 409 },
      );
    const forbidden = e instanceof Error && e.message === "FORBIDDEN";
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      {
        error: forbidden
          ? "Forbidden"
          : unauthorized
            ? "Unauthorized"
            : e instanceof Error
              ? e.message
              : "Unable to update product.",
      },
      { status: forbidden ? 403 : unauthorized ? 401 : 400 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(req);
    await requireAdmin();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    await connectDB();
    const result = await Product.updateOne(
      { _id: id },
      { $set: { active: false } },
    );
    return result.matchedCount
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "Product not found." }, { status: 404 });
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
            : "Unable to deactivate product.",
      },
      { status: forbidden ? 403 : unauthorized ? 401 : 500 },
    );
  }
}
