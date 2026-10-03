import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth'

const nextStatus: Record<string, string> = {
  PENDING: 'CONFIRMED', CONFIRMED: 'PROCESSING', PROCESSING: 'SHIPPED',
  SHIPPED: 'OUT_FOR_DELIVERY', OUT_FOR_DELIVERY: 'DELIVERED',
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let session: mongoose.ClientSession | undefined
  try {
    const admin = await requireAdmin()
    const { id } = await params
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    const body = await req.json()
    const status = String(body.status || '')
    const note = String(body.note || '').trim().slice(0, 500)
    if (!['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    await connectDB()
    if (status === 'CANCELLED') {
      if (note.length < 5) return NextResponse.json({ error: 'Provide a cancellation reason.' }, { status: 400 })
      session = await mongoose.startSession()
      let changed = false
      await session.withTransaction(async () => {
        const order = await Order.findOneAndUpdate(
          { _id: id, status: { $in: ['PENDING', 'CONFIRMED'] } },
          { $set: { status, cancellationReason: note, cancelledBy: admin.sub, cancelledAt: new Date() }, $push: { statusHistory: { status, note, changedBy: admin.sub, at: new Date() } } },
          { new: true, session },
        )
        if (!order) return
        for (const item of order.items) await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } }).session(session!)
        changed = true
      })
      if (!changed) return NextResponse.json({ error: 'Only pending or confirmed orders can be cancelled.' }, { status: 409 })
    } else {
      const order: any = await Order.findById(id).select('status').lean()
      if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
      if (nextStatus[order.status] !== status) return NextResponse.json({ error: 'Order status must advance one step at a time.' }, { status: 409 })
      const changed = await Order.updateOne({ _id: id, status: order.status }, { $set: { status, ...(status === 'DELIVERED' ? { paymentStatus: 'COD' } : {}) }, $push: { statusHistory: { status, note, changedBy: admin.sub, at: new Date() } } })
      if (!changed.modifiedCount) return NextResponse.json({ error: 'Order changed. Reload and try again.' }, { status: 409 })
    }
    const updated: any = await Order.findById(id).lean()
    return NextResponse.json({ order: updated ? { ...updated, id: String(updated._id), _id: undefined } : null })
  } catch (e) {
    const forbidden = e instanceof Error && e.message === 'FORBIDDEN'
    const unauthorized = e instanceof Error && e.message === 'UNAUTHORIZED'
    return NextResponse.json({ error: forbidden ? 'Forbidden' : unauthorized ? 'Unauthorized' : 'Unable to update order.' }, { status: forbidden ? 403 : unauthorized ? 401 : 500 })
  } finally { await session?.endSession() }
}
