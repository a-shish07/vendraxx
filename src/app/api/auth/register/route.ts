import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { createSession } from "@/lib/auth";
import { assertSameOrigin, rateLimit, securityError } from "@/lib/security";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const limit = rateLimit(req, "register", 5, 15 * 60 * 1000);
    if (!limit.ok)
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const phone = String(body.phone || "").replace(/\D/g, "");
    if (
      name.length < 2 ||
      name.length > 100 ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      !/^[6-9]\d{9}$/.test(phone) ||
      password.length < 10 ||
      password.length > 128 ||
      password !== body.confirmPassword
    )
      return NextResponse.json(
        {
          error:
            "Enter a valid name, email and 10-digit Indian phone number. Use a password of at least 10 characters and confirm it.",
        },
        { status: 400 },
      );
    await connectDB();
    if (await User.findOne({ email }).select("_id").lean())
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    const user: any = await User.create({
      name,
      email,
      phone,
      passwordHash: await bcrypt.hash(password, 12),
      role: "CUSTOMER",
      sessionVersion: 0,
    });
    await createSession({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      sessionVersion: 0,
    });
    return NextResponse.json(
      {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: "",
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const safe = securityError(error);
    if (safe) return safe;
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    )
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 },
    );
  }
}
