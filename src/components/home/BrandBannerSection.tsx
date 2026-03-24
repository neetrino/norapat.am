'use client'

import Link from 'next/link'
import { Phone, ShoppingCart } from 'lucide-react'
import { Product } from '@/types'
import { useI18n } from '@/i18n/I18nContext'

export interface BrandBannerSectionProps {
  bannerProduct: Product | null
  onAddToCart: (product: Product) => void
}

/**
 * Բրենդային բաննեռի հատված — հերո + ապրանք-բաններ (BANNER).
 * Տվյալները parent-ից (page) — bannerProduct from /api/products/banner.
 */
export function BrandBannerSection({ bannerProduct, onAddToCart }: BrandBannerSectionProps) {
  const { t } = useI18n()
  const bb = t.brandBanner
  const homeAria = t.home.ariaBrandBanner
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (bannerProduct) onAddToCart(bannerProduct)
  }

  return (
    <section className="relative bg-orange-500 text-white overflow-hidden" aria-label={homeAria}>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-200/20 rounded-full animate-bounce" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-ping" />
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-yellow-300/30 rounded-full animate-pulse" />
      </div>

      {/* Mobile */}
      <div className="md:hidden relative max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h1 className="text-3xl font-bold leading-tight mb-3">
              <span className="block text-white">{bb.titleWhite}</span>
              <span className="block text-yellow-200">{bb.titleAccent}</span>
            </h1>
            <p className="text-base text-orange-100 mb-4 font-medium">{bb.mobileTagline}</p>
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-200">15+</div>
                <div className="text-orange-100 font-medium">{bb.statFlavors}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-200">20</div>
                <div className="text-orange-100 font-medium">{bb.statMinutes}</div>
              </div>
            </div>
          </div>
          <div className="relative flex-shrink-0">
            {bannerProduct ? (
              <div className="relative bg-white/25 backdrop-blur-xl rounded-2xl p-3 text-center border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                <div className="relative w-28 h-28 mx-auto mb-2 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={bannerProduct.image}
                    alt={bannerProduct.name}
                    className="relative w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const t = e.currentTarget
                      t.classList.add('hidden')
                      const next = t.nextElementSibling as HTMLElement
                      if (next) next.classList.remove('hidden')
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-4xl hidden" aria-hidden>🥟</div>
                  <div className="absolute bottom-1 right-1 bg-yellow-400 text-orange-800 px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {bannerProduct.price} ֏
                  </div>
                </div>
                <h3 className="text-sm font-bold mb-1 text-white line-clamp-1">{bannerProduct.name}</h3>
                <p className="text-xs text-orange-100/90 mb-2 line-clamp-1">{bannerProduct.description}</p>
                <button
                  onClick={handleAdd}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-1.5 px-2 rounded-lg text-xs font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center justify-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    {bb.add}
                  </span>
                </button>
              </div>
            ) : (
              <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl p-3 text-center border border-white/20">
                <div className="relative w-24 h-24 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🥟</span>
                </div>
                <h3 className="text-sm font-bold mb-1 text-white">{bb.cardTitle}</h3>
                <p className="text-xs text-orange-100">{bb.cardSubtitle}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tablet */}
      <div className="hidden md:block lg:hidden relative max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-8">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              <span className="block text-white">{bb.titleWhite}</span>
              <span className="block text-yellow-200">{bb.titleAccent}</span>
            </h1>
            <p className="text-lg text-orange-100 mb-6 font-medium">{bb.mobileTagline}</p>
            <div className="flex gap-8 text-base">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200">15+</div>
                <div className="text-orange-100 font-medium">{bb.statFlavors}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200">20</div>
                <div className="text-orange-100 font-medium">{bb.statMinutes}</div>
              </div>
            </div>
          </div>
          <div className="relative flex-shrink-0">
            {bannerProduct ? (
              <div className="relative bg-white/25 backdrop-blur-xl rounded-3xl p-4 text-center border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                <div className="relative w-36 h-36 mx-auto mb-3 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src={bannerProduct.image}
                    alt={bannerProduct.name}
                    className="relative w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const t = e.currentTarget
                      t.classList.add('hidden')
                      const next = t.nextElementSibling as HTMLElement
                      if (next) next.classList.remove('hidden')
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-5xl hidden" aria-hidden>🥟</div>
                  <div className="absolute bottom-2 right-2 bg-yellow-400 text-orange-800 px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                    {bannerProduct.price} ֏
                  </div>
                </div>
                <h3 className="text-base font-bold mb-2 text-white line-clamp-1">{bannerProduct.name}</h3>
                <p className="text-sm text-orange-100/90 mb-3 line-clamp-1">{bannerProduct.description}</p>
                <button
                  onClick={handleAdd}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-3 rounded-xl text-sm font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    {bb.add}
                  </span>
                </button>
              </div>
            ) : (
              <div className="relative bg-white/15 backdrop-blur-lg rounded-3xl p-4 text-center border border-white/20">
                <div className="relative w-32 h-32 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🥟</span>
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{bb.cardTitle}</h3>
                <p className="text-sm text-orange-100">{bb.cardSubtitle}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              {bb.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="block text-white animate-slide-up">{bb.titleWhite}</span>
              <span className="block text-yellow-200 animate-slide-up-delay">{bb.titleAccent}</span>
              <span className="block text-2xl md:text-3xl font-normal text-orange-100 mt-3 animate-fade-in-delay">
                {bb.tagline}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-orange-100 leading-relaxed max-w-lg animate-fade-in-delay-2">
              {bb.descriptionBefore}
              <span className="font-semibold text-yellow-200">{bb.descriptionHighlight}</span>
              {bb.descriptionAfter}
            </p>
            <div className="flex flex-wrap gap-6 animate-fade-in-delay-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200">15+</div>
                <div className="text-sm text-orange-100">{bb.statFlavors}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200">20</div>
                <div className="text-sm text-orange-100">{bb.statMinutes}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200">24/7</div>
                <div className="text-sm text-orange-100">{bb.statDelivery}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-delay-4">
              <Link
                href="/products"
                className="group bg-white text-orange-500 px-6 py-3 rounded-xl font-bold text-base hover:bg-yellow-100 hover:scale-105 transition-all duration-300 text-center shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                    {bb.viewMenu}
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/contact"
                className="group border-2 border-white text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-white hover:text-orange-500 hover:scale-105 transition-all duration-300 text-center backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  <Phone className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                  {bb.contactUs}
                </span>
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in-delay-5">
            {bannerProduct && (
              <div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-orange-600 px-4 py-2 rounded-2xl text-lg font-bold shadow-2xl z-[100]"
                style={{ boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)' }}
              >
                {bannerProduct.price} ֏
              </div>
            )}
            {bannerProduct ? (
              <div className="relative w-80 h-80 mx-auto mb-4">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[calc(100%+4rem)] h-[calc(100%+4rem)] group z-50">
                  <div className="absolute inset-0 bg-orange-200/30 rounded-3xl transform translate-y-6 translate-x-3 group-hover:translate-y-8 group-hover:translate-x-4 transition-all duration-700 blur-md" />
                  <div className="absolute inset-0 bg-orange-300/25 rounded-3xl transform translate-y-4 translate-x-2 group-hover:translate-y-6 group-hover:translate-x-3 transition-all duration-700 blur-sm" />
                  <div className="absolute inset-0 bg-orange-400/20 rounded-3xl transform translate-y-2 translate-x-1 group-hover:translate-y-4 group-hover:translate-x-2 transition-all duration-700 blur-[1px]" />
                  <img
                    src={bannerProduct.image}
                    alt={bannerProduct.name}
                    className="relative w-full h-full object-contain group-hover:scale-[1.05] group-hover:translate-y-2 group-hover:rotate-3 transition-all duration-700 ease-out z-50"
                    style={{
                      transform: 'perspective(1000px) rotateX(8deg) rotateY(-3deg)',
                    }}
                    loading="lazy"
                    onError={(e) => {
                      const t = e.currentTarget
                      t.classList.add('hidden')
                      const next = t.nextElementSibling as HTMLElement
                      if (next) next.classList.remove('hidden')
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-8xl hidden" aria-hidden>🥟</div>
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500 shadow-lg" />
                  <div className="absolute top-1/2 -left-4 w-4 h-4 bg-red-500 rounded-full opacity-40 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500 shadow-lg" />
                </div>
              </div>
            ) : (
              <div className="relative w-72 h-72 mx-auto mb-6">
                <div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[calc(100%+3rem)] h-[calc(100%+3rem)] flex items-center justify-center bg-gradient-to-br from-orange-200 to-red-200 opacity-70 rounded-3xl shadow-2xl text-8xl"
                  style={{ transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)' }}
                >
                  🥟
                </div>
              </div>
            )}
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 shadow-2xl overflow-visible hover:shadow-3xl hover:scale-[1.02] transition-all duration-700 cursor-pointer group">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full animate-bounce" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-300 rounded-full animate-pulse" />
              {bannerProduct ? (
                <>
                  <h3 className="text-2xl font-bold mb-2">{bannerProduct.name}</h3>
                  <p className="text-orange-100 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {bannerProduct.description}
                  </p>
                  <button
                    onClick={handleAdd}
                    className="bg-yellow-400 text-orange-800 px-6 py-3 rounded-xl font-bold hover:scale-105 active:bg-green-500 active:text-white transition-all duration-300 shadow-lg"
                  >
                    <ShoppingCart className="inline w-5 h-5 mr-2" />
                    {bb.quickOrder}
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-2">{bb.cardTitle}</h3>
                  <p className="text-orange-100 mb-4 opacity-80">{bb.cardSubtitle}</p>
                  <Link
                    href="/products"
                    className="bg-yellow-400 text-orange-800 px-6 py-3 rounded-xl font-bold hover:scale-105 active:bg-green-500 active:text-white transition-all duration-300 shadow-lg inline-block"
                  >
                    <ShoppingCart className="inline w-5 h-5 mr-2" />
                    {bb.viewMenuBtn}
                  </Link>
                </>
              )}
            </div>
            <div className="absolute -top-4 -left-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 animate-float">
              <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">🍕</span>
              </div>
              <div className="text-xs font-semibold">{bb.floatFlavors}</div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 animate-float-delay">
              <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">🚚</span>
              </div>
              <div className="text-xs font-semibold">{bb.fastDelivery}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
