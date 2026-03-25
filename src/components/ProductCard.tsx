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
  variant?: 'default' | 'compact'
  addedToCart?: Set<string>
  isInWishlist?: boolean
  onToggleWishlist?: (productId: string) => void
}

const PRODUCT_CARD_ADD_IDLE_BUTTON_CLASS = `${BRAND_RED_CTA_IDLE_HOVER_CLASS} shadow-md`

const ProductCard = memo(({ product, onAddToCart, variant = 'default', addedToCart, isInWishlist, onToggleWishlist }: ProductCardProps) => {
  const { t, locale } = useI18n()
  const pc = t.productCard
  const isCompact = variant === 'compact'
  const isAdded = addedToCart?.has(product.id) || false

  return (
    <Link 
      href={`/products/${product.id}`}
      className={`relative block w-full rounded-[1.75rem] overflow-hidden cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] ${
        isCompact ? 'rounded-2xl' : ''
      }`}
      style={{
        background: 'linear-gradient(155deg, #ffffff 0%, #fafafa 45%, #f5f5f5 100%)',
      }}
    >
      {/* Product image container — div 1500×1125 */}
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
        {/* Background Gradient - Removed */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-red-50 opacity-40 group-hover:opacity-60 transition-opacity duration-500" /> */}
        
        {/* 3D Floating Product - No top border */}
        {product.image && product.image !== 'no-image' ? (
          <div className="relative w-full h-full overflow-visible z-0">
            {/* 3D Product Image with floating effect - scaled image overflows freely */}
            <div
              className={`absolute -top-8 left-1/2 -translate-x-1/2 w-full h-[calc(100%+4rem)] overflow-visible [&>*]:!overflow-visible ${isCompact ? 'max-w-[260px]' : 'max-w-[320px]'}`}
              style={{ transform: 'perspective(1000px) rotateX(6deg) rotateY(-2deg)' }}
            >
              <div className="relative w-full h-full scale-[1.25] -translate-y-3 origin-bottom z-10">
              {/* Enhanced 3D Shadow Layer - Removed for cleaner look */}
              {/* <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-300/30 to-gray-400/20 rounded-3xl transform translate-y-6 translate-x-4 group-hover:translate-y-8 group-hover:translate-x-5 transition-all duration-700"
                style={{
                  filter: 'blur(8px)',
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-200/25 to-gray-300/15 rounded-3xl transform translate-y-4 translate-x-2 group-hover:translate-y-6 group-hover:translate-x-3 transition-all duration-700"
                style={{
                  filter: 'blur(4px)',
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-100/20 to-gray-200/10 rounded-3xl transform translate-y-2 translate-x-1 group-hover:translate-y-4 group-hover:translate-x-2 transition-all duration-700"
                style={{
                  filter: 'blur(2px)',
                }}
              /> */}
              
              {/* Main 3D Product Image - Enhanced mobile app style with Next.js Image */}
              <Image 
                src={product.image} 
                alt={getProductDisplayName(product.name, locale)}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                className="relative w-full h-full object-contain"
                style={{
                  filter: 'none',
                  imageRendering: 'crisp-edges',
                  imageRendering: '-webkit-optimize-contrast',
                }}
                loading="lazy"
                quality={85}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div 
                className="absolute inset-0 items-center justify-center bg-slate-100 text-6xl text-slate-400"
                style={{ display: 'none' }}
                aria-hidden
              >
                🍽️
              </div>
              
              {/* 3D Highlight Effect - Removed white overlay */}
              {/* <div 
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
                }}
              /> */}
              </div>
            </div>
          </div>
        ) : (
            <div 
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-full max-w-[200px] h-[calc(100%+3rem)] flex items-center justify-center ${
                isCompact ? 'text-6xl' : 'text-8xl'
              }`}
            style={{
              filter: 'none',
              transform: 'perspective(1000px) rotateX(8deg) rotateY(-3deg)',
            }}
          >
            🥟
          </div>
        )}
        
        {/* Badges */}
        <div className={`absolute flex flex-col gap-2 z-20 ${isCompact ? 'top-2 left-2' : 'top-4 left-4'}`}>
          {/* Category Badge */}
          {!isCompact && (
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
            >
              {product.category?.name
                ? getCategoryDisplayName(product.category.name, locale)
                : pc.uncategorized}
            </div>
          )}
          
          {/* Status Badges */}
          {product.status === 'HIT' && (
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
              <Star className="w-3 h-3" />
              {pc.badgeHit}
            </div>
          )}
          {product.status === 'NEW' && (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {pc.badgeNew}
            </div>
          )}
          {product.status === 'CLASSIC' && (
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
              <Star className="w-3 h-3" />
              {pc.badgeClassic}
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

        {/* Bottom Gradient Overlay - Removed black overlay */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
      </div>
      
      {/* Content Section */}
      <div className={`relative ${isCompact ? 'p-5 -mt-3' : 'px-7 pb-7 pt-5 -mt-5'}`}>
        {/* Product Name */}
        <h3 className={`font-bold text-slate-800 line-clamp-2 tracking-tight ${
          isCompact ? 'text-base mb-2' : 'text-xl mb-3'
        }`}>
          {getProductDisplayName(product.name, locale)}
        </h3>

        {/* Main attributes (compact): category + ingredients preview */}
        {isCompact && (product.category?.name || product.ingredients?.length) ? (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
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
        
        {/* Description for non-compact */}
        {!isCompact && (
          <p className="text-slate-500 text-base mb-6 line-clamp-2 leading-relaxed">
            {product.shortDescription ?? product.description}
          </p>
        )}
        
        {/* Action Section */}
        <div className={`relative ${isCompact ? 'space-y-3' : 'space-y-4'}`}>
          {isCompact ? (
            // Կոմպակտ տարբերակ (կոճակ միայն onAddToCart-ի դեպքում)
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
            // Default variant — full-width button
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

      {/* Subtle decorative accent */}
      <div 
        className="absolute -bottom-1 -left-1 w-4 h-4 bg-amber-200/40 rounded-full opacity-60"
        aria-hidden
      />
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
