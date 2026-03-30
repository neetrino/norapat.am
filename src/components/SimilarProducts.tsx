'use client'

import ProductCard from '@/components/ProductCard'
import { useWishlist } from '@/hooks/useWishlist'
import type { Product } from '@/types'

interface SimilarProductsProps {
  products: Product[]
}

export function SimilarProducts({ products }: SimilarProductsProps) {
  const { isInWishlist, toggle: toggleWishlist, isAuthenticated } = useWishlist()
  if (products.length === 0) return null
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-visible">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          variant="compact"
          isInWishlist={isAuthenticated ? isInWishlist(p.id) : undefined}
          onToggleWishlist={isAuthenticated ? toggleWishlist : undefined}
        />
      ))}
    </div>
  )
}
