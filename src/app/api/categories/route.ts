import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
export async function GET() { try { await connectDB(); const categories = await Product.distinct('category', { active: true }); return NextResponse.json({ categories }) } catch { return NextResponse.json({ categories: [] }) } }
