import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/auth";
import Address from "@/models/Address";
import { assertSameOrigin, securityError } from "@/lib/security";

const fields = [
  "fullName",
  "phone",
  "addressLine1",
  "addressLine2",
  "landmark",
  "city",
  "state",
  "pincode",
  "country",
] as const;
function addressValues(body: Record<string, unknown>) {
  const values = Object.fromEntries(
    fields.map((field) => [field, String(body[field] ?? "").trim()]),
  ) as Record<(typeof fields)[number], string>;
  values.phone = values.phone.replace(/\D/g, "");
  if (
    values.fullName.length < 2 ||
    !/^[6-9]\d{9}$/.test(values.phone) ||
    !values.addressLine1 ||
    !values.city ||
    !values.state ||
    !/^\d{6}$/.test(values.pincode)
  )
    throw new Error(
      "Enter a name, valid Indian phone number, street address, city, state and 6-digit pincode.",
    );
  values.country ||= "India";
  return values;
}

export async function GET() {
  try {
    const user = await requireUser();
    await connectDB();
    const addresses = await Address.find({ userId: user.sub })
      .sort({ isDefault: -1, updatedAt: -1 })
      .lean();
    return NextResponse.json({
      addresses: addresses.map((a) => ({
        ...a,
        id: String(a._id),
        _id: undefined,
      })),
    });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "Unable to load addresses." },
      { status: unauthorized ? 401 : 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const user = await requireUser();
    const body = await req.json();
    const values = addressValues(body);
    await connectDB();
    if (body.isDefault)
      await Address.updateMany(
        { userId: user.sub },
        { $set: { isDefault: false } },
      );
    const hasDefault = Boolean(
      await Address.exists({ userId: user.sub, isDefault: true }),
    );
    const address = await Address.create({
      ...values,
      userId: user.sub,
      isDefault: Boolean(body.isDefault) || !hasDefault,
    });
    return NextResponse.json(
      {
        address: {
          ...address.toObject(),
          id: String(address._id),
          _id: undefined,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      {
        error: unauthorized
          ? "Unauthorized"
          : e instanceof Error
            ? e.message
            : "Unable to save address.",
      },
      { status: unauthorized ? 401 : 400 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    assertSameOrigin(req);
    const user = await requireUser();
    const body = await req.json();
    const id = String(body.id || "");
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    const values = addressValues(body);
    await connectDB();
    const ownedAddress = await Address.findOne({ _id: id, userId: user.sub })
      .select("_id")
      .lean();
    if (!ownedAddress)
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    if (body.isDefault)
      await Address.updateMany(
        { userId: user.sub },
        { $set: { isDefault: false } },
      );
    const address: any = await Address.findOneAndUpdate(
      { _id: id, userId: user.sub },
      { $set: { ...values, isDefault: Boolean(body.isDefault) } },
      { new: true, runValidators: true },
    ).lean();
    return address
      ? NextResponse.json({
          address: { ...address, id: String(address._id), _id: undefined },
        })
      : NextResponse.json({ error: "Address not found." }, { status: 404 });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      {
        error: unauthorized
          ? "Unauthorized"
          : e instanceof Error
            ? e.message
            : "Unable to update address.",
      },
      { status: unauthorized ? 401 : 400 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    assertSameOrigin(req);
    const user = await requireUser();
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    await connectDB();
    const address = await Address.findOneAndDelete({
      _id: id,
      userId: user.sub,
    });
    if (!address)
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    if (address.isDefault) {
      const replacement = await Address.findOne({ userId: user.sub }).sort({
        updatedAt: -1,
      });
      if (replacement) {
        replacement.isDefault = true;
        await replacement.save();
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const safe = securityError(e);
    if (safe) return safe;
    const unauthorized = e instanceof Error && e.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "Unable to delete address." },
      { status: unauthorized ? 401 : 500 },
    );
  }
}
