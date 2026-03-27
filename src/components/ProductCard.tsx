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

const PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS = `${BRAND_RED_CTA_IDLE_HOVER_CLASS} shadow-md`

const ProductCard = memo(({ product, onAddToCart, variant = 'default', addedToCart, isInWishlist, onToggleWishlist }: ProductCardProps) => {
  const { t, locale } = useI18n()
  const pc = t.productCard
  const isAdded = addedToCart?.has(product.id) || false
  const displayName = getProductDisplayName(product.name, locale)
  const description = product.shortDescription ?? product.description

  // ─── Horizontal variant ───────────────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <Link
        href={`/products/${product.id}`}
        className="relative flex bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all duration-200 overflow-hidden group"
      >
        {/* Left: Image */}
        <div
          className="relative w-32 sm:w-36 shrink-0 self-stretch overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 50% 65%, #FFE0D6 0%, #FFF0EB 45%, #FFF8F6 100%)',
          }}
        >
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(229,50,37,0.10) 0%, transparent 70%)' }}
          />
          <div
            aria-hidden
            className="absolute -top-3 -right-3 w-14 h-14 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,160,100,0.13) 0%, transparent 70%)' }}
          />

          {product.image && product.image !== 'no-image' ? (
            <Image
              src={product.image}
              alt={displayName}
              fill
              sizes="144px"
              className="object-contain p-2 group-hover:scale-[1.08] transition-transform duration-300 ease-out"
              style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.13))' }}
              loading="lazy"
              quality={85}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl">🥟</div>
          )}

          {/* Status badge */}
          {product.status === 'HIT' && (
            <div className="absolute top-2 left-2 bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <Star className="w-2.5 h-2.5" />{pc.badgeHit}
            </div>
          )}
          {product.status === 'NEW' && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <Zap className="w-2.5 h-2.5" />{pc.badgeNew}
            </div>
          )}
          {product.status === 'CLASSIC' && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <Star className="w-2.5 h-2.5" />{pc.badgeClassic}
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-[15px] leading-snug line-clamp-2">
              {displayName}
            </h3>
            {description && (
              <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Price + Add to cart */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <span className="text-base font-extrabold text-gray-900 shrink-0">
              {product.price} ֏
            </span>
            {onAddToCart && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAddToCart(product)
                }}
                title={pc.addToCartTitle}
                className={`flex items-center justify-center gap-1.5 h-9 px-4 rounded-full text-sm font-semibold transition-colors duration-200 shrink-0 ${
                  isAdded
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#E53225] text-white hover:bg-[#c42a1e]'
                }`}
              >
                {isAdded ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {pc.inCart}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {pc.add}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Wishlist */}
        {onToggleWishlist && (
          <button
            type="button"
            aria-label={isInWishlist ? pc.wishlistRemove : pc.wishlistAdd}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleWishlist(product.id)
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-all duration-200 active:scale-90 ${
              isInWishlist
                ? 'bg-red-50 hover:bg-red-100'
                : 'bg-white/95 hover:bg-white hover:shadow-md'
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-200 ${
                isInWishlist
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            />
          </button>
        )}
      </Link>
    )
  }

  // ─── Default / Compact variants (unchanged) ────────────────────────────────
  const isCompact = variant === 'compact'

  return (
    <Link
      href={`/products/${product.id}`}
      className={`relative block w-full cursor-pointer overflow-hidden rounded-[1.75rem] shadow-[0_6px_28px_rgba(15,23,42,0.07),0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(15,23,42,0.1),0_2px_6px_rgba(15,23,42,0.05)] ${
        isCompact ? 'rounded-2xl' : ''
      }`}
      style={{
        background: 'linear-gradient(155deg, #ffffff 0%, #fafafa 45%, #f5f5f5 100%)',
      }}
    >
      {/* Product image container */}
      <div
        className={`relative overflow-hidden max-w-full w-full ${
          isCompact ? 'rounded-t-2xl' : 'rounded-t-[1.75rem]'
        }`}
        style={{ aspectRatio: '1500/1125', maxWidth: 1500, maxHeight: 1125 }}
      >
        {onToggleWishlist && (
          <button
            type="button"
            aria-label={isInWishlist ? pc.wishlistRemove : pc.wishlistAdd}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleWishlist(product.id)
            }}
            className={`absolute z-10 p-3 rounded-full bg-white/95 backdrop-blur-sm shadow-md ${
              isCompact ? 'top-3 right-3' : 'top-4 right-4'
            }`}
          >
            <Heart
              className={`${isCompact ? 'h-5 w-5' : 'h-6 w-6'} ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        )}

        {product.image && product.image !== 'no-image' ? (
          <div className="relative w-full h-full overflow-visible z-0">
            <div
              className={`absolute -top-8 left-1/2 -translate-x-1/2 w-full h-[calc(100%+4rem)] overflow-visible [&>*]:!overflow-visible ${isCompact ? 'max-w-[260px]' : 'max-w-[320px]'}`}
              style={{ transform: 'perspective(1000px) rotateX(6deg) rotateY(-2deg)' }}
            >
              <div className="relative w-full h-full scale-[1.25] -translate-y-3 origin-bottom z-10">
              <Image
                src={product.image}
                alt={displayName}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                className="relative w-full h-full object-contain"
                style={{
                  filter: 'none',
                  imageRendering: 'crisp-edges',
                }}
                loading="lazy"
                quality={85}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) nextElement.style.display = 'flex';
                }}
              />
              <div
                className="absolute inset-0 items-center justify-center bg-slate-100 text-6xl text-slate-400"
                style={{ display: 'none' }}
                aria-hidden
              >
                🍽️
              </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-full max-w-[200px] h-[calc(100%+3rem)] flex items-center justify-center ${
              isCompact ? 'text-6xl' : 'text-8xl'
            }`}
            style={{ transform: 'perspective(1000px) rotateX(8deg) rotateY(-3deg)' }}
          >
            🥟
          </div>
        )}

        {/* Badges */}
        <div className={`absolute flex flex-col gap-2 z-20 ${isCompact ? 'top-2 left-2' : 'top-4 left-4'}`}>
          {!isCompact && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
              {product.category?.name
                ? getCategoryDisplayName(product.category.name, locale)
                : pc.uncategorized}
            </div>
          )}
          {product.status === 'HIT' && (
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
              <Star className="w-3 h-3" />{pc.badgeHit}
            </div>
          )}
          {product.status === 'NEW' && (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3" />{pc.badgeNew}
            </div>
          )}
          {product.status === 'CLASSIC' && (
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
              <Star className="w-3 h-3" />{pc.badgeClassic}
            </div>
          )}
        </div>

        {/* Price Badge */}
        <div
          className={`absolute bg-white rounded-full text-red-600 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 z-20 ${
            isCompact ? 'bottom-2 right-2 px-4 py-2 text-sm' : 'bottom-4 right-4 px-5 py-2.5 text-base'
          }`}
        >
          {product.price} ֏
        </div>
      </div>

      {/* Content Section */}
      <div className={`relative ${isCompact ? 'p-5 -mt-3' : 'px-7 pb-7 pt-5 -mt-5'}`}>
        <h3 className={`font-bold text-slate-800 line-clamp-2 tracking-tight ${
          isCompact ? 'mb-2 text-[1.05rem] leading-snug sm:text-base' : 'text-xl mb-3'
        }`}>
          {displayName}
        </h3>

        {isCompact && (product.category?.name || product.ingredients?.length) ? (
          <p className="mb-3 line-clamp-2 text-[13px] leading-snug text-slate-600 sm:text-sm">
            {[
              product.category?.name && getCategoryDisplayName(product.category.name, locale),
              product.ingredients?.length
                ? product.ingredients.slice(0, 3).join(', ')
                : null
            ]
              .filter(Boolean)
              .join(' • ')}
          </p>
        ) : null}

        {!isCompact && (
          <p className="text-slate-500 text-base mb-6 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className={`relative ${isCompact ? 'space-y-3' : 'space-y-4'}`}>
          {isCompact ? (
            <div className="flex flex-col space-y-3">
              {onAddToCart && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onAddToCart(product)
                  }}
                  className={`flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold ${
                    isAdded
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                      : PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS
                  }`}
                  title={pc.addToCartTitle}
                >
                  {isAdded ? (
                    <span className="flex items-center relative z-10">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {pc.inCart}
                    </span>
                  ) : (
                    <span className="flex items-center relative z-10">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {pc.add}
                    </span>
                  )}
                </button>
              )}
            </div>
          ) : (
            onAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAddToCart(product)
                }}
                className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-full text-lg font-semibold ${
                  isAdded
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                    : PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS
                }`}
                title={pc.addToCartTitle}
              >
                {isAdded ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {pc.inCart}
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5">
                    <ShoppingCart className="w-6 h-6" strokeWidth={2} />
                    {pc.add}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>

      <div
        className="absolute -bottom-1 -left-1 w-4 h-4 bg-amber-200/40 rounded-full opacity-60"
        aria-hidden
      />
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
