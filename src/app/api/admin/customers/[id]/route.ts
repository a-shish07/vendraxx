import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { requireAdmin } from '@/lib/auth'
import User from '@/models/User'
import Order from '@/models/Order'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(); const { id } = await params
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 })
    await connectDB()
    const [user, orders] = await Promise.all([
      User.findOne({ _id: id, role: 'CUSTOMER' }).select('_id name email phone avatar createdAt isActive').lean() as any,
      Order.find({ userId: id }).sort({ createdAt: -1 }).limit(100).lean(),
    ])
    if (!user) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 })
    return NextResponse.json({ customer: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, isActive: user.isActive, createdAt: user.createdAt }, orders: orders.map(order => ({ ...order, id: String(order._id), _id: undefined })) })
  } catch (e) { const forbidden = e instanceof Error && e.message === 'FORBIDDEN'; const unauthorized = e instanceof Error && e.message === 'UNAUTHORIZED'; return NextResponse.json({ error: forbidden ? 'Forbidden' : unauthorized ? 'Unauthorized' : 'Unable to load customer.' }, { status: forbidden ? 403 : unauthorized ? 401 : 500 }) }
}
