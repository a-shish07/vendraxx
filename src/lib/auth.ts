import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { connectDB } from './mongodb'
import User from '../models/User'

function getSecret() {
  const value = process.env.AUTH_SECRET
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be set to at least 32 characters.')
  return new TextEncoder().encode(value)
}
const COOKIE = 'vendrax_session'

type SessionPayload = { sub: string; role: 'CUSTOMER' | 'ADMIN'; email: string; name: string }

export async function createSession(user: { id: string; role: 'CUSTOMER' | 'ADMIN'; email: string; name: string }) {
  const token = await new SignJWT({ role: user.role, email: user.email, name: user.name })
    .setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuedAt().setExpirationTime('7d').sign(getSecret())
  const store = await cookies()
  store.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 })
}

export async function clearSession() { (await cookies()).delete(COOKIE) }

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (!payload.sub || (payload.role !== 'CUSTOMER' && payload.role !== 'ADMIN')) return null
    return { sub: String(payload.sub), role: payload.role, email: String(payload.email), name: String(payload.name) }
  }
  catch { return null }
}

export async function requireUser() {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHORIZED')
  await connectDB()
  const user: any = await User.findById(session.sub).select('_id role email name isActive').lean()
  if (!user || user.isActive === false) throw new Error('UNAUTHORIZED')
  return { sub: String(user._id), role: user.role as SessionPayload['role'], email: user.email, name: user.name }
}

export async function requireAdmin() {
  const session = await requireUser()
  if (session.role !== 'ADMIN') throw new Error('FORBIDDEN')
  return session
}

export async function getUserById(id: string) {
  await connectDB()
  return User.findById(id).select('_id name email role phone').lean()
}
