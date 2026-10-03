'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type CustomerData = { customer: { name: string; email: string; phone: string; createdAt: string; isActive: boolean }; orders: { id: string; orderNumber: string; status: string; total: number; createdAt: string }[] }
export default function AdminCustomerDetails() {
  const id = useParams<{ id: string }>()?.id; const [data, setData] = useState<CustomerData | null | undefined>()
  useEffect(() => { if (id) fetch(`/api/admin/customers/${encodeURIComponent(id)}`).then(async response => { const value = await response.json(); if (!response.ok) throw new Error(value.error); setData(value) }).catch(() => setData(null)) }, [id])
  if (data === undefined) return <p className="p-10 text-center">Loading customer…</p>
  if (!data) return <p className="p-10 text-center">Customer not found.</p>
  return <div><Link href="/admin/customers" className="text-sm font-semibold text-accent">← Customers</Link><h1 className="mt-3 font-display text-3xl text-brand">{data.customer.name}</h1><section className="mt-5 rounded-xl border bg-white p-5"><p>{data.customer.email}</p><p className="mt-1 text-sm text-slate-500">{data.customer.phone||'No phone'} · {data.customer.isActive?'Active':'Inactive'}</p><p className="mt-1 text-xs text-slate-400">Joined {new Date(data.customer.createdAt).toLocaleDateString('en-IN')}</p></section><h2 className="mt-8 font-semibold text-brand">Orders</h2><div className="mt-3 space-y-2">{data.orders.length===0?<p className="rounded-xl border bg-white p-5 text-sm text-slate-500">No orders.</p>:data.orders.map(order=><div key={order.id} className="flex flex-wrap justify-between gap-3 rounded-xl border bg-white p-5"><div><p className="font-semibold">{order.orderNumber}</p><p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p></div><div className="text-right"><p className="font-semibold">₹{order.total.toLocaleString('en-IN')}</p><p className="text-xs text-accent">{order.status.replaceAll('_',' ')}</p></div></div>)}</div></div>
}
