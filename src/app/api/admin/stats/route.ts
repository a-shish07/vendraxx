import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'
export async function GET() { try { await requireAdmin(); await connectDB(); const [products, customers, orders, revenue] = await Promise.all([Product.countDocuments({ active: true }), User.countDocuments({ role: 'CUSTOMER', isActive: { $ne: false } }), Order.countDocuments(), Order.aggregate([{ $match: { status: 'DELIVERED' } }, { $group: { _id: null, total: { $sum: '$total' } } }])]); return NextResponse.json({ stats: { products, customers, orders, revenue: revenue[0]?.total || 0 } }) } catch (e) { const forbidden = e instanceof Error && e.message === 'FORBIDDEN'; return NextResponse.json({ error: forbidden ? 'Forbidden' : 'Unauthorized' }, { status: forbidden ? 403 : 401 }) } }
