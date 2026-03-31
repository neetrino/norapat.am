'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Heart } from 'lucide-react'
import { useWishlist, type WishlistProduct } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import type { Product, ProductWithCategory } from '@/types'
import { useI18n } from '@/i18n/I18nContext'

const CART_FEEDBACK_MS = 2000

type WishlistGridItem =
  | { kind: 'product'; product: ProductWithCategory }
  | { kind: 'unavailable'; wishlist: WishlistProduct }

export default function WishlistPage() {
  const { t } = useI18n()
  const { wishlist: wishlistCopy } = t
  const { data: session, status: sessionStatus } = useSession()
  const {
    products: wishlistRows,
    loading: wishlistLoading,
    toggle: toggleWishlist,
    isInWishlist,
    remove: removeFromWishlist
  } = useWishlist()
  const { addItem } = useCart()
  const [detailProducts, setDetailProducts] = useState<ProductWithCategory[]>([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (wishlistRows.length === 0) {
      setDetailProducts([])
      setDetailsLoading(false)
      return
    }
    const ids = wishlistRows.map((p) => p.id).join(',')
    let cancelled = false
    setDetailsLoading(true)
    setDetailProducts([])
    fetch(`/api/products?ids=${encodeURIComponent(ids)}`)
      .then((r) => r.json())
      .then((data: ProductWithCategory[]) => {
        if (cancelled) return
        const byId = new Map(data.map((p) => [p.id, p]))
        const ordered = wishlistRows
          .map((w) => byId.get(w.id))
          .filter((p): p is ProductWithCategory => p != null)
        setDetailProducts(ordered)
      })
      .catch(() => {
        if (!cancelled) setDetailProducts([])
      })
      .finally(() => {
        if (!cancelled) setDetailsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [wishlistRows])

  const gridItems: WishlistGridItem[] = useMemo(() => {
    const items: WishlistGridItem[] = []
    for (const row of wishlistRows) {
      const full = detailProducts.find((p) => p.id === row.id)
      if (full) {
        items.push({ kind: 'product', product: full })
      } else if (!detailsLoading) {
        items.push({ kind: 'unavailable', wishlist: row })
      }
    }
    return items
  }, [wishlistRows, detailProducts, detailsLoading])

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

  const showInitialLoading =
    sessionStatus === 'loading' || (!!session?.user && wishlistLoading)

  if (showInitialLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-header-spacer-mobile lg:h-header-spacer-desktop" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
          <div
            className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
        </div>
      </div>
    )
  }

  const isEmpty = !wishlistLoading && wishlistRows.length === 0

  return (
    <div className="min-h-screen bg-white">
      <div className="h-header-spacer-mobile lg:h-header-spacer-desktop" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-20 lg:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2 shrink-0" />
              <span className="font-medium">{wishlistCopy.backToMenu}</span>
            </Link>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            {wishlistCopy.pageTitle}
          </h1>
        </div>

        {isEmpty ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-14 w-14 text-gray-300" />
            </div>
            <p className="text-lg text-gray-600 mb-8">
              {wishlistCopy.emptyHint}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              {wishlistCopy.goToMenu}
            </Link>
          </div>
        ) : (
          <>
            {detailsLoading && detailProducts.length === 0 ? (
              <div className="flex justify-center py-16">
                <div
                  className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
                  aria-hidden
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 overflow-visible">
                {gridItems.map((item) =>
                  item.kind === 'product' ? (
                    <ProductCard
                      key={item.product.id}
                      product={item.product}
                      variant="compact"
                      onAddToCart={handleAddToCart}
                      addedToCart={addedToCart}
                      isInWishlist={isInWishlist(item.product.id)}
                      onToggleWishlist={(id) => { void toggleWishlist(id) }}
                    />
                  ) : (
                    <div
                      key={item.wishlist.id}
                      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col"
                    >
                      <div className="relative h-40 bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                      <p className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {item.wishlist.name}
                      </p>
                      <p className="text-sm text-amber-700 mb-4">
                        {wishlistCopy.productUnavailable}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.wishlist.id)}
                        className="mt-auto w-full py-2 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                      >
                        {wishlistCopy.removeFromWishlist}
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
