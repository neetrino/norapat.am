'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, Zap, Heart, X } from 'lucide-react'
import { Product } from '@/types'
import { useI18n } from '@/i18n/I18nContext'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'
import { BRAND_RED_CTA_IDLE_HOVER_CLASS } from '@/components/home/promo-food-banner/promoFoodBanner.constants'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  variant?: 'default' | 'compact' | 'horizontal'
  addedToCart?: Set<string>
  isInWishlist?: boolean
  onToggleWishlist?: (productId: string) => void
  /** On wishlist page use `remove` so the control reads as dismiss (X), not favorite (heart). */
  wishlistButtonVariant?: 'heart' | 'remove'
}

const PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS = `${BRAND_RED_CTA_IDLE_HOVER_CLASS} shadow-[0_14px_26px_rgba(229,50,37,0.18)]`

function getDiscountPercent(originalPrice: number | null | undefined, currentPrice: number) {
  if (originalPrice == null || originalPrice <= currentPrice || originalPrice <= 0) {
    return null
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

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
      ? 'text-[#b86114]'
      : tone === 'green'
        ? 'text-[#6c8a2b]'
        : 'text-[#6f633d]'
  const Icon = icon === 'zap' ? Zap : Star

  return (
    <div
      className={`inline-flex max-w-[9.5rem] items-center gap-1.5 ${toneClass} px-3 py-1.5 text-[10px] font-semibold leading-none tracking-[0.12em] drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]`}
    >
      <Icon className="h-3 w-3 shrink-0 stroke-[2.2]" />
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
    wishlistButtonVariant = 'heart',
  }: ProductCardProps) => {
    const { t, locale } = useI18n()
    const pc = t.productCard
    const isAdded = addedToCart?.has(product.id) || false
    const productWithCategory = product as Product & {
      ingredients?: string[] | null
    }
    const displayName = getProductDisplayName(product.name, locale)
    const description = product.shortDescription ?? product.description
    const discountPercent = getDiscountPercent(product.originalPrice, product.price)
    const hasDiscount = discountPercent != null

    const statusBadge =
      product.status === 'HIT'
        ? { tone: 'amber' as const, icon: 'star' as const, label: pc.badgeHit }
        : product.status === 'NEW'
          ? { tone: 'green' as const, icon: 'zap' as const, label: pc.badgeNew }
          : product.status === 'CLASSIC'
            ? { tone: 'blue' as const, icon: 'star' as const, label: pc.badgeClassic }
            : null

    const showHeartBtn = Boolean(onToggleWishlist)
    const wishlistAriaLabel =
      wishlistButtonVariant === 'remove'
        ? pc.wishlistRemove
        : isInWishlist
          ? pc.wishlistRemove
          : pc.wishlistAdd
    const wishlistBtnSurfaceClass =
      wishlistButtonVariant === 'remove'
        ? 'border-slate-200/90 bg-white/95 hover:bg-red-50 hover:border-red-200'
        : isInWishlist
          ? 'border-red-200 bg-red-50'
          : 'border-white/70 bg-white/90 hover:bg-white'

    if (variant === 'horizontal') {
      return (
        <Link
          href={`/products/${product.id}`}
          className="group relative flex overflow-hidden rounded-[2rem] border border-[#eadfd9] bg-[linear-gradient(140deg,#ffffff_0%,#fffaf6_55%,#fff3ec_100%)] shadow-[0_16px_38px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(15,23,42,0.1)]"
        >
          <div className="relative w-36 shrink-0 self-stretch overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(255,230,219,0.95)_0%,rgba(255,245,240,0.9)_52%,rgba(255,255,255,0.75)_100%)] sm:w-40">
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

            <div className="absolute left-2 top-1 z-10 flex flex-col gap-1.5 sm:left-2.5 sm:top-1.5">
              {hasDiscount && (
                <div className="inline-flex w-fit items-center rounded-full bg-[#E53225] px-3 py-1.5 text-[10px] font-black leading-none tracking-[0.12em] text-white shadow-[0_12px_22px_rgba(229,50,37,0.28)]">
                  -{discountPercent}%
                </div>
              )}
              {statusBadge && (
                <ProductBadge
                  tone={statusBadge.tone}
                  icon={statusBadge.icon}
                  label={statusBadge.label}
                />
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
            <div>
              <h3 className="line-clamp-2 text-base font-black leading-tight tracking-tight text-slate-900 sm:text-lg">
                {displayName}
              </h3>
              {description && (
                <p className="mt-2 line-clamp-1 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                {hasDiscount && product.originalPrice != null && (
                  <div className="mb-1 text-sm font-medium text-slate-400 line-through">
                    {product.originalPrice} ֏
                  </div>
                )}
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

          {showHeartBtn && (
            <button
              type="button"
              aria-label={wishlistAriaLabel}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleWishlist?.(product.id)
              }}
              className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all duration-200 active:scale-90 ${wishlistBtnSurfaceClass}`}
            >
              {wishlistButtonVariant === 'remove' ? (
                <X
                  className="h-4 w-4 text-slate-600 transition-colors duration-200 hover:text-red-600"
                  strokeWidth={2.25}
                />
              ) : (
                <Heart
                  className={`h-4 w-4 transition-colors duration-200 ${
                    isInWishlist
                      ? 'fill-red-500 text-red-500'
                      : 'text-slate-400 hover:text-red-400'
                  }`}
                />
              )}
            </button>
          )}
        </Link>
      )
    }

    const isCompact = variant === 'compact'

    return (
      <Link
        href={`/products/${product.id}`}
        className={`group relative w-full overflow-hidden rounded-[2rem] border border-[#eadfd9] bg-[linear-gradient(160deg,#ffffff_0%,#fffaf6_52%,#fff3ec_100%)] shadow-[0_16px_38px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.1)] ${
          isCompact ? 'flex flex-col rounded-[1.6rem]' : 'block'
        }`}
      >
        <div
          className={`relative overflow-hidden ${
            isCompact ? 'rounded-t-[1.6rem]' : 'rounded-t-[2rem]'
          }`}
          style={{ aspectRatio: isCompact ? '1 / 1' : '1500 / 1125' }}
        >
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,230,219,0.9)_0%,rgba(255,244,238,0.78)_48%,rgba(255,255,255,0.72)_100%)]" />
          <div aria-hidden className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[#ffd8c8]/45 blur-3xl" />
          <div aria-hidden className="absolute -right-8 top-0 h-24 w-24 rounded-full bg-white/80 blur-2xl" />

          {showHeartBtn && (
            <button
              type="button"
              aria-label={wishlistAriaLabel}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleWishlist?.(product.id)
              }}
              className={`absolute right-3 top-3 z-20 flex items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all active:scale-90 ${
                isCompact ? 'h-9 w-9' : 'h-10 w-10'
              } ${wishlistBtnSurfaceClass}`}
            >
              {wishlistButtonVariant === 'remove' ? (
                <X
                  className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} text-slate-600 transition-colors duration-200 hover:text-red-600`}
                  strokeWidth={2.25}
                />
              ) : (
                <Heart
                  className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} transition-colors duration-200 ${
                    isInWishlist
                      ? 'fill-red-500 text-red-500'
                      : 'text-slate-400 hover:text-red-400'
                  }`}
                />
              )}
            </button>
          )}

          <div className="absolute left-2 top-1 z-20 flex flex-col gap-1.5 sm:left-2.5 sm:top-1.5">
            {hasDiscount && (
              <div className="inline-flex w-fit items-center rounded-full bg-[#E53225] px-3 py-1.5 text-[10px] font-black leading-none tracking-[0.12em] text-white shadow-[0_12px_22px_rgba(229,50,37,0.28)]">
                -{discountPercent}%
              </div>
            )}
            {statusBadge && (
              <ProductBadge
                tone={statusBadge.tone}
                icon={statusBadge.icon}
                label={statusBadge.label}
              />
            )}
          </div>

          {product.image && product.image !== 'no-image' ? (
            <div className="relative z-10 h-full w-full overflow-hidden">
              <div
                className={`absolute inset-0 ${
                  isCompact ? 'px-3 pb-3 pt-8 sm:px-4 sm:pb-4 sm:pt-9' : 'px-4 pb-4 pt-10 sm:px-5 sm:pb-5 sm:pt-11'
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

        <div className={`${isCompact ? 'flex flex-1 flex-col p-4 pb-2' : 'p-5 pb-3 sm:p-6 sm:pb-4'}`}>
          <h3
            className={`font-black tracking-tight text-slate-900 ${
              isCompact ? 'line-clamp-2 text-base leading-snug' : 'line-clamp-2 text-xl leading-tight'
            }`}
          >
            {displayName}
          </h3>

          {isCompact ? (
            <p className="mt-2 truncate text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : (
            <p className="mt-3 line-clamp-1 text-sm leading-6 text-slate-500 sm:text-[15px]">
              {description}
            </p>
          )}

          {hasDiscount && product.originalPrice != null && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400 line-through">
                {product.originalPrice} ֏
              </span>
              <span className="rounded-full bg-[#fff1ec] px-2.5 py-1 text-[11px] font-bold text-[#E53225]">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>

        {onAddToCart && (
          <div className={`${isCompact ? 'px-4 pb-4' : 'px-5 pb-5 sm:px-6 sm:pb-6'}`}>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product)
              }}
              className={`flex w-full items-center justify-center gap-2 rounded-full font-semibold transition-all ${
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
          </div>
        )}
      </Link>
    )
  }
)

ProductCard.displayName = 'ProductCard'

export default ProductCard
