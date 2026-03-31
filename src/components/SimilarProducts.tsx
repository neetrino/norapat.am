'use client'

import { useCallback, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useStarred } from '@/hooks/useStarred'
import type { Product } from '@/types'

interface SimilarProductsProps {
  products: Product[]
}

const CART_FEEDBACK_MS = 2000

export function SimilarProducts({ products }: SimilarProductsProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()
  const { isStarred, toggle: toggleStar } = useStarred()
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product, 1)
      setAddedToCart((prev) => new Set(prev).add(product.id))

      window.setTimeout(() => {
        setAddedToCart((prev) => {
          const next = new Set(prev)
          next.delete(product.id)
          return next
        })
      }, CART_FEEDBACK_MS)
    },
    [addItem]
  )

  if (products.length === 0) return null
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-visible">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          variant="default"
          onAddToCart={handleAddToCart}
          addedToCart={addedToCart}
          isStarred={isStarred(p.id)}
          onToggleStar={(id) => { void toggleStar(id) }}
          isInWishlist={isInWishlist(p.id)}
          onToggleWishlist={(id) => { void toggleWishlist(id) }}
        />
      ))}
    </div>
  )
}
