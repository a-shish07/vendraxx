'use client'

import { useEffect, useState } from 'react'

type Stats = { orders: number; revenue: number; products: number; customers: number }
export default function AdminAnalytics() {
  const [stats, setStats] = useState<Stats | null>(null); const [error, setError] = useState('')
  useEffect(() => { fetch('/api/admin/stats').then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setStats(data.stats) }).catch(e => setError(e.message)) }, [])
  const values = [['Total orders', stats?.orders], ['Active products', stats?.products], ['Customers', stats?.customers], ['COD total for delivered orders', stats ? `₹${stats.revenue.toLocaleString('en-IN')}` : undefined]] as const
  return <div><h1 className="font-display text-3xl text-brand">Analytics</h1>{error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<p className="mt-2 text-sm text-slate-500">Totals from the live catalogue and order records.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{values.map(([label,value])=><div key={label} className="rounded-2xl border bg-white p-6"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold text-brand">{value??'—'}</p></div>)}</div></div>
}
