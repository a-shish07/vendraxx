'use client'

import { useEffect, useState } from 'react'
import type { Product } from '../data/products'

export function useProducts(params: { featured?: boolean; limit?: number } = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const qs = new URLSearchParams()
    if (params.featured) qs.set('featured', 'true')
    if (params.limit) qs.set('limit', String(params.limit))
    fetch(`/api/products?${qs.toString()}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Unable to load products')))
      .then(data => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [params.featured, params.limit])

  return { products, loading }
}
