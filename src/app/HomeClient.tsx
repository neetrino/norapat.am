'use client'

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Product, ProductWithCategory } from "@/types";
import Footer from "@/components/Footer";
import { BrandBannerSection } from "@/components/home/BrandBannerSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ActionsSection } from "@/components/home/ActionsSection";
import { HomeShowcaseCarousel } from "@/components/home/HomeShowcaseCarousel";
import { BRAND_RED_CTA_IDLE_HOVER_CLASS } from "@/components/home/promo-food-banner/promoFoodBanner.constants";
import { HOME_BEST_STATUS_IN, HOME_PROMO_STATUS_IN } from "@/lib/homeShowcase";
const ADDED_TO_CART_FEEDBACK_MS = 2000
/** Next/Image ներքին չափեր — ցուցադրման ժամանակ պահպանվում է հարաբերակցությունը `object-contain`-ով */
const HOME_CTA_CHARACTER_IMAGE_WIDTH_PX = 480
const HOME_CTA_CHARACTER_IMAGE_HEIGHT_PX = 640

export default function HomeClient() {
  const { t } = useI18n()
  const h = t.home
  const [bestProducts, setBestProducts] = useState<ProductWithCategory[]>([])
  const [promoProducts, setPromoProducts] = useState<ProductWithCategory[]>([])
  const [loadingBest, setLoadingBest] = useState(true)
  const [loadingPromo, setLoadingPromo] = useState(true)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist, isAuthenticated } = useWishlist()

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
    load(HOME_BEST_STATUS_IN, setBestProducts, () => setLoadingBest(false))
    load(HOME_PROMO_STATUS_IN, setPromoProducts, () => setLoadingPromo(false))

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
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

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
        className="scroll-mt-24 bg-white py-16 lg:py-20"
        aria-label={`${h.bestSellers.title} · ${h.promo.title}`}
      >
        {/* Լավագույն — ինչպես BestSellersSection (`from-orange-50/60 to-white`) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
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
              <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
                <p className="text-base font-semibold text-gray-900 sm:text-lg">
                  {h.showcaseEmptyBest}
                </p>
                <p className="mt-2 text-sm text-gray-600">{h.categoryEmptyHint}</p>
                <Link
                  href="/products"
                  className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
                >
                  {h.viewFullMenu}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <>
                <HomeShowcaseCarousel
                  products={bestProducts}
                  onAddToCart={handleAddToCart}
                  addedToCart={addedToCart}
                  isInWishlist={isAuthenticated ? isInWishlist : undefined}
                  onToggleWishlist={
                    isAuthenticated ? (id) => { void toggleWishlist(id) } : undefined
                  }
                />
                <div className="mt-8 text-center">
                  <Link
                    href="/products"
                    className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
                  >
                    <span>{h.ctaLearnMore}</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Հատուկ առաջարկներ — ինչպես PromoSection (`from-amber-50/80 to-white`) */}
        <div className="mx-auto mt-6 max-w-7xl px-4 sm:mt-8 sm:px-6 lg:mt-10 lg:px-8">
          <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
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
              <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
                <p className="text-base font-semibold text-gray-900 sm:text-lg">
                  {h.showcaseEmptyPromo}
                </p>
                <p className="mt-2 text-sm text-gray-600">{h.categoryEmptyHint}</p>
                <Link
                  href="/products"
                  className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
                >
                  {h.viewFullMenu}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <>
                <HomeShowcaseCarousel
                  products={promoProducts}
                  onAddToCart={handleAddToCart}
                  addedToCart={addedToCart}
                  isInWishlist={isAuthenticated ? isInWishlist : undefined}
                  onToggleWishlist={
                    isAuthenticated ? (id) => { void toggleWishlist(id) } : undefined
                  }
                />
                <div className="mt-8 text-center">
                  <Link
                    href="/products"
                    className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold ${BRAND_RED_CTA_IDLE_HOVER_CLASS}`}
                  >
                    <span>{h.ctaLearnMore}</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
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
              <p className="whitespace-pre-line text-center text-gray-600 mb-4">{h.featureSupportDesc}</p>
            <div className="text-center">
                <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {h.featureSupportBadge}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section — նույն ֆոնը ինչ հերո բանները (`globals.css` → promo-food-banner-*) */}
      <section
        className="mt-6 hidden w-full bg-white pt-8 pb-0 lg:mt-10 lg:block lg:pt-10 lg:pb-0"
        aria-labelledby="home-cta-heading"
      >
        <div className="w-full">
          <div className="promo-food-banner-bg promo-food-banner-vignette relative z-10 flex w-full flex-col items-center gap-4 overflow-hidden rounded-none px-4 py-7 text-white sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-3 lg:px-8 lg:py-9">
          <div className="order-2 flex w-full flex-1 justify-center lg:order-1 lg:justify-end lg:pr-4">
            <Image
              src="/home-cta-girl.png"
              alt={h.ctaGirlIllustrationAlt}
              width={HOME_CTA_CHARACTER_IMAGE_WIDTH_PX}
              height={HOME_CTA_CHARACTER_IMAGE_HEIGHT_PX}
              className="h-auto max-h-[min(44vw,22rem)] w-auto max-w-[min(88vw,20rem)] object-contain object-bottom lg:max-h-[min(38vw,26rem)] lg:max-w-[22rem] xl:max-h-[30rem] xl:max-w-[24rem]"
              sizes="(min-width: 1280px) 26rem, (min-width: 1024px) 24rem, 100vw"
            />
          </div>

          <div className="order-1 w-full max-w-xl shrink-0 text-center lg:order-2 lg:self-center">
            <h2 id="home-cta-heading" className="mb-2 text-3xl font-bold md:text-4xl">
              {h.ctaTitle}
            </h2>
            <p className="mx-auto mb-4 text-lg text-white/90">
              {h.ctaSubtitle}
            </p>
            <div className="flex flex-col justify-center gap-2.5 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className="rounded-xl bg-white px-6 py-2.5 text-base font-bold text-[#A51D1D] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 sm:text-lg"
              >
                {h.ctaOrderNow}
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border-2 border-white px-6 py-2.5 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#A51D1D] sm:text-lg"
              >
                {h.ctaLearnMore}
              </Link>
            </div>
          </div>

          <div className="order-3 flex w-full flex-1 justify-center lg:justify-start lg:pl-4">
            <Image
              src="/home-cta-boy.png"
              alt={h.ctaBoyIllustrationAlt}
              width={HOME_CTA_CHARACTER_IMAGE_WIDTH_PX}
              height={HOME_CTA_CHARACTER_IMAGE_HEIGHT_PX}
              className="h-auto max-h-[min(44vw,22rem)] w-auto max-w-[min(88vw,20rem)] object-contain object-bottom lg:max-h-[min(38vw,26rem)] lg:max-w-[22rem] xl:max-h-[30rem] xl:max-w-[24rem]"
              sizes="(min-width: 1280px) 26rem, (min-width: 1024px) 24rem, 100vw"
            />
          </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
