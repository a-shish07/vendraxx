import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { assertSameOrigin, rateLimit, securityError } from "@/lib/security";

export async function PATCH(req: Request) {
  try {
    assertSameOrigin(req);
    const limit = rateLimit(req, "admin-credentials", 5, 10 * 60 * 1000);
    if (!limit.ok)
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    const session = await requireAdmin();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254)
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (!currentPassword || currentPassword.length > 128)
      return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
    if (newPassword && (newPassword.length < 10 || newPassword.length > 128))
      return NextResponse.json({ error: "New password must be between 10 and 128 characters." }, { status: 400 });
    if (newPassword && newPassword === currentPassword)
      return NextResponse.json({ error: "New password must be different from the current password." }, { status: 400 });

    await connectDB();
    const user: any = await User.findById(session.sub).select("+passwordHash");
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash)))
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    const emailInUse = await User.exists({ email, _id: { $ne: user._id } });
    if (emailInUse)
      return NextResponse.json({ error: "That email address is already in use." }, { status: 409 });

    user.email = email;
    if (newPassword) user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.sessionVersion = Number(user.sessionVersion || 0) + 1;
    await user.save();
    await createSession({
      id: String(user._id), name: user.name, email: user.email,
      role: user.role, sessionVersion: user.sessionVersion,
    });
    return NextResponse.json({ user: { email: user.email } });
  } catch (error) {
    const safe = securityError(error);
    if (safe) return safe;
    const unauthorized = error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json(
      { error: unauthorized ? "Your session has expired. Please sign in again." : "Unable to update credentials." },
      { status: unauthorized ? 401 : 400 },
    );
  }
}
