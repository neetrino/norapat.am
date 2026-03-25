'use client'

import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { Product, ProductWithCategory } from '@/types'

/** Գլխավոր էջի հորիզոնական շարքում առավելագույն ապրանքների քանակ */
const HOME_SHOWCASE_SCROLL_MAX_ITEMS = 12

/** ~4 քարտ տեսանելի max-w-7xl կոնտեյներում, նվազագույն լայնություն՝ բարակ էկրաններ */
const CARD_WIDTH_CLASS =
  'min-w-[max(200px,min(280px,calc((min(100vw,80rem)-4rem)/4)))] max-w-[280px] flex-shrink-0'

const stripToneClasses = {
  orange:
    'border-orange-200/90 bg-gradient-to-b from-orange-50/90 to-white hover:from-orange-100/80 hover:border-orange-300',
  amber:
    'border-amber-200/90 bg-gradient-to-b from-amber-50/90 to-white hover:from-amber-100/80 hover:border-amber-300',
} as const

export interface HomeShowcaseCarouselProps {
  products: ProductWithCategory[]
  tone: keyof typeof stripToneClasses
  viewEntireLabel: string
  onAddToCart?: (product: Product) => void
  addedToCart?: Set<string>
  isInWishlist?: (productId: string) => boolean
  onToggleWishlist?: (productId: string) => void
}

/**
 * Գլխավոր էջ — մինչև 12 ապրանք հորիզոնական թերթումով, ~4 տեսանելի, վերջում «Դիտել ամբողջը»։
 */
export function HomeShowcaseCarousel({
  products,
  tone,
  viewEntireLabel,
  onAddToCart,
  addedToCart,
  isInWishlist,
  onToggleWishlist,
}: HomeShowcaseCarouselProps) {
  const list = products.slice(0, HOME_SHOWCASE_SCROLL_MAX_ITEMS)
  const stripClass = stripToneClasses[tone]

  return (
    <div className="-mx-4 overflow-x-auto overflow-y-visible px-4 pb-2 pt-10 scrollbar-thin scroll-smooth sm:mx-0 sm:px-0">
      <div className="flex w-max snap-x snap-mandatory gap-6 overflow-visible pr-2">
        {list.map((product) => (
          <div
            key={product.id}
            className={`snap-start snap-always overflow-visible ${CARD_WIDTH_CLASS}`}
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
        <Link
          href="/products"
          className={`flex w-24 min-w-[5.5rem] max-w-[7rem] flex-shrink-0 snap-end flex-col items-center justify-center gap-2 self-stretch rounded-2xl border-2 px-2 py-4 text-center shadow-sm transition-colors sm:w-28 ${stripClass}`}
        >
          <span className="text-xs font-bold leading-tight text-gray-900 sm:text-sm">{viewEntireLabel}</span>
          <svg
            className="h-5 w-5 shrink-0 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
