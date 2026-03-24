'use client'

import ProductCard from '@/components/ProductCard'
import { useWishlist } from '@/hooks/useWishlist'
import type { Product } from '@/types'

interface SimilarProductsProps {
  products: Product[]
}

export function SimilarProducts({ products }: SimilarProductsProps) {
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()
  if (products.length === 0) return null
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-visible">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          variant="compact"
          isInWishlist={isInWishlist(p.id)}
          onToggleWishlist={toggleWishlist}
        />
      ))}
    </div>
  )
}
