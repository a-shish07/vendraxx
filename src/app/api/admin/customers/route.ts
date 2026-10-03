import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'
export async function GET() { try { await requireAdmin(); await connectDB(); const customers = await User.find({ role: 'CUSTOMER' }).select('_id name email phone createdAt').sort({ createdAt: -1 }).lean(); return NextResponse.json({ customers: customers.map(u => ({ ...u, id: String(u._id), _id: undefined })) }) } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) } }
