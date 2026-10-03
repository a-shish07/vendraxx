'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Customer = { id: string; name: string; email: string; phone: string; createdAt: string }
export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]); const [error, setError] = useState('')
  useEffect(() => { fetch('/api/admin/customers').then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setCustomers(data.customers || []) }).catch(e => setError(e.message)) }, [])
  return <div><h1 className="font-display text-3xl text-brand">Customers</h1>{error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 overflow-hidden rounded-2xl border bg-white">{customers.length===0?<p className="p-8 text-center text-slate-500">No customers found.</p>:customers.map(customer=><Link href={`/admin/customers/${customer.id}`} key={customer.id} className="flex flex-wrap justify-between gap-3 border-b p-5 hover:bg-slate-50"><div><p className="font-semibold">{customer.name}</p><p className="text-sm text-slate-500">{customer.email}</p></div><div className="text-right"><p className="text-sm text-slate-600">{customer.phone||'No phone'}</p><p className="mt-1 text-xs text-slate-400">Joined {new Date(customer.createdAt).toLocaleDateString('en-IN')}</p></div></Link>)}</div></div>
}
