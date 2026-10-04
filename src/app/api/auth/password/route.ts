import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireUser, createSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { assertSameOrigin, securityError } from "@/lib/security";

export async function PATCH(req: Request) {
  try {
    assertSameOrigin(req);
    const session = await requireUser();
    const body = await req.json();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    if (newPassword.length < 10 || newPassword.length > 128)
      return NextResponse.json(
        { error: "New password must be between 10 and 128 characters." },
        { status: 400 },
      );
    if (currentPassword === newPassword)
      return NextResponse.json(
        { error: "New password must be different from the current password." },
        { status: 400 },
      );
    await connectDB();
    const user: any = await User.findById(session.sub);
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash)))
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 },
      );
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.sessionVersion = Number(user.sessionVersion || 0) + 1;
    await user.save();
    await createSession({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      sessionVersion: user.sessionVersion,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const safe = securityError(error);
    if (safe) return safe;
    const unauthorized =
      error instanceof Error && error.message === "UNAUTHORIZED";
    return NextResponse.json(
      {
        error: unauthorized
          ? "Your session has expired. Please sign in again."
          : "Unable to change password.",
      },
      { status: unauthorized ? 401 : 500 },
    );
  }
}
