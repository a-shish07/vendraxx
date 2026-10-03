'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../App'

export default function LoginPage() {
  const router = useRouter(); const { refreshUser } = useApp()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.')
      await refreshUser(); const next = new URLSearchParams(window.location.search).get('next') || '/account'; router.push(next.startsWith('/') && !next.startsWith('//') ? next : '/account')
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to sign in.'); setLoading(false) }
  }
  return <div className="min-h-[70vh] bg-slate-50 px-4 py-14"><form onSubmit={submit} className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-accent">Welcome back</p><h1 className="mt-2 font-display text-3xl text-brand">Sign in</h1>{error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}<label className="mt-6 block text-sm font-medium">Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="email" maxLength={254} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3"/></label><label className="mt-4 block text-sm font-medium">Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3"/></label><button disabled={loading} className="mt-6 h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white hover:bg-accent disabled:opacity-50">{loading?'Signing in…':'Sign in'}</button><p className="mt-5 text-center text-sm text-slate-500">Don't have an account? <Link className="font-semibold text-accent" href="/register">Create one</Link></p></form></div>
}
