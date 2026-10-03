import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth'
import { productInput } from '@/lib/product-input'

export async function GET(req: Request) {
  try {
    await requireAdmin(); await connectDB()
    const params = new URL(req.url).searchParams; const page = Math.max(1, Number(params.get('page') || 1)); const limit = Math.min(100, Math.max(1, Number(params.get('limit') || 50)))
    const [products, total] = await Promise.all([Product.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Product.countDocuments()])
    return NextResponse.json({ products: products.map(p => ({ ...p, id: String(p._id), _id: undefined })), page, pages: Math.ceil(total / limit), total })
  } catch (e) { const forbidden = e instanceof Error && e.message === 'FORBIDDEN'; return NextResponse.json({ error: forbidden ? 'Forbidden' : 'Unauthorized' }, { status: forbidden ? 403 : 401 }) }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(); await connectDB(); const input = productInput(await req.json())
    const product = await Product.create(input)
    return NextResponse.json({ product: { ...product.toObject(), id: String(product._id) } }, { status: 201 })
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 11000) return NextResponse.json({ error: 'A product with that slug or SKU already exists.' }, { status: 409 })
    const forbidden = e instanceof Error && e.message === 'FORBIDDEN'; const unauthorized = e instanceof Error && e.message === 'UNAUTHORIZED'
    return NextResponse.json({ error: forbidden ? 'Forbidden' : unauthorized ? 'Unauthorized' : e instanceof Error ? e.message : 'Unable to create product.' }, { status: forbidden ? 403 : unauthorized ? 401 : 400 })
  }
}
