'use client'

import { useEffect, useState } from 'react'

type History = { status: string; note?: string; at: string }
type Order = { id: string; orderNumber: string; status: string; total: number; createdAt: string; items: { name: string; quantity: number }[]; userId?: { name: string; email: string }; customer?: { name: string; phone: string }; statusHistory?: History[] }
const nextStatus: Record<string, string> = { PENDING: 'CONFIRMED', CONFIRMED: 'PROCESSING', PROCESSING: 'SHIPPED', SHIPPED: 'OUT_FOR_DELIVERY', OUT_FOR_DELIVERY: 'DELIVERED' }

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]); const [error, setError] = useState(''); const [busyId, setBusyId] = useState('')
  async function load() { const response = await fetch('/api/admin/orders', { cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setOrders(data.orders || []) }
  useEffect(() => { void load().catch(e => setError(e.message)) }, [])
  async function update(id: string, status: string) {
    let note = ''
    if (status === 'CANCELLED') { note = window.prompt('Why is this order being cancelled?')?.trim() || ''; if (note.length < 5) return }
    setBusyId(id); setError('')
    try { const response = await fetch(`/api/admin/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, note }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); await load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to update order.') }
    finally { setBusyId('') }
  }
  return <div><div><p className="text-xs font-bold uppercase tracking-widest text-accent">Fulfilment</p><h1 className="mt-2 font-display text-3xl text-brand">Orders</h1></div>{error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 space-y-3">{orders.length===0?<div className="rounded-xl border bg-white p-8 text-center text-slate-500">No orders yet.</div>:orders.map(order=>{const options=[nextStatus[order.status],...(['PENDING','CONFIRMED'].includes(order.status)?['CANCELLED']:[])].filter(Boolean);const history=order.statusHistory||[];return <article key={order.id} className="rounded-xl border bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{order.orderNumber}</p><p className="text-xs text-slate-500">{order.customer?.name||order.userId?.name} · {order.customer?.phone} · {order.userId?.email}</p><p className="mt-1 text-xs text-slate-400">{new Date(order.createdAt).toLocaleString('en-IN')}</p></div><div className="text-right"><p className="font-semibold">₹{order.total.toLocaleString('en-IN')}</p><p className="text-xs text-slate-500">COD · {order.status.replaceAll('_',' ')}</p></div></div><div className="mt-4 flex flex-wrap items-center gap-3"><span className="text-xs text-slate-500">{order.items.length} item(s)</span>{options.length>0&&<select disabled={busyId===order.id} value="" onChange={e=>{if(e.target.value)void update(order.id,e.target.value)}} className="rounded-lg border px-3 py-2 text-sm"><option value="">Update status…</option>{options.map(status=><option key={status} value={status}>{status.replaceAll('_',' ')}</option>)}</select>}</div>{history.length>0&&<details className="mt-4 border-t pt-3"><summary className="cursor-pointer text-xs font-semibold text-slate-600">Status history ({history.length})</summary><div className="mt-3 space-y-2">{history.map((item,index)=><p key={`${item.status}-${item.at}-${index}`} className="text-xs text-slate-500"><b className="text-brand">{item.status.replaceAll('_',' ')}</b> · {new Date(item.at).toLocaleString('en-IN')}{item.note?` · ${item.note}`:''}</p>)}</div></details>}</article>})}</div></div>
}
