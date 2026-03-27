'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, Zap, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useI18n } from '@/i18n/I18nContext'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'
import { BRAND_RED_CTA_IDLE_HOVER_CLASS } from '@/components/home/promo-food-banner/promoFoodBanner.constants'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  variant?: 'default' | 'compact' | 'horizontal'
  addedToCart?: Set<string>
  isInWishlist?: boolean
  onToggleWishlist?: (productId: string) => void
}

const PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS = `${BRAND_RED_CTA_IDLE_HOVER_CLASS} shadow-[0_14px_26px_rgba(229,50,37,0.18)]`

function ProductBadge({
  tone,
  icon,
  label,
}: {
  tone: 'amber' | 'green' | 'blue'
  icon: 'star' | 'zap'
  label: string
}) {
  const toneClass =
    tone === 'amber'
      ? 'from-amber-400 to-orange-500'
      : tone === 'green'
        ? 'from-green-400 to-emerald-500'
        : 'from-blue-400 to-indigo-500'
  const Icon = icon === 'zap' ? Zap : Star

  return (
    <div className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${toneClass} px-3 py-1 text-xs font-semibold text-white shadow-md`}>
      <Icon className="h-3 w-3" />
      {label}
    </div>
  )
}

const ProductCard = memo(
  ({
    product,
    onAddToCart,
    variant = 'default',
    addedToCart,
    isInWishlist,
    onToggleWishlist,
  }: ProductCardProps) => {
    const { t, locale } = useI18n()
    const pc = t.productCard
    const isAdded = addedToCart?.has(product.id) || false
    const productWithCategory = product as Product & {
      category?: { name: string } | null
      ingredients?: string[] | null
    }
    const displayName = getProductDisplayName(product.name, locale)
    const description = product.shortDescription ?? product.description
    const categoryLabel = productWithCategory.category?.name
      ? getCategoryDisplayName(productWithCategory.category.name, locale)
      : pc.uncategorized

    const renderStatusBadge = () => {
      if (product.status === 'HIT') return <ProductBadge tone="amber" icon="star" label={pc.badgeHit} />
      if (product.status === 'NEW') return <ProductBadge tone="green" icon="zap" label={pc.badgeNew} />
      if (product.status === 'CLASSIC') return <ProductBadge tone="blue" icon="star" label={pc.badgeClassic} />
      return null
    }

    if (variant === 'horizontal') {
      return (
        <Link
          href={`/products/${product.id}`}
          className="group relative flex overflow-hidden rounded-[2rem] border border-[#eadfd9] bg-[linear-gradient(140deg,#ffffff_0%,#fffaf6_55%,#fff3ec_100%)] shadow-[0_16px_38px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(15,23,42,0.1)]"
        >
          <div className="relative w-36 shrink-0 self-stretch overflow-hidden border-r border-[#f1e5de] bg-[radial-gradient(circle_at_50%_45%,rgba(255,230,219,0.95)_0%,rgba(255,245,240,0.9)_52%,rgba(255,255,255,0.75)_100%)] sm:w-40">
            <div aria-hidden className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[#ffd8c8]/50 blur-2xl" />
            <div aria-hidden className="absolute -right-5 top-4 h-16 w-16 rounded-full bg-white/70 blur-xl" />

            {product.image && product.image !== 'no-image' ? (
              <Image
                src={product.image}
                alt={displayName}
                fill
                sizes="160px"
                className="object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-[1.07]"
                style={{ filter: 'drop-shadow(0 10px 18px rgba(15,23,42,0.18))' }}
                loading="lazy"
                quality={85}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🍽️</div>
            )}

            <div className="absolute left-3 top-3 flex flex-col gap-2">
              <div className="rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur">
                {categoryLabel}
              </div>
              {renderStatusBadge()}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
            <div>
              <h3 className="line-clamp-2 text-base font-black leading-tight tracking-tight text-slate-900 sm:text-lg">
                {displayName}
              </h3>
              {description && (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <div className="text-xl font-black tracking-tight text-slate-900">
                  {product.price} ֏
                </div>
              </div>

              {onAddToCart && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onAddToCart(product)
                  }}
                  title={pc.addToCartTitle}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-all ${
                    isAdded
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_14px_24px_rgba(34,197,94,0.22)]'
                      : PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS
                  }`}
                >
                  {isAdded ? (
                    <>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {pc.inCart}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      {pc.add}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {onToggleWishlist && (
            <button
              type="button"
              aria-label={isInWishlist ? pc.wishlistRemove : pc.wishlistAdd}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleWishlist(product.id)
              }}
              className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all duration-200 active:scale-90 ${
                isInWishlist
                  ? 'border-red-100 bg-red-50'
                  : 'border-white/70 bg-white/90 hover:bg-white'
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-200 ${
                  isInWishlist ? 'scale-110 fill-red-500 text-red-500' : 'text-slate-400 hover:text-slate-600'
                }`}
              />
            </button>
          )}
        </Link>
      )
    }

    const isCompact = variant === 'compact'

    return (
      <Link
        href={`/products/${product.id}`}
        className={`group relative block w-full overflow-hidden rounded-[2rem] border border-[#eadfd9] bg-[linear-gradient(160deg,#ffffff_0%,#fffaf6_52%,#fff3ec_100%)] shadow-[0_16px_38px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.1)] ${
          isCompact ? 'rounded-[1.6rem]' : ''
        }`}
      >
        <div
          className={`relative overflow-hidden border-b border-[#f1e5de] ${
            isCompact ? 'rounded-t-[1.6rem]' : 'rounded-t-[2rem]'
          }`}
          style={{ aspectRatio: isCompact ? '1 / 1' : '1500 / 1125' }}
        >
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,230,219,0.9)_0%,rgba(255,244,238,0.78)_48%,rgba(255,255,255,0.72)_100%)]" />
          <div aria-hidden className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[#ffd8c8]/45 blur-3xl" />
          <div aria-hidden className="absolute -right-8 top-0 h-24 w-24 rounded-full bg-white/80 blur-2xl" />

          {onToggleWishlist && (
            <button
              type="button"
              aria-label={isInWishlist ? pc.wishlistRemove : pc.wishlistAdd}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleWishlist(product.id)
              }}
              className={`absolute right-3 top-3 z-20 flex items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur transition-all active:scale-90 ${
                isCompact ? 'h-9 w-9' : 'h-10 w-10'
              } ${isInWishlist ? 'border-red-100 bg-red-50' : 'border-white/70 hover:bg-white'}`}
            >
              <Heart
                className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} ${
                  isInWishlist ? 'fill-red-500 text-red-500' : 'text-slate-400'
                }`}
              />
            </button>
          )}

          <div className={`absolute left-3 top-3 z-20 flex flex-col gap-2 ${isCompact ? '' : 'sm:left-4 sm:top-4'}`}>
            {!isCompact && (
              <div className="rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
                {categoryLabel}
              </div>
            )}
            {renderStatusBadge()}
          </div>

          {product.image && product.image !== 'no-image' ? (
            <div className="relative z-10 h-full w-full overflow-hidden">
              <div
                className={`absolute inset-0 ${
                  isCompact ? 'px-3 pb-3 pt-10 sm:px-4 sm:pb-4' : 'px-4 pb-4 pt-14 sm:px-5 sm:pb-5 sm:pt-16'
                }`}
                style={{
                  transform: isCompact ? undefined : 'perspective(1000px) rotateX(6deg) rotateY(-2deg)',
                  transformOrigin: 'center center',
                }}
              >
                <Image
                  src={product.image}
                  alt={displayName}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.04]"
                  style={{ filter: 'drop-shadow(0 14px 24px rgba(15,23,42,0.18))' }}
                  loading="lazy"
                  quality={85}
                />
              </div>
            </div>
          ) : (
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center ${
                isCompact ? 'text-6xl' : 'text-7xl'
              }`}
            >
              🍽️
            </div>
          )}

          <div
            className={`absolute bottom-3 right-3 z-20 rounded-full border border-white/70 bg-white/92 font-black text-[#E53225] shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur ${
              isCompact ? 'px-4 py-2 text-sm' : 'px-5 py-2.5 text-base'
            }`}
          >
            {product.price} ֏
          </div>
        </div>

        <div className={`${isCompact ? 'p-4' : 'p-5 sm:p-6'}`}>
          <div className="mb-3 flex items-center gap-2">
            {isCompact && (
              <span className="rounded-full bg-[#fff3ec] px-2.5 py-1 text-[11px] font-semibold text-[#E53225]">
                {categoryLabel}
              </span>
            )}
          </div>

          <h3
            className={`font-black tracking-tight text-slate-900 ${
              isCompact ? 'line-clamp-2 text-base leading-snug' : 'line-clamp-2 text-xl leading-tight'
            }`}
          >
            {displayName}
          </h3>

          {isCompact ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {description || categoryLabel}
            </p>
          ) : (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 sm:text-[15px]">
              {description}
            </p>
          )}

          {productWithCategory.ingredients?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {productWithCategory.ingredients.slice(0, isCompact ? 2 : 3).map((ingredient) => (
                <span
                  key={ingredient}
                  className="rounded-full border border-[#efe3dd] bg-[#fcfaf8] px-2.5 py-1 text-[11px] font-medium text-slate-500"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          ) : null}

          {onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product)
              }}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full font-semibold transition-all ${
                isCompact ? 'h-11 text-sm' : 'h-12 text-base'
              } ${
                isAdded
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_14px_24px_rgba(34,197,94,0.22)]'
                  : PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS
              }`}
              title={pc.addToCartTitle}
            >
              {isAdded ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {pc.inCart}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingCart className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'}`} />
                  {pc.add}
                </span>
              )}
            </button>
          )}
        </div>
      </Link>
    )
  }
)

ProductCard.displayName = 'ProductCard'

export default ProductCard
