'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useCart, type CartItem } from './hooks/useCart'
import type { Product } from './data/products'

export type Page = 'home' | 'products' | 'cart' | 'checkout' | 'about' | 'contact'
export const pagePaths: Record<Page, string> = {
  home: '/', products: '/products', cart: '/cart', checkout: '/checkout', about: '/about', contact: '/contact',
}

export interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
}

interface AppContextType {
  currentPage: Page
  navigate: (page: Page | string, ...args: unknown[]) => void
  cart: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string | number) => void
  updateQuantity: (id: string | number, qty: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  wishlist: Product[]
  toggleWishlist: (product: Product) => void
  user: User | null
  authLoading: boolean
  refreshUser: () => Promise<void>
}

export const AppContext = createContext<AppContextType>(null!)
export function useApp() { return useContext(AppContext) }

const pathToPage = (pathname: string | null): Page => {
  if (!pathname) return 'home'
  if (pathname.startsWith('/products')) return 'products'
  if (pathname.startsWith('/cart')) return 'cart'
  if (pathname.startsWith('/checkout')) return 'checkout'
  if (pathname.startsWith('/about')) return 'about'
  if (pathname.startsWith('/contact')) return 'contact'
  return 'home'
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, replaceCart, cartLoaded } = useCart()
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [serverCartReady, setServerCartReady] = useState(false)

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await res.json()
      setUser(data.user ?? null)
    } catch { setUser(null) }
    finally { setAuthLoading(false) }
  }, [])

  useEffect(() => { refreshUser() }, [refreshUser])
  useEffect(() => {
    if (!user || !cartLoaded) { setServerCartReady(false); return }
    let cancelled = false
    const loadServerCart = async () => {
      const response = await fetch('/api/cart', { cache: 'no-store' })
      if (!response.ok) throw new Error('Unable to load customer cart.')
      const data = await response.json()
      const saved = Array.isArray(data.items) ? data.items as CartItem[] : []
      const merged = new Map(saved.map(item => [String(item.id), item]))
      for (const item of cart) {
        const existing = merged.get(String(item.id))
        merged.set(String(item.id), existing ? { ...existing, quantity: Math.min(50, Math.max(existing.quantity, item.quantity)) } : item)
      }
      if (!cancelled) { replaceCart([...merged.values()]); setServerCartReady(true) }
    }
    void loadServerCart().catch(() => setServerCartReady(false))
    return () => { cancelled = true }
  }, [user, cartLoaded])
  useEffect(() => {
    if (!user || !serverCartReady) return
    void fetch('/api/cart', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart.map(({ id, quantity }) => ({ id, quantity })) }) })
  }, [user, serverCartReady, cart])
  useEffect(() => {
    if (!user) {
      try { const raw = localStorage.getItem('vendrax_wishlist'); if (raw) setWishlist(JSON.parse(raw) as Product[]) } catch { setWishlist([]) }
      return
    }
    let cancelled = false
    const syncWishlist = async () => {
      try {
        const local = wishlist
        await Promise.all(local.map(product => fetch('/api/wishlist', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id, action: 'add' }) })))
        const response = await fetch('/api/wishlist', { cache: 'no-store' })
        if (response.ok) { const data = await response.json(); if (!cancelled) setWishlist(data.products ?? []) }
      } catch { /* Keep the current local wishlist available during a network outage. */ }
    }
    void syncWishlist()
    return () => { cancelled = true }
  }, [user])
  useEffect(() => { try { localStorage.setItem('vendrax_wishlist', JSON.stringify(wishlist)) } catch { /* Storage can be disabled by the browser. */ } }, [wishlist])
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }) }, [pathname])

  const navigate = useCallback((page: Page | string, ...args: unknown[]) => {
    if (typeof page === 'string' && page.startsWith('/')) {
      router.push(args.length ? `${page}/${args[0]}` : page)
      return
    }
    router.push(pagePaths[page as Page] ?? String(page))
  }, [router])

  const toggleWishlist = useCallback((product: Product) => {
    const removing = wishlist.some(item => item.id === product.id)
    setWishlist(current => removing ? current.filter(item => item.id !== product.id) : [...current, product])
    if (user) void fetch('/api/wishlist', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id, action: removing ? 'remove' : 'add' }) })
  }, [user, wishlist])

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  return <AppContext.Provider value={{
    currentPage: pathToPage(pathname), navigate, cart, addToCart, removeFromCart, updateQuantity,
    clearCart, cartTotal, cartCount, wishlist, toggleWishlist, user, authLoading, refreshUser,
  }}>{children}</AppContext.Provider>
}
