import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import mongoose from 'mongoose'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await connectDB(); const { id } = await params; const filter = mongoose.isValidObjectId(id) ? { $or: [{ slug: id }, { _id: id }], active: true } : { slug: id, active: true }; const p: any = await Product.findOne(filter).lean(); if (!p) return NextResponse.json({ error: 'Product not found' }, { status: 404 }); return NextResponse.json({ product: { ...p, id: String(p._id), images: p.images ?? [], _id: undefined } }) }
  catch { return NextResponse.json({ error: 'Unable to load product.' }, { status: 500 }) }
}
