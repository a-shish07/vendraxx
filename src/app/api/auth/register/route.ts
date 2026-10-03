import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { createSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body.name || '').trim(), email = String(body.email || '').trim().toLowerCase(), password = String(body.password || ''), phone = String(body.phone || '').replace(/\D/g, '')
    if (name.length < 2 || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || !/^[6-9]\d{9}$/.test(phone) || password.length < 10 || password.length > 128 || password !== body.confirmPassword) return NextResponse.json({ error: 'Enter a valid name, email and 10-digit Indian phone number. Use a password of at least 10 characters and confirm it.' }, { status: 400 })
    await connectDB()
    if (await User.findOne({ email })) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    const user = await User.create({ name, email, phone, passwordHash: await bcrypt.hash(password, 12), role: 'CUSTOMER' })
    await createSession({ id: String(user._id), name: user.name, email: user.email, role: user.role })
    return NextResponse.json({ user: { id: String(user._id), name: user.name, email: user.email, role: user.role } }, { status: 201 })
  } catch (error) { if (error && typeof error === 'object' && 'code' in error && error.code === 11000) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 }); return NextResponse.json({ error: 'Unable to create account.' }, { status: 500 }) }
}
