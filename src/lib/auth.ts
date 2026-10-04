import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { connectDB } from "./mongodb";
import User from "../models/User";

function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32)
    throw new Error("AUTH_SECRET must be set to at least 32 characters.");
  return new TextEncoder().encode(value);
}

const COOKIE = "vendrax_session";
const MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  role: "CUSTOMER" | "ADMIN";
  email: string;
  name: string;
  sessionVersion: number;
};

type SessionUser = {
  id: string;
  role: "CUSTOMER" | "ADMIN";
  email: string;
  name: string;
  sessionVersion?: number;
};

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    role: user.role,
    email: user.email,
    name: user.name,
    sessionVersion: user.sessionVersion ?? 0,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
    priority: "high",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (
      !payload.sub ||
      (payload.role !== "CUSTOMER" && payload.role !== "ADMIN")
    )
      return null;
    const sessionVersion = Number(payload.sessionVersion);
    return {
      sub: String(payload.sub),
      role: payload.role,
      email: String(payload.email || ""),
      name: String(payload.name || ""),
      sessionVersion: Number.isSafeInteger(sessionVersion) ? sessionVersion : 0,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  await connectDB();
  const user: any = await User.findById(session.sub)
    .select(
      "_id role email name phone avatar createdAt isActive sessionVersion",
    )
    .lean();
  if (
    !user ||
    user.isActive === false ||
    Number(user.sessionVersion || 0) !== session.sessionVersion
  )
    throw new Error("UNAUTHORIZED");
  return {
    sub: String(user._id),
    role: user.role as SessionPayload["role"],
    email: user.email,
    name: user.name,
    phone: user.phone || "",
    avatar: user.avatar || "",
    createdAt: user.createdAt,
    sessionVersion: Number(user.sessionVersion || 0),
  };
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.role !== "ADMIN") throw new Error("FORBIDDEN");
  return session;
}

export async function getUserById(id: string) {
  await connectDB();
  return User.findById(id)
    .select("_id name email role phone avatar createdAt isActive")
    .lean();
}
