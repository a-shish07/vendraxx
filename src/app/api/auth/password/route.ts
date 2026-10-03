import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { requireUser } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function PATCH(req: Request) {
  try {
    const session = await requireUser(); const body = await req.json()
    const currentPassword = String(body.currentPassword || ''); const newPassword = String(body.newPassword || '')
    if (newPassword.length < 10 || newPassword.length > 128) return NextResponse.json({ error: 'New password must be between 10 and 128 characters.' }, { status: 400 })
    await connectDB(); const user = await User.findById(session.sub)
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    user.passwordHash = await bcrypt.hash(newPassword, 12); await user.save()
    return NextResponse.json({ ok: true })
  } catch (e) { const unauthorized = e instanceof Error && e.message === 'UNAUTHORIZED'; return NextResponse.json({ error: unauthorized ? 'Unauthorized' : 'Unable to change password.' }, { status: unauthorized ? 401 : 500 }) }
}
