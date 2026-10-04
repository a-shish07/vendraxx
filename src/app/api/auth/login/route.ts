import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { createSession } from "@/lib/auth";
import { assertSameOrigin, rateLimit, securityError } from "@/lib/security";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const limit = rateLimit(req, "login", 8, 10 * 60 * 1000);
    if (!limit.ok)
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    if (
      !/^\S+@\S+\.\S+$/.test(email) ||
      password.length < 1 ||
      password.length > 128
    )
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    await connectDB();
    const user: any = await User.findOne({ email }).select(
      "+passwordHash _id name email role phone avatar createdAt isActive sessionVersion",
    );
    console.log("LOGIN USER:", {
      id: String(user?._id),
      email: user?.email,
      hasPasswordHash: typeof user?.passwordHash === "string",
      passwordHashLength: user?.passwordHash?.length,
    });
    if (
      !user ||
      user.isActive === false ||
      typeof user.passwordHash !== "string" ||
      !user.passwordHash
    ) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }
    await createSession({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      sessionVersion: Number(user.sessionVersion || 0),
    });
    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        avatar: user.avatar || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    const safe = securityError(error);
    if (safe) return safe;

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown login error"
            : "Unable to sign in.",
      },
      { status: 500 },
    );
  }
}
