'use client'

import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Product, ProductWithCategory } from "@/types";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { BrandBannerSection } from "@/components/home/BrandBannerSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ActionsSection } from "@/components/home/ActionsSection";
const ADDED_TO_CART_FEEDBACK_MS = 2000
const HOME_PRODUCTS_LIMIT = 8

/** Հատուկ առաջարկներ — ինչպես /api/products/promo (HIT, NEW) */
const PROMO_STATUS_IN = 'HIT,NEW'
/** Լավագույն ապրանքներ — ինչպես /api/products/featured (HIT, NEW, CLASSIC) */
const BEST_STATUS_IN = 'HIT,NEW,CLASSIC'

export default function Home() {
  const { t } = useI18n()
  const h = t.home
  const [bestProducts, setBestProducts] = useState<ProductWithCategory[]>([])
  const [promoProducts, setPromoProducts] = useState<ProductWithCategory[]>([])
  const [loadingBest, setLoadingBest] = useState(true)
  const [loadingPromo, setLoadingPromo] = useState(true)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()

  useEffect(() => {
    const controller = new AbortController()
    const fetchOpts: RequestInit = {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    }

    const load = (statusIn: string, onData: (p: ProductWithCategory[]) => void, onDone: () => void) => {
      const params = new URLSearchParams()
      params.set('statusIn', statusIn)
      params.set('sort', 'newest')
      fetch(`/api/products?${params.toString()}`, fetchOpts)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch products')
          return res.json()
        })
        .then((data: ProductWithCategory[]) => {
          onData(Array.isArray(data) ? data : [])
        })
        .catch(() => onData([]))
        .finally(onDone)
    }

    setLoadingBest(true)
    setLoadingPromo(true)
    load(BEST_STATUS_IN, setBestProducts, () => setLoadingBest(false))
    load(PROMO_STATUS_IN, setPromoProducts, () => setLoadingPromo(false))

    return () => controller.abort()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    setAddedToCart(prev => new Set(prev).add(product.id))
    
    // Հեռացնել ընդգծումը 2 վայրկյանից
    setTimeout(() => {
      setAddedToCart(prev => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, ADDED_TO_CART_FEEDBACK_MS)
  }

  return (
    <div className="min-h-screen bg-white overflow-visible">
      {/* Բացատ ֆիքսված header-ի համար */}
      <div className="lg:hidden h-16"></div>
      <div className="hidden lg:block h-24"></div>

      {/* 1. Բրենդային բաննեռի հատված (02-FUNCTIONAL 1.1) */}
      <BrandBannerSection />

      {/* 2. Կատեգորիաների ցուցադրման հատված (02-FUNCTIONAL 1.2) */}
      <CategoriesSection />

      {/* 3–4. Լավագույն + հատուկ առաջարկներ — ցուցադրվում են «products-section»-ում կույտով */}

      {/* 3.1. Ակցիաներ — ժամանակավոր ակցիաներ, բաննեռներ (02-FUNCTIONAL 1.4) */}
      <ActionsSection />

      {/* 5. Products Showcase — նույն visual ռիթմը, ինչ BestSellersSection / PromoSection / ActionsSection */}
      <section
        id="products-section"
        className="scroll-mt-24"
        aria-label={`${h.bestSellers.title} · ${h.promo.title}`}
      >
        {/* Լավագույն — ինչպես BestSellersSection (`from-orange-50/60 to-white`) */}
        <div className="bg-gradient-to-b from-orange-50/60 to-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center lg:mb-12">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                {h.bestSellers.title}
              </h2>
              <p className="mx-auto max-w-xl text-sm text-gray-600 sm:text-base">
                {h.bestSellers.subtitle}
              </p>
            </div>

            {loadingBest ? (
              <div className="flex justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : bestProducts.length === 0 ? (
              <div className="mx-auto max-w-lg rounded-2xl border border-orange-100 bg-orange-50/50 px-6 py-10 text-center">
                <p className="text-base font-semibold text-gray-900 sm:text-lg">
                  {h.showcaseEmptyBest}
                </p>
                <p className="mt-2 text-sm text-gray-600">{h.categoryEmptyHint}</p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  {h.viewFullMenu}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 gap-y-12 overflow-visible md:grid-cols-3 md:gap-8 md:gap-y-16 lg:grid-cols-4">
                {bestProducts.slice(0, HOME_PRODUCTS_LIMIT).map((product) => (
                  <div key={product.id} className="overflow-visible">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      variant="compact"
                      addedToCart={addedToCart}
                      isInWishlist={isInWishlist(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Հատուկ առաջարկներ — ինչպես PromoSection (`from-amber-50/80 to-white`) */}
        <div className="bg-gradient-to-b from-amber-50/80 to-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center lg:mb-12">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                {h.promo.title}
              </h2>
              <p className="mx-auto max-w-xl text-sm text-gray-600 sm:text-base">
                {h.promo.subtitle}
              </p>
            </div>

            {loadingPromo ? (
              <div className="flex justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
              </div>
            ) : promoProducts.length === 0 ? (
              <div className="mx-auto max-w-lg rounded-2xl border border-amber-100 bg-amber-50/50 px-6 py-10 text-center">
                <p className="text-base font-semibold text-gray-900 sm:text-lg">
                  {h.showcaseEmptyPromo}
                </p>
                <p className="mt-2 text-sm text-gray-600">{h.categoryEmptyHint}</p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  {h.viewFullMenu}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 gap-y-12 overflow-visible md:grid-cols-3 md:gap-8 md:gap-y-16 lg:grid-cols-4">
                {promoProducts.slice(0, HOME_PRODUCTS_LIMIT).map((product) => (
                  <div key={product.id} className="overflow-visible">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      variant="compact"
                      addedToCart={addedToCart}
                      isInWishlist={isInWishlist(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  </div>
                ))}
              </div>
            )}

            {!loadingPromo && promoProducts.length > 0 ? (
              <div className="mt-10 text-center lg:mt-12">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  <span>{h.viewFullMenu}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Features Section - Hidden on mobile and tablet */}
      <section className="hidden lg:block py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {h.whyUsTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {h.whyUsSubtitle}
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fast delivery */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{h.featureFastTitle}</h3>
              <p className="text-gray-600 text-center mb-4">{h.featureFastDesc}</p>
              <div className="text-center">
                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {h.featureFastBadge}
                </span>
              </div>
            </div>

            {/* Delivery */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{h.featureDeliveryTitle}</h3>
              <p className="text-gray-600 text-center mb-4">{h.featureDeliveryDesc}</p>
            <div className="text-center">
                <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {h.featureDeliveryBadge}
                </span>
              </div>
            </div>

            {/* Quality */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{h.featureQualityTitle}</h3>
              <p className="text-gray-600 text-center mb-4">{h.featureQualityDesc}</p>
            <div className="text-center">
                <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {h.featureQualityBadge}
                </span>
              </div>
            </div>

            {/* Support */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{h.featureSupportTitle}</h3>
              <p className="text-gray-600 text-center mb-4">{h.featureSupportDesc}</p>
            <div className="text-center">
                <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {h.featureSupportBadge}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Testimonials Section - Hidden on mobile and tablet */}
      <section className="hidden lg:block py-24 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {h.testimonialsTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {h.testimonialsSubtitle}
            </p>
          </div>

          {/* Testimonials grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {h.testimonial1Quote}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-500 font-bold text-lg">{h.testimonial1Initial}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{h.testimonial1Name}</h4>
                  <p className="text-sm text-gray-500">{h.testimonial1Role}</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {h.testimonial2Quote}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-500 font-bold text-lg">{h.testimonial2Initial}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{h.testimonial2Name}</h4>
                  <p className="text-sm text-gray-500">{h.testimonial2Role}</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {h.testimonial3Quote}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-500 font-bold text-lg">{h.testimonial3Initial}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{h.testimonial3Name}</h4>
                  <p className="text-sm text-gray-500">{h.testimonial3Role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">1000+</div>
              <div className="text-gray-600">{h.statHappyClients}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">15+</div>
              <div className="text-gray-600">{h.statUniqueFlavors}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">20</div>
              <div className="text-gray-600">{h.statDeliveryMinutes}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">4.9</div>
              <div className="text-gray-600">{h.statRating}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Hidden on mobile and tablet */}
      <section className="hidden lg:block py-24 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {h.ctaTitle}
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            {h.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-white text-orange-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {h.ctaOrderNow}
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-500 hover:scale-105 transition-all duration-300"
            >
              {h.ctaLearnMore}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Hidden on mobile and tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
      
      {/* Add bottom padding for mobile and tablet nav */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
}