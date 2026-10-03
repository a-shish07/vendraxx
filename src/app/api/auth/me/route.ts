import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
export async function GET() {
  try { const session = await requireUser(); await connectDB(); const user: any = await User.findById(session.sub).select('_id name email role phone avatar avatarPublicId createdAt').lean(); return NextResponse.json({ user: user ? { id: String(user._id), name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar, avatarPublicId: user.avatarPublicId, createdAt: user.createdAt } : null }) }
  catch { return NextResponse.json({ user: null }) }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireUser(); const body = await req.json()
    const name = String(body.name || '').trim(); const phone = String(body.phone || '').replace(/\D/g, '')
    if (name.length < 2 || name.length > 100 || !/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: 'Enter a name and valid 10-digit Indian phone number.' }, { status: 400 })
    const avatar = typeof body.avatar === 'string' && body.avatar ? body.avatar : undefined
    const avatarPublicId = typeof body.avatarPublicId === 'string' && body.avatarPublicId ? body.avatarPublicId : undefined
    if ((avatar === undefined) !== (avatarPublicId === undefined)) return NextResponse.json({ error: 'Invalid profile image.' }, { status: 400 })
    if (avatar !== undefined) {
      let imageUrl: URL
      try { imageUrl = new URL(avatar) } catch { return NextResponse.json({ error: 'Invalid profile image.' }, { status: 400 }) }
      const cloud = process.env.CLOUDINARY_CLOUD_NAME
      if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== 'res.cloudinary.com' || !cloud || !imageUrl.pathname.startsWith(`/${cloud}/image/upload/`) || !avatarPublicId?.startsWith(`vendrax/avatars/${session.sub}/`)) return NextResponse.json({ error: 'Invalid profile image.' }, { status: 400 })
    }
    await connectDB(); const update = { name, phone, ...(avatar !== undefined ? { avatar, avatarPublicId } : body.removeAvatar === true ? { avatar: '', avatarPublicId: '' } : {}) }; const user = await User.findByIdAndUpdate(session.sub, { $set: update }, { new: true, runValidators: true }).select('_id name email role phone avatar avatarPublicId createdAt').lean() as any
    return NextResponse.json({ user: user ? { id: String(user._id), name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar, avatarPublicId: user.avatarPublicId, createdAt: user.createdAt } : null })
  } catch (e) { const unauthorized = e instanceof Error && e.message === 'UNAUTHORIZED'; return NextResponse.json({ error: unauthorized ? 'Unauthorized' : 'Unable to update profile.' }, { status: unauthorized ? 401 : 400 }) }
}
