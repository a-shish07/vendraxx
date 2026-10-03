'use client'

import { useEffect, useState, type FormEvent } from 'react'

type ImageItem = { url: string; publicId: string }
type Product = { id: string; name: string; price: number; category: string; description: string; image: string; images?: string[]; imagePublicIds?: string[]; stock: number; sku?: string; featured: boolean; active: boolean }
type Editor = { name: string; price: string; category: string; subcategory: string; description: string; stock: string; sku: string; featured: boolean; active: boolean }
const blank: Editor = { name: '', price: '', category: '', subcategory: '', description: '', stock: '0', sku: '', featured: false, active: true }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]); const [form, setForm] = useState<Editor>(blank); const [images, setImages] = useState<ImageItem[]>([]); const [editing, setEditing] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState('')
  async function load() { const response = await fetch('/api/admin/products'); const data = await response.json(); if (!response.ok) throw new Error(data.error); setProducts(data.products || []) }
  useEffect(() => { void load().catch(e => setError(e.message)) }, [])
  function beginEdit(product: Product) {
    setEditing(product.id); setError(''); setNotice('')
    const urls = [...new Set([product.image, ...(product.images || [])].filter(Boolean))]
    setImages(urls.map((url, index) => ({ url, publicId: product.imagePublicIds?.[index] || '' })))
    setForm({ name: product.name, price: String(product.price), category: product.category, subcategory: '', description: product.description || '', stock: String(product.stock), sku: product.sku || '', featured: Boolean(product.featured), active: product.active !== false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function reset() { setEditing(''); setForm(blank); setImages([]); setError(''); setNotice('') }
  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return
    setBusy(true); setError(''); setNotice('')
    try {
      const uploaded: ImageItem[] = []
      for (const file of Array.from(files)) {
        const payload = new FormData(); payload.set('file', file); payload.set('purpose', 'product')
        const response = await fetch('/api/uploads', { method: 'POST', body: payload }); const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Image upload failed.')
        uploaded.push({ url: data.secureUrl, publicId: data.publicId })
      }
      setImages(current => [...current, ...uploaded].slice(0, 8)); setNotice('Images uploaded. The first image is the primary product image.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to upload images.') }
    finally { setBusy(false) }
  }
  async function removeImage(index: number) {
    const removed = images[index]
    setImages(current => current.filter((_, i) => i !== index))
    const existingIds = products.find(product => product.id === editing)?.imagePublicIds || []
    if (removed?.publicId && !existingIds.includes(removed.publicId)) void fetch('/api/uploads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId: removed.publicId }) })
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    const old = editing ? products.find(product => product.id === editing)?.imagePublicIds || [] : []
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), image: images[0]?.url || '', images: images.map(image => image.url), imagePublicIds: images.map(image => image.publicId).filter(Boolean) }
      const response = await fetch(editing ? `/api/admin/products/${editing}` : '/api/admin/products', { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save product.')
      const retained = new Set(payload.imagePublicIds)
      for (const publicId of old) if (!retained.has(publicId)) void fetch('/api/uploads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId }) })
      reset(); setNotice('Product saved.'); await load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save product.') }
    finally { setBusy(false) }
  }
  async function deactivate(id: string) { if (!window.confirm('Deactivate this product?')) return; const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' }); const data = await response.json(); if (!response.ok) setError(data.error); else await load() }
  async function moveImage(index: number, delta: number) { const next = [...images]; const destination = index + delta; if (destination < 0 || destination >= next.length) return; [next[index], next[destination]] = [next[destination], next[index]]; setImages(next) }
  return <div><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-accent">Catalogue</p><h1 className="mt-2 font-display text-3xl text-brand">Products</h1></div><span className="text-sm text-slate-500">{products.length} products</span></div>
    {(error||notice)&&<p role={error?'alert':'status'} className={`mt-4 rounded-lg p-3 text-sm ${error?'bg-red-50 text-red-700':'bg-emerald-50 text-emerald-700'}`}>{error||notice}</p>}
    <form onSubmit={save} className="mt-6 rounded-2xl border bg-white p-5"><h2 className="font-semibold">{editing?'Edit product':'Add product'}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><input required minLength={2} maxLength={160} placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="rounded-lg border p-2.5"/><input required min="0" step="0.01" type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="rounded-lg border p-2.5"/><input required placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="rounded-lg border p-2.5"/><input placeholder="Subcategory" value={form.subcategory} onChange={e=>setForm({...form,subcategory:e.target.value})} className="rounded-lg border p-2.5"/><input placeholder="SKU (optional)" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="rounded-lg border p-2.5"/><input required min="0" step="1" type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="rounded-lg border p-2.5"/><textarea maxLength={10000} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="rounded-lg border p-2.5 sm:col-span-2"/></div>
    <div className="mt-4"><label className="block text-sm font-medium">Product images (JPG, PNG, WebP or AVIF; max 5 MB each)<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy||images.length>=8} onChange={e=>{void uploadFiles(e.target.files);e.currentTarget.value=''}} className="mt-2 block w-full text-sm"/></label><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{images.map((image,index)=><div key={`${image.url}-${index}`} className="rounded-lg border p-2"><img src={image.url} alt={`Product image ${index+1}`} className="h-28 w-full object-contain"/><p className="mt-1 text-xs text-slate-500">{index===0?'Primary image':`Image ${index+1}`}</p><div className="mt-2 flex justify-between text-xs"><button type="button" onClick={()=>void moveImage(index,-1)} disabled={!index} className="text-accent disabled:opacity-40">Move left</button><button type="button" onClick={()=>void moveImage(index,1)} disabled={index===images.length-1} className="text-accent disabled:opacity-40">Move right</button><button type="button" onClick={()=>void removeImage(index)} className="text-red-600">Remove</button></div></div>)}</div></div>
    <div className="mt-4 flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/>Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/>Active</label></div><div className="mt-4 flex gap-3"><button disabled={busy} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy?'Saving…':editing?'Save changes':'Add product'}</button>{editing&&<button type="button" onClick={reset} className="rounded-lg border px-5 py-2.5 text-sm">Cancel edit</button>}</div></form>
    <div className="mt-6 overflow-hidden rounded-2xl border bg-white">{products.map(product=><div key={product.id} className="flex flex-wrap items-center justify-between gap-4 border-b p-4"><div className="flex min-w-0 items-center gap-3"><img src={product.image||'/placeholder-product.svg'} alt="" className="h-14 w-14 rounded-lg bg-slate-50 object-contain"/><div className="min-w-0"><p className="truncate font-medium">{product.name}</p><p className="text-xs text-slate-500">{product.category} · Stock {product.stock} · {product.active===false?'Inactive':'Active'}</p></div></div><div className="flex items-center gap-4 text-sm"><span className="font-semibold">₹{product.price.toLocaleString('en-IN')}</span><button onClick={()=>beginEdit(product)} className="font-medium text-accent">Edit</button><button onClick={()=>void deactivate(product.id)} className="text-red-600">Deactivate</button></div></div>)}</div>
  </div>
}
