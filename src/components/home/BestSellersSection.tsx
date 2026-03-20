'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductWithCategory } from '@/types'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

const BEST_SELLERS_LIMIT = 6

export interface BestSellersSectionProps {
  /** Callback when adding product to cart */
  onAddToCart?: (product: Product) => void
  /** Set of product IDs recently added to cart (for highlight) */
  addedToCart?: Set<string>
}

/**
 * Լավագույն ուտեսներ — ամենավաճառվող կամ ընտրված ապրանքների կարճ ցուցակ (02-FUNCTIONAL 1.3).
 * Data from /api/products/featured.
 */
export function BestSellersSection({ onAddToCart, addedToCart }: BestSellersSectionProps) {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/products/featured', { signal: controller.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch featured products')
        return res.json()
      })
      .then((data: ProductWithCategory[]) => {
        const list = Array.isArray(data) ? data.slice(0, BEST_SELLERS_LIMIT) : []
        setProducts(list)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-white" aria-label="Լավագույն ուտեսներ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-orange-50/60 to-white" aria-label="Լավագույն ուտեսներ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Լավագույն ուտեսներ
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Ամենավաճառվող և ընտրված ապրանքների կարճ ցուցակ
          </p>
        </div>

        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-w-max sm:min-w-0">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="w-[280px] sm:w-auto flex-shrink-0 sm:flex-shrink transform hover:scale-[1.02] transition-transform duration-300"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  variant="compact"
                  addedToCart={addedToCart}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            <span>Դիտել բոլորը</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
