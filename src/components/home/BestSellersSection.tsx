'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductWithCategory } from '@/types'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { useI18n } from '@/i18n/I18nContext'

const BEST_SELLERS_LIMIT = 4

export interface BestSellersSectionProps {
  onAddToCart?: (product: Product) => void
  addedToCart?: Set<string>
  isInWishlist?: (productId: string) => boolean
  onToggleWishlist?: (productId: string) => void
}

/**
 * Լավագույն ուտեսներ — ամենավաճառվող կամ ընտրված ապրանքների կարճ ցուցակ (02-FUNCTIONAL 1.3).
 */
export function BestSellersSection({ onAddToCart, addedToCart, isInWishlist, onToggleWishlist }: BestSellersSectionProps) {
  const { t } = useI18n()
  const bs = t.home.bestSellers
  const ariaBest = t.home.ariaBestSellers
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
      <section className="py-16 lg:py-20 bg-white" aria-label={ariaBest}>
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
    <section className="py-16 lg:py-20 bg-gradient-to-b from-orange-50/60 to-white overflow-visible" aria-label={ariaBest}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {bs.title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            {bs.subtitle}
          </p>
        </div>

        <div className="overflow-x-auto pb-2 pt-20 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 min-w-max sm:min-w-0 overflow-visible">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[280px] sm:h-full sm:w-auto flex-shrink-0 sm:flex-shrink overflow-visible"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  variant="compact"
                  addedToCart={addedToCart}
                  isInWishlist={isInWishlist?.(product.id)}
                  onToggleWishlist={onToggleWishlist}
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
            <span>{bs.viewAll}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
