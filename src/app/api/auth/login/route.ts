import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { createSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json(); const email = String(body.email || '').trim().toLowerCase(); const password = String(body.password || '')
    await connectDB(); const user = await User.findOne({ email })
    if (!user || user.isActive === false || !(await bcrypt.compare(password, user.passwordHash))) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    await createSession({ id: String(user._id), name: user.name, email: user.email, role: user.role })
    return NextResponse.json({ user: { id: String(user._id), name: user.name, email: user.email, role: user.role } })
  } catch { return NextResponse.json({ error: 'Unable to sign in.' }, { status: 500 }) }
}
