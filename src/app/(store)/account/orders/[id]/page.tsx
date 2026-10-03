'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Order = { id: string; orderNumber: string; status: string; statusHistory: { status: string; note?: string; at: string }[]; items: { productId: string; name: string; image: string; price: number; quantity: number }[]; subtotal: number; shipping: number; total: number; customer: { name: string; address: string; city: string; state: string; pincode: string }; paymentMethod: string }

export default function OrderDetails() {
  const id = useParams<{ id: string }>()?.id
  const [order, setOrder] = useState<Order | null | undefined>()
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const load = async () => { const response = await fetch(`/api/orders/${encodeURIComponent(id || '')}`, { cache: 'no-store' }); if (!response.ok) throw new Error('Order not found.'); const data = await response.json(); setOrder(data.order) }
  useEffect(() => { if (id) void load().catch(() => setOrder(null)) }, [id])
  const cancel = async () => {
    setSaving(true); setError('')
    try { const response = await fetch(`/api/orders/${encodeURIComponent(id || '')}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to cancel order.'); await load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to cancel order.') }
    finally { setSaving(false) }
  }
  if (order === undefined) return <div className="p-16 text-center">Loading order…</div>
  if (!order) return <div className="p-16 text-center">Order not found.</div>
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status)
  return <div className="mx-auto max-w-4xl px-4 py-12"><p className="text-xs font-bold uppercase tracking-widest text-accent">Order details</p><h1 className="mt-2 font-display text-3xl text-brand">{order.orderNumber}</h1><div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]"><div className="space-y-3">{order.items.map(i=><div key={i.productId} className="flex gap-4 rounded-xl border bg-white p-4"><img src={i.image} alt="" className="h-20 w-20 rounded-lg bg-slate-50 object-contain"/><div><p className="font-semibold">{i.name}</p><p className="text-sm text-slate-500">{i.quantity} × ₹{i.price.toLocaleString('en-IN')}</p></div></div>)}<div className="rounded-xl border bg-white p-5"><p className="font-semibold">Delivery address</p><p className="mt-2 text-sm text-slate-600">{order.customer?.name}<br/>{order.customer?.address}<br/>{order.customer?.city}, {order.customer?.state} {order.customer?.pincode}</p><p className="mt-3 text-sm text-slate-600">Payment: Cash on Delivery</p></div></div><div className="rounded-xl border bg-slate-50 p-5"><p className="font-semibold">Status</p><p className="mt-2 font-bold text-accent">{order.status.replaceAll('_',' ')}</p><div className="mt-5 space-y-3">{order.statusHistory?.map((s,i)=><div key={`${s.status}-${s.at}-${i}`} className="border-l-2 border-accent pl-3"><p className="text-sm font-semibold">{s.status.replaceAll('_',' ')}</p>{s.note&&<p className="text-xs text-slate-500">{s.note}</p>}<p className="text-xs text-slate-500">{new Date(s.at).toLocaleString('en-IN')}</p></div>)}</div><div className="mt-6 border-t pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div><div className="mt-2 flex justify-between"><span>Shipping</span><span>{order.shipping?'₹'+order.shipping:'Free'}</span></div><div className="mt-3 flex justify-between font-bold"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div></div>{canCancel&&<div className="mt-5 border-t pt-4"><label className="text-sm font-medium">Cancellation reason<textarea value={reason} onChange={event=>setReason(event.target.value)} maxLength={500} className="mt-2 min-h-20 w-full rounded-lg border bg-white p-2"/></label>{error&&<p className="mt-2 text-sm text-red-600">{error}</p>}<button disabled={saving||reason.trim().length<5} onClick={cancel} className="mt-3 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">{saving?'Cancelling…':'Cancel order'}</button></div>}</div></div></div>
}
