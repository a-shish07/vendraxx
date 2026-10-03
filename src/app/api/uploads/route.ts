import { createHash, randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { requireAdmin, requireUser } from '@/lib/auth'

const maxBytes = 5 * 1024 * 1024
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const cloudinaryBase = () => {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME
  const key = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud || !key || !secret) throw new Error('Image uploads are not configured.')
  return { cloud, key, secret }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser()
    const form = await req.formData()
    const file = form.get('file')
    const purpose = String(form.get('purpose') || '')
    if (!(file instanceof File) || !imageTypes.has(file.type) || file.size < 1 || file.size > maxBytes) return NextResponse.json({ error: 'Choose a JPG, PNG, WebP or AVIF image under 5 MB.' }, { status: 400 })
    if (purpose !== 'avatar' && purpose !== 'product') return NextResponse.json({ error: 'Invalid upload purpose.' }, { status: 400 })
    if (purpose === 'product') await requireAdmin()
    const { cloud, key, secret } = cloudinaryBase()
    const folder = purpose === 'avatar' ? `vendrax/avatars/${user.sub}` : 'vendrax/products'
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const publicId = randomUUID()
    const signatureInput = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${secret}`
    const signature = createHash('sha1').update(signatureInput).digest('hex')
    const payload = new FormData()
    payload.set('file', file, file.name)
    payload.set('api_key', key)
    payload.set('timestamp', timestamp)
    payload.set('folder', folder)
    payload.set('public_id', publicId)
    payload.set('signature', signature)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/upload`, { method: 'POST', body: payload })
    const data = await response.json()
    if (!response.ok || typeof data.secure_url !== 'string' || typeof data.public_id !== 'string') return NextResponse.json({ error: 'Cloudinary could not upload the image.' }, { status: 502 })
    return NextResponse.json({ secureUrl: data.secure_url, publicId: data.public_id }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const forbidden = message === 'FORBIDDEN'
    const unauthorized = message === 'UNAUTHORIZED'
    const unconfigured = message === 'Image uploads are not configured.'
    return NextResponse.json({ error: forbidden ? 'Forbidden' : unauthorized ? 'Unauthorized' : unconfigured ? message : 'Unable to upload image.' }, { status: forbidden ? 403 : unauthorized ? 401 : unconfigured ? 503 : 502 })
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireUser()
    const { publicId } = await req.json()
    if (typeof publicId !== 'string' || publicId.length > 250 || publicId.includes('..')) return NextResponse.json({ error: 'Invalid image reference.' }, { status: 400 })
    const ownsAvatar = publicId.startsWith(`vendrax/avatars/${user.sub}/`)
    if (!ownsAvatar) { await requireAdmin(); if (!publicId.startsWith('vendrax/products/')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
    const { cloud, key, secret } = cloudinaryBase()
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signature = createHash('sha1').update(`public_id=${publicId}&timestamp=${timestamp}${secret}`).digest('hex')
    const payload = new FormData(); payload.set('public_id', publicId); payload.set('api_key', key); payload.set('timestamp', timestamp); payload.set('signature', signature)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/destroy`, { method: 'POST', body: payload })
    const data = await response.json()
    if (!response.ok || !['ok', 'not found'].includes(data.result)) return NextResponse.json({ error: 'Cloudinary could not delete the image.' }, { status: 502 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const forbidden = message === 'FORBIDDEN'; const unauthorized = message === 'UNAUTHORIZED'
    return NextResponse.json({ error: forbidden ? 'Forbidden' : unauthorized ? 'Unauthorized' : 'Unable to delete image.' }, { status: forbidden ? 403 : unauthorized ? 401 : 502 })
  }
}
