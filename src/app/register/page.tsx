'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../App'

export default function RegisterPage() {
  const router = useRouter(); const { refreshUser } = useApp()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Registration failed.')
      await refreshUser(); const next = new URLSearchParams(window.location.search).get('next') || '/account'; router.push(next.startsWith('/') && !next.startsWith('//') ? next : '/account')
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to create account.'); setLoading(false) }
  }
  return <div className="min-h-[70vh] bg-slate-50 px-4 py-14"><form onSubmit={submit} className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-accent">Join Vendrax</p><h1 className="mt-2 font-display text-3xl text-brand">Create account</h1>{error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}<label className="mt-6 block text-sm font-medium">Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} minLength={2} maxLength={100} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3"/></label><label className="mt-4 block text-sm font-medium">Email<input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" maxLength={254} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3"/></label><label className="mt-4 block text-sm font-medium">Indian mobile number<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,'').slice(0,10)})} type="tel" inputMode="numeric" minLength={10} maxLength={10} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3"/></label><label className="mt-4 block text-sm font-medium">Password<input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" minLength={10} maxLength={128} autoComplete="new-password" required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3"/></label><label className="mt-4 block text-sm font-medium">Confirm password<input value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} type="password" minLength={10} maxLength={128} autoComplete="new-password" required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3"/></label><button disabled={loading} className="mt-6 h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white hover:bg-accent disabled:opacity-50">{loading?'Creating…':'Create account'}</button><p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link className="font-semibold text-accent" href="/login">Sign in</Link></p></form></div>
}
