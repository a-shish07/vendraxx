import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAdmin } from '@/lib/auth'
export async function GET() { try { await requireAdmin(); await connectDB(); const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email').lean(); return NextResponse.json({ orders: orders.map(o => ({ ...o, id: String(o._id), _id: undefined })) }) } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) } }
