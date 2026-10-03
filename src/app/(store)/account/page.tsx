'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../App'

export default function AccountPage() {
  const { user, authLoading, refreshUser } = useApp()
  const router = useRouter()
  const [profile, setProfile] = useState({ name: '', phone: '', avatar: '', avatarPublicId: '', createdAt: '' })
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (!authLoading && !user) router.replace('/login?next=/account') }, [authLoading, user, router])
  useEffect(() => { if (user) fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json()).then(d => { if (d.user) setProfile({ name: d.user.name || '', phone: d.user.phone || '', avatar: d.user.avatar || '', avatarPublicId: d.user.avatarPublicId || '', createdAt: d.user.createdAt || '' }) }) }, [user])
  if (authLoading || !user) return <div className="p-16 text-center">Loading…</div>
  async function saveProfile(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(''); setError('')
    try { const response = await fetch('/api/auth/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setMessage('Profile updated.'); await refreshUser() }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to update profile.') } finally { setBusy(false) }
  }
  async function changePassword(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(''); setError('')
    try { const response = await fetch('/api/auth/password', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(password) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setPassword({ currentPassword: '', newPassword: '' }); setMessage('Password changed.') }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to change password.') } finally { setBusy(false) }
  }
  async function uploadAvatar(file?: File) {
    if (!file) return
    setBusy(true); setError(''); setMessage('')
    try {
      const form = new FormData(); form.set('file', file); form.set('purpose', 'avatar')
      const upload = await fetch('/api/uploads', { method: 'POST', body: form }); const uploaded = await upload.json(); if (!upload.ok) throw new Error(uploaded.error)
      const update = await fetch('/api/auth/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...profile, avatar: uploaded.secureUrl, avatarPublicId: uploaded.publicId }) }); const result = await update.json(); if (!update.ok) throw new Error(result.error)
      if (profile.avatarPublicId) void fetch('/api/uploads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId: profile.avatarPublicId }) })
      setProfile(p => ({ ...p, avatar: uploaded.secureUrl, avatarPublicId: uploaded.publicId })); setMessage('Profile image updated.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to upload image.') } finally { setBusy(false) }
  }
  async function removeAvatar() {
    const oldPublicId = profile.avatarPublicId; setBusy(true); setError(''); setMessage('')
    try {
      const response = await fetch('/api/auth/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: profile.name, phone: profile.phone, removeAvatar: true }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error)
      setProfile(current => ({ ...current, avatar: '', avatarPublicId: '' }))
      if (oldPublicId) { const deleted = await fetch('/api/uploads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId: oldPublicId }) }); if (!deleted.ok) setError('Profile photo was removed, but its Cloudinary file could not be deleted.') }
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to remove profile photo.') } finally { setBusy(false) }
  }
  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); await refreshUser(); router.push('/') }
  return <div className="mx-auto max-w-5xl px-4 py-12"><div className="rounded-2xl bg-brand p-7 text-white"><p className="text-xs uppercase tracking-widest text-accent">My account</p><h1 className="mt-2 text-3xl font-semibold">Hello, {user.name}</h1><p className="mt-1 text-white/60">{user.email}</p>{profile.createdAt&&<p className="mt-2 text-xs text-white/50">Member since {new Date(profile.createdAt).toLocaleDateString('en-IN')}</p>}</div>
    {(message||error)&&<p className={`mt-4 rounded-lg p-3 text-sm ${error?'bg-red-50 text-red-700':'bg-emerald-50 text-emerald-700'}`}>{error||message}</p>}
    <div className="mt-6 grid gap-6 md:grid-cols-2"><form onSubmit={saveProfile} className="rounded-xl border bg-white p-6"><h2 className="font-semibold text-brand">Profile</h2><div className="mt-4 flex items-center gap-4"><img src={profile.avatar||'/placeholder-product.svg'} alt="Profile" className="h-16 w-16 rounded-full bg-slate-100 object-cover"/><label className="cursor-pointer rounded-lg border px-3 py-2 text-sm">Upload photo<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={e=>void uploadAvatar(e.target.files?.[0])}/></label>{profile.avatar&&<button type="button" disabled={busy} onClick={()=>void removeAvatar()} className="text-sm text-red-600 disabled:opacity-50">Remove</button>}</div><label className="mt-4 block text-sm">Name<input required minLength={2} maxLength={100} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} className="mt-1 h-10 w-full rounded-lg border px-3"/></label><label className="mt-3 block text-sm">Phone<input required inputMode="numeric" maxLength={10} value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value.replace(/\D/g,'').slice(0,10)})} className="mt-1 h-10 w-full rounded-lg border px-3"/></label><p className="mt-3 text-xs text-slate-500">Email: {user.email} (email changes are not enabled)</p><button disabled={busy} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save profile</button></form>
    <form onSubmit={changePassword} className="rounded-xl border bg-white p-6"><h2 className="font-semibold text-brand">Change password</h2><label className="mt-4 block text-sm">Current password<input required type="password" autoComplete="current-password" value={password.currentPassword} onChange={e=>setPassword({...password,currentPassword:e.target.value})} className="mt-1 h-10 w-full rounded-lg border px-3"/></label><label className="mt-3 block text-sm">New password<input required minLength={10} maxLength={128} type="password" autoComplete="new-password" value={password.newPassword} onChange={e=>setPassword({...password,newPassword:e.target.value})} className="mt-1 h-10 w-full rounded-lg border px-3"/></label><button disabled={busy} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Update password</button></form>
    <Link href="/account/addresses" className="rounded-xl border bg-white p-6 hover:border-accent"><h2 className="font-semibold text-brand">Address book</h2><p className="mt-2 text-sm text-slate-500">Add and manage delivery addresses.</p></Link><Link href="/account/orders" className="rounded-xl border bg-white p-6 hover:border-accent"><h2 className="font-semibold text-brand">Order history</h2><p className="mt-2 text-sm text-slate-500">View orders and track delivery status.</p></Link><Link href="/wishlist" className="rounded-xl border bg-white p-6 hover:border-accent"><h2 className="font-semibold text-brand">Wishlist</h2><p className="mt-2 text-sm text-slate-500">Review saved products and add available items to your cart.</p></Link></div><button onClick={logout} className="mt-6 rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600">Sign out</button>
  </div>
}
