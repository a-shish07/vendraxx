import Link from 'next/link'
import { redirect } from 'next/navigation'
import { connectDB } from '../../lib/mongodb'
import { getSession } from '../../lib/auth'
import User from '../../models/User'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login?next=/admin')
  let user: any
  try {
    await connectDB()
    user = await User.findById(session.sub).select('role isActive').lean()
  } catch { redirect('/login?next=/admin') }
  if (!user || user.role !== 'ADMIN' || user.isActive === false) redirect('/')
  return <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8"><aside className="hidden w-56 shrink-0 rounded-2xl bg-brand p-4 text-white md:block"><p className="px-3 py-3 font-display text-xl">Vendrax Admin</p>{[['/admin','Dashboard'],['/admin/products','Products'],['/admin/orders','Orders'],['/admin/customers','Customers'],['/admin/categories','Categories'],['/admin/analytics','Analytics']].map(([href,label])=><Link key={href} href={href} className="block rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white">{label}</Link>)}</aside><main className="min-w-0 flex-1">{children}</main></div>
}
