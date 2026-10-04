import { NextResponse } from "next/server";
import { clearSession, getSession } from "@/lib/auth";
import { assertSameOrigin, securityError } from "@/lib/security";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const session = await getSession();
    if (session) {
      await connectDB();
      await User.updateOne(
        { _id: session.sub, sessionVersion: session.sessionVersion },
        { $inc: { sessionVersion: 1 } },
      );
    }
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const safe = securityError(error);
    if (safe) return safe;
    await clearSession().catch(() => undefined);
    return NextResponse.json({ ok: true });
  }
}
