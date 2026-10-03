'use client'

import { useCallback, useEffect, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  quantity: number
}

const STORAGE_KEY = 'vendrax_cart'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartLoaded, setCartLoaded] = useState(false)
  useEffect(() => { setCart(loadCart()); setCartLoaded(true) }, [])
  useEffect(() => { if (cartLoaded && typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)) }, [cart, cartLoaded])

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => setCart(prev => {
    const existing = prev.find(i => String(i.id) === String(product.id))
    return existing
      ? prev.map(i => String(i.id) === String(product.id) ? { ...i, quantity: i.quantity + 1 } : i)
      : [...prev, { ...product, quantity: 1 }]
  }), [])
  const removeFromCart = useCallback((id: string | number) => setCart(prev => prev.filter(i => String(i.id) !== String(id))), [])
  const updateQuantity = useCallback((id: string | number, qty: number) => { if (qty >= 1) setCart(prev => prev.map(i => String(i.id) === String(id) ? { ...i, quantity: qty } : i)) }, [])
  const clearCart = useCallback(() => setCart([]), [])
  const replaceCart = useCallback((items: CartItem[]) => setCart(items), [])
  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, replaceCart, cartLoaded }
}
