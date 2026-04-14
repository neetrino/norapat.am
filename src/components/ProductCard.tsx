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
  wishlistButtonVariant?: 'heart' | 'remove'
  compactLayout?: 'standard' | 'showcaseNarrow'
}

const PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS = `${BRAND_RED_CTA_IDLE_HOVER_CLASS} shadow-[0_14px_26px_rgba(229,50,37,0.18)]`
const CURRENCY = '֏'

function formatPrice(value: number) {
  return new Intl.NumberFormat('hy-AM').format(value)
}

function getDiscountPercent(originalPrice: number | null | undefined, currentPrice: number) {
  if (originalPrice == null || originalPrice <= currentPrice || originalPrice <= 0) {
    return null
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

function getStatusToneTextClass(tone: 'amber' | 'green' | 'blue') {
  return tone === 'amber'
    ? 'text-[#b86114]'
    : tone === 'green'
      ? 'text-[#6c8a2b]'
      : 'text-[#6f633d]'
}

function getStatusToneSurfaceClass(tone: 'amber' | 'green' | 'blue') {
  return tone === 'amber'
    ? 'border-amber-300 bg-amber-50 shadow-sm'
    : tone === 'green'
      ? 'border-emerald-300 bg-emerald-50 shadow-sm'
      : 'border-slate-300 bg-slate-50 shadow-sm'
}

/** Category relation is optional on some Product payloads; read name when present. */
function getProductCategoryName(product: Product): string | null {
  if (!('category' in product) || product.category == null) return null
  const cat = product.category
  if (typeof cat !== 'object') return null
  if (!('name' in cat)) return null
  const name = (cat as { name: unknown }).name
  return typeof name === 'string' ? name : null
}

function ProductCardImageFrame({
  image,
  alt,
  sizes,
  imagePaddingClass,
  imageClassName = 'object-contain',
}: {
  image: string | null | undefined
  alt: string
  sizes: string
  imagePaddingClass: string
  imageClassName?: string
}) {
  const hasImage = Boolean(image && image !== 'no-image')

  return (
    <div className="relative z-10 h-full w-full overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55)_0%,rgba(255,244,238,0.18)_42%,rgba(248,240,233,0)_72%)]"
      />
      <div aria-hidden className="absolute inset-x-6 bottom-4 h-7 rounded-full bg-black/5 blur-xl" />

      {hasImage ? (
        <div className={`relative h-full w-full ${imagePaddingClass}`}>
          <Image
            src={image!}
            alt={alt}
            fill
            sizes={sizes}
            className={`${imageClassName} object-center transition-transform duration-500 ease-out group-hover:scale-105`}
            style={{ filter: 'drop-shadow(0 14px 24px rgba(15,23,42,0.14))' }}
            loading="lazy"
            quality={85}
          />
        </div>
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="rounded-full bg-white/85 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            No Image
          </div>
        </div>
      )}
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
    compactLayout = 'standard',
  }: ProductCardProps) => {
    const { t, locale } = useI18n()
    const pc = t.productCard
    const isAdded = addedToCart?.has(product.id) || false
    const displayName = getProductDisplayName(product.name, locale)
    const description = product.shortDescription ?? product.description
    const discountPercent = getDiscountPercent(product.originalPrice, product.price)
    const hasDiscount = discountPercent != null
    const categoryName = getProductCategoryName(product)

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
          className="group relative flex h-full min-h-0 w-full overflow-hidden rounded-2xl border border-[#eadfd9] bg-[linear-gradient(140deg,#ffffff_0%,#fffaf6_55%,#fff3ec_100%)] shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
        >
          <div className="relative flex w-[8.25rem] shrink-0 items-center self-stretch overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(255,230,219,0.95)_0%,rgba(255,245,240,0.9)_52%,rgba(255,255,255,0.75)_100%)] sm:w-40">
            <div aria-hidden className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-[#ffd8c8]/50 blur-2xl" />
            <div aria-hidden className="absolute -right-5 top-4 h-14 w-14 rounded-full bg-white/70 blur-xl" />
            <ProductCardImageFrame
              image={product.image}
              alt={displayName}
              sizes="(max-width: 640px) 132px, 160px"
              imagePaddingClass=""
              imageClassName="object-cover"
            />

          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between p-3 sm:p-3.5">
            <div>
              {(categoryName || statusBadge || hasDiscount) && (
                <div className="mb-1.5 flex w-full min-w-0 flex-col items-start gap-1.5 sm:mb-2 sm:gap-2">
                  {categoryName && (
                    <span className="inline-flex max-w-full items-center rounded-full border border-[#dcc8bc] bg-[#fff6f0] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#8a4a1f] sm:px-2.5 sm:text-[9px]">
                      <span className="min-w-0 max-w-full truncate">{categoryName}</span>
                    </span>
                  )}
                  {statusBadge && (
                    <span
                      className={`inline-flex w-fit max-w-full items-center gap-0.5 rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase leading-none tracking-[0.12em] sm:gap-1 sm:px-2.5 sm:text-[9px] ${getStatusToneTextClass(statusBadge.tone)} ${getStatusToneSurfaceClass(statusBadge.tone)}`}
                    >
                      {statusBadge.icon === 'zap' ? (
                        <Zap className="h-2.5 w-2.5 shrink-0 stroke-[2.2] sm:h-3 sm:w-3" />
                      ) : (
                        <Star className="h-2.5 w-2.5 shrink-0 stroke-[2.2] sm:h-3 sm:w-3" />
                      )}
                      {statusBadge.label}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="inline-flex w-fit max-w-full items-center rounded-full bg-[#E53225] px-2 py-0.5 text-[8px] font-black leading-none tracking-[0.12em] text-white shadow-[0_6px_12px_rgba(229,50,37,0.2)] sm:text-[9px]">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              )}
              <h3 className="min-w-0 truncate text-[13px] font-black leading-snug tracking-tight text-slate-900 sm:text-[0.875rem]">
                {displayName}
              </h3>
              {description && (
                <p className="mt-1.5 line-clamp-1 text-xs leading-5 text-slate-500 sm:text-[13px]">
                  {description}
                </p>
              )}
            </div>

            <div className="mt-3 flex items-end justify-between gap-2">
              <div className="flex min-w-0 items-baseline gap-1.5">
                <div className="truncate text-base font-black tracking-tight text-slate-900 sm:text-[1.05rem]">
                  {formatPrice(product.price)} {CURRENCY}
                </div>
                {hasDiscount && product.originalPrice != null && (
                  <div className="shrink-0 text-xs font-medium text-slate-400 line-through">
                    {formatPrice(product.originalPrice)} {CURRENCY}
                  </div>
                )}
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
                  aria-label={isAdded ? pc.inCart : pc.addToCartTitle}
                  className={`inline-flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-all sm:gap-2 sm:px-3 lg:min-w-0 ${
                    isAdded
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_10px_20px_rgba(34,197,94,0.2)]'
                      : `${PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS} hover:shadow-[0_14px_26px_rgba(229,50,37,0.2)]`
                  }`}
                >
                  {isAdded ? (
                    <>
                      <svg className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="hidden lg:inline">{pc.inCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      <span className="hidden lg:inline">{pc.add}</span>
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
              className={`absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all duration-200 active:scale-90 sm:right-2.5 sm:top-2.5 ${wishlistBtnSurfaceClass}`}
            >
              {wishlistButtonVariant === 'remove' ? (
                <X
                  className="h-3.5 w-3.5 text-slate-600 transition-colors duration-200 hover:text-red-600 sm:h-4 sm:w-4"
                  strokeWidth={2.25}
                />
              ) : (
                <Heart
                  className={`h-3.5 w-3.5 transition-colors duration-200 sm:h-4 sm:w-4 ${
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
    const isShowcaseNarrow = isCompact && compactLayout === 'showcaseNarrow'
    const surfaceClass = isCompact
      ? 'border border-[#f1dfd4] bg-transparent shadow-none hover:-translate-y-1.5 hover:border-[#e7c8b6] hover:shadow-none'
      : 'border border-[#f1dfd4] bg-transparent shadow-none hover:-translate-y-1 hover:border-[#e7c8b6] hover:shadow-none'

    return (
      <Link
        href={`/products/${product.id}`}
        className={`group relative flex h-full min-h-0 w-full flex-col overflow-hidden transition-all duration-300 ${
          surfaceClass
        } ${isShowcaseNarrow ? 'rounded-3xl' : 'rounded-[2rem]'}`}
      >
        <div
          className={`relative shrink-0 overflow-hidden ${isShowcaseNarrow ? 'rounded-t-3xl' : 'rounded-t-[2rem]'}`}
          style={{
            aspectRatio: isCompact ? '1 / 1' : '1500 / 1125',
          }}
        >
          <div aria-hidden className="absolute inset-0 bg-white" />

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
                isShowcaseNarrow ? 'right-2 top-2 h-8 w-8' : isCompact ? 'h-9 w-9' : 'h-10 w-10'
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

          {product.image && product.image !== 'no-image' ? (
            <div className="relative z-10 h-full w-full overflow-hidden">
              <div
                className={`absolute inset-0 ${
                  isShowcaseNarrow
                    ? 'px-2 pb-2 pt-5'
                    : isCompact
                      ? 'px-4 pb-4 pt-6 sm:px-5 sm:pb-5 sm:pt-7'
                      : 'px-4 pb-4 pt-6 sm:px-5 sm:pb-5 sm:pt-7'
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
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                No Image
              </span>
            </div>
          )}

          <div
            className={`absolute z-20 flex items-center gap-1 rounded-full border border-white/70 bg-white/92 shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur ${
              isShowcaseNarrow
                ? 'bottom-1.5 right-1.5 px-2 py-0.5 text-[11px]'
                : isCompact
                  ? 'bottom-3 right-3 px-4 py-2 text-sm'
                  : 'bottom-3 right-3 px-5 py-2.5 text-base'
            }`}
          >
            {hasDiscount && product.originalPrice != null && (
              <span
                className={`font-medium text-slate-400 line-through ${
                  isShowcaseNarrow ? 'text-[10px]' : 'text-xs'
                }`}
              >
                {formatPrice(product.originalPrice)} {CURRENCY}
              </span>
            )}
            <span className={`font-black text-[#E53225] ${isShowcaseNarrow ? 'text-xs' : ''}`}>
              {formatPrice(product.price)} {CURRENCY}
            </span>
          </div>
        </div>

        <div
          className={`flex min-h-0 flex-1 flex-col ${
            isShowcaseNarrow
              ? 'gap-2 px-3 pb-3 pt-3'
              : isCompact
                ? 'gap-2.5 px-5 pb-5 pt-5'
                : 'gap-3 px-6 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7'
          }`}
        >
          {(categoryName || statusBadge || hasDiscount) && (
            <div
              className={`flex w-full min-w-0 flex-col items-start shrink-0 ${
                isShowcaseNarrow ? 'gap-1' : 'gap-1.5 sm:gap-2'
              }`}
            >
              {categoryName && (
                <span
                  className={`inline-flex max-w-full items-center rounded-full border border-[#dcc8bc] bg-[#fff6f0] font-bold uppercase tracking-[0.12em] text-[#8a4a1f] ${
                    isShowcaseNarrow
                      ? 'px-2 py-0.5 text-[8px]'
                      : 'px-2.5 py-1 text-[9px] sm:px-3 sm:text-[10px]'
                  }`}
                >
                  <span className="min-w-0 max-w-full truncate">{categoryName}</span>
                </span>
              )}
              {statusBadge && (
                <span
                  className={`inline-flex w-fit max-w-full items-center gap-1 rounded-full border font-semibold uppercase leading-none tracking-[0.12em] ${
                    isShowcaseNarrow
                      ? 'px-2 py-0.5 text-[8px]'
                      : 'px-2.5 py-1 text-[9px] sm:px-3 sm:text-[10px]'
                  } ${getStatusToneTextClass(statusBadge.tone)} ${getStatusToneSurfaceClass(statusBadge.tone)}`}
                >
                  {statusBadge.icon === 'zap' ? (
                    <Zap
                      className={`shrink-0 stroke-[2.2] ${isShowcaseNarrow ? 'h-2.5 w-2.5' : 'h-3 w-3'}`}
                    />
                  ) : (
                    <Star
                      className={`shrink-0 stroke-[2.2] ${isShowcaseNarrow ? 'h-2.5 w-2.5' : 'h-3 w-3'}`}
                    />
                  )}
                  {statusBadge.label}
                </span>
              )}
              {hasDiscount && (
                <span
                  className={`inline-flex w-fit max-w-full items-center rounded-full bg-[#E53225] font-black leading-none tracking-[0.12em] text-white shadow-[0_8px_16px_rgba(229,50,37,0.18)] ${
                    isShowcaseNarrow ? 'px-2 py-0.5 text-[8px]' : 'px-2.5 py-1 text-[9px] sm:px-3 sm:py-1.5 sm:text-[10px]'
                  }`}
                >
                  -{discountPercent}%
                </span>
              )}
            </div>
          )}

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <h3
              className={`min-w-0 shrink-0 truncate font-black tracking-tight text-slate-900 ${
                isShowcaseNarrow
                  ? 'text-[11px] leading-snug'
                  : isCompact
                    ? 'text-[0.9375rem] leading-snug'
                    : 'text-lg leading-tight'
              }`}
            >
              {displayName}
            </h3>

            {isCompact ? (
              description?.trim() ? (
                <p
                  className={`min-w-0 overflow-hidden break-words text-slate-500 ${
                    isShowcaseNarrow
                      ? 'mt-1 line-clamp-2 text-[11px] leading-4'
                      : 'mt-2 line-clamp-2 text-sm leading-6'
                  }`}
                >
                  {description}
                </p>
              ) : null
            ) : description?.trim() ? (
              <p className="mt-3 min-w-0 overflow-hidden break-words line-clamp-2 text-sm leading-6 text-slate-500 sm:text-[15px]">
                {description}
              </p>
            ) : null}

            {onAddToCart && (
              <div
                className={`mt-auto w-full shrink-0 ${isShowcaseNarrow ? 'pt-1' : isCompact ? 'pt-2' : 'pt-2.5'}`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onAddToCart(product)
                  }}
                  className={`flex w-full items-center justify-center gap-2 rounded-full font-semibold transition-all ${
                    isShowcaseNarrow ? 'h-8 text-[11px]' : isCompact ? 'h-11 text-sm' : 'h-12 text-base'
                  } ${
                    isAdded
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_14px_24px_rgba(34,197,94,0.22)]'
                      : `${PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS} hover:shadow-[0_18px_30px_rgba(229,50,37,0.24)]`
                  }`}
                  title={pc.addToCartTitle}
                  aria-label={isAdded ? pc.inCart : pc.addToCartTitle}
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="hidden lg:inline">{pc.inCart}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart className={`shrink-0 ${isCompact ? 'h-4 w-4' : 'h-5 w-5'}`} />
                      <span>{pc.add}</span>
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }
)

ProductCard.displayName = 'ProductCard'

export default ProductCard
