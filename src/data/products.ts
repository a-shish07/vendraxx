export interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  images: string[]
  category: string
  subcategory?: string
  description: string
  stock?: number
  featured?: boolean
}

// Product data is now stored in MongoDB. This type is kept here so the existing
// Vendrax UI components remain strongly typed during the migration.
export const products: Product[] = []
export const featuredProducts: Product[] = []
