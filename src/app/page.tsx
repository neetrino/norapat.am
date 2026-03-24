'use client'

import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { getCategoryDisplayName } from "@/i18n/getCategoryDisplayName";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Product, ProductWithCategory, CategoryWithCount } from "@/types";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { BrandBannerSection } from "@/components/home/BrandBannerSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { PromoSection } from "@/components/home/PromoSection";
import { ActionsSection } from "@/components/home/ActionsSection";
const ADDED_TO_CART_FEEDBACK_MS = 2000
const HOME_PRODUCTS_LIMIT = 8

export default function Home() {
  const { t, locale } = useI18n()
  const h = t.home
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [bannerProduct, setBannerProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const [addedToCartBestSellers, setAddedToCartBestSellers] = useState<Set<string>>(new Set())
  const [addedToCartPromo, setAddedToCartPromo] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/categories', { signal: controller.signal, cache: 'no-store' })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Failed to fetch categories')))
      .then((data: CategoryWithCount[]) => {
        const list = Array.isArray(data) ? data : []
        setCategories(list)
        if (list.length > 0) {
          setActiveCategory((prev) => (prev === '' ? list[0].name : prev))
        }
      })
      .catch(() => setCategories([]))
    return () => controller.abort()
  }, [])

  const fetchProducts = async () => {
    try {
      const [productsResponse, bannerResponse] = await Promise.all([
        fetch('/api/products', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
        fetch('/api/products/banner', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
      ])
      
      if (!productsResponse.ok) {
        const errorText = await productsResponse.text()
        throw new Error(`Products API error: ${productsResponse.status} - ${errorText}`)
      }
      if (!bannerResponse.ok) {
        const errorText = await bannerResponse.text()
        throw new Error(`Banner API error: ${bannerResponse.status} - ${errorText}`)
      }
      
      const productsData = await productsResponse.json()
      const bannerData = await bannerResponse.json()
      
      if (Array.isArray(productsData)) {
        setProducts(productsData)
      } else {
        setProducts([])
      }
      
      setBannerProduct(bannerData)
    } catch {
      setBannerProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    setAddedToCart(prev => new Set(prev).add(product.id))
    
    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      setAddedToCart(prev => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, ADDED_TO_CART_FEEDBACK_MS)
  }

  const handleAddToCartBestSellers = (product: Product) => {
    addItem(product, 1)
    setAddedToCartBestSellers(prev => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedToCartBestSellers(prev => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, ADDED_TO_CART_FEEDBACK_MS)
  }

  const handleAddToCartPromo = (product: Product) => {
    addItem(product, 1)
    setAddedToCartPromo(prev => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedToCartPromo(prev => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, ADDED_TO_CART_FEEDBACK_MS)
  }

  const getFilteredProducts = () => {
    if (!Array.isArray(products)) return []
    if (!activeCategory) return products
    return products.filter((product) => product.category?.name === activeCategory)
  }

  const categoryNames = categories.map((c) => c.name)

  return (
    <div className="min-h-screen bg-white overflow-visible">
      {/* Отступ для fixed хедера */}
      <div className="lg:hidden h-16"></div>
      <div className="hidden lg:block h-24"></div>

      {/* 1. Բրենդային բաննեռի հատված (02-FUNCTIONAL 1.1) */}
      <BrandBannerSection bannerProduct={bannerProduct} onAddToCart={handleAddToCart} />

      {/* 2. Կատեգորիաների ցուցադրման հատված (02-FUNCTIONAL 1.2) */}
      <CategoriesSection onSelectCategory={setActiveCategory} productsSectionId="products-section" />

      {/* 3. Լավագույն ուտեսներ (02-FUNCTIONAL 1.3) */}
      <BestSellersSection
        onAddToCart={handleAddToCartBestSellers}
        addedToCart={addedToCartBestSellers}
        isInWishlist={isInWishlist}
        onToggleWishlist={toggleWishlist}
      />

      {/* 4. Զեղչեր / Հատուկ առաջարկներ (02-FUNCTIONAL 1.4) */}
      <PromoSection
        onAddToCart={handleAddToCartPromo}
        addedToCart={addedToCartPromo}
        isInWishlist={isInWishlist}
        onToggleWishlist={toggleWishlist}
      />

      {/* 4.1. Ակցիաներ — ժամանակավոր ակցիաներ, բաննեռներ (02-FUNCTIONAL 1.4) */}
      <ActionsSection />

      {/* 5. Products Showcase Section */}
      <section id="products-section" className="py-20 lg:py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12">
            
            {/* Category tabs - Mobile 2 rows, Desktop single row */}
            <div className="mb-20">
              {/* Mobile - 2 rows with better design */}
              <div className="lg:hidden">
                <div className="space-y-3">
                  {/* First row - Пиде и Комбо занимают весь ряд */}
                  <div className="grid grid-cols-2 gap-3">
                    {categoryNames.slice(0, 2).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 text-base ${
                          activeCategory === category
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/40 ring-1 ring-white/10'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                        }`}
                      >
                        {getCategoryDisplayName(category, locale)}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categoryNames.slice(2).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 text-sm ${
                          activeCategory === category
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/40 ring-1 ring-white/10'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                        }`}
                      >
                        {getCategoryDisplayName(category, locale)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Desktop - single row */}
              <div className="hidden lg:flex flex-wrap justify-center gap-4">
                {categoryNames.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      activeCategory === category
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getCategoryDisplayName(category, locale)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="mt-32">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
                <p className="text-gray-600">{h.productsLoading}</p>
              </div>
            </div>
          ) : getFilteredProducts().length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {h.categoryEmptyTitle(
                  getCategoryDisplayName(activeCategory, locale)
                )}
              </h3>
              <p className="text-gray-600 mb-6">
                {h.categoryEmptyHint}
              </p>
              <button
                onClick={() => setActiveCategory(categoryNames[0] ?? '')}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                {categoryNames.length > 0
                  ? h.showFirstCategory(
                      getCategoryDisplayName(categoryNames[0], locale)
                    )
                  : h.showCategories}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16 md:gap-12 overflow-visible">
              {getFilteredProducts().slice(0, HOME_PRODUCTS_LIMIT).map((product) => (
                <div
                  key={product.id}
                  className="overflow-visible"
                >
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

          {/* CTA */}
          <div className="text-center mt-16">
            <Link 
              href="/products"
              className="group inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>{h.viewFullMenu}</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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