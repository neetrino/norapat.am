'use client'

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, ArrowDownUp, SlidersHorizontal } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { Product, Category } from '@/types'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useI18n } from '@/i18n/I18nContext'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'
import { getMenuCategorySectionId } from '@/lib/categoryNav.utils'

const CATEGORY_ORDER = ['Կոմբո', 'Պիդե', 'Սնաք', 'Սոուսներ', 'Ըմպելիքներ'] as const

function ProductsPageContent() {
  const { t, locale } = useI18n()
  const productsCopy = t.products
  const allCategories = t.products.allCategories
  const searchCopy = t.search
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(allCategories)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<string>('newest')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuHashScrollDoneRef = useRef(false)
  const menuHashInitRef = useRef(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== allCategories) params.set('category', selectedCategory)
      if (debouncedSearchQuery) params.set('search', debouncedSearchQuery)
      params.set('sort', sortOrder)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, allCategories, debouncedSearchQuery, sortOrder, minPrice, maxPrice])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    setSelectedCategory(allCategories)
  }, [locale, allCategories])

  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearchQuery(searchParam)
      setDebouncedSearchQuery(searchParam)
      setSelectedCategory(allCategories)
    }
  }, [searchParams, allCategories])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery !== debouncedSearchQuery) {
      setSearching(true)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setSearching(false)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, debouncedSearchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Խմբավորել ապրանքները ըստ կատեգորիաների
  const groupProductsByCategory = useCallback((products: Product[]) => {
    const grouped: Record<string, Product[]> = {}
    
    products.forEach(product => {
      const categoryName = product.category?.name || productsCopy.uncategorized
      if (!grouped[categoryName]) {
        grouped[categoryName] = []
      }
      grouped[categoryName].push(product)
    })

    // Կարգավորել կատեգորիաները՝ նախ առաջնահերթ, ապա մնացած
    const prioritySet = new Set<string>([...CATEGORY_ORDER])
    const priorityCategories = CATEGORY_ORDER.filter((cat) => grouped[cat])
    const otherCategories = Object.keys(grouped).filter((cat) => !prioritySet.has(cat))
    const sortedCategories = [...priorityCategories, ...otherCategories]
    
    return sortedCategories.map(category => ({
      category,
      products: grouped[category]
    }))
  }, [productsCopy.uncategorized])

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1)
    setAddedToCart(prev => new Set(prev).add(product.id))
    
    // Հեռացնել ընդգծումը 2 վայրկյանից
    setTimeout(() => {
      setAddedToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }, [addItem])

  // Մեմոիզացնել խմբավորված ապրանքները
  const groupedProducts = useMemo(() => {
    return groupProductsByCategory(filteredProducts)
  }, [filteredProducts, groupProductsByCategory])

  /** Գլխավոր էջից `#mc-...` — մենյուի «Բոլորը» տեսք + համապատասխան բաժին scroll */
  useEffect(() => {
    if (typeof window === 'undefined' || menuHashInitRef.current) return
    const raw = window.location.hash.replace(/^#/, '')
    if (!raw.startsWith('mc-')) return

    menuHashInitRef.current = true
    setSelectedCategory(allCategories)
    setSearchQuery('')
    setDebouncedSearchQuery('')
  }, [allCategories])

  useEffect(() => {
    if (typeof window === 'undefined' || loading || menuHashScrollDoneRef.current) return
    const raw = window.location.hash.replace(/^#/, '')
    if (!raw.startsWith('mc-')) return
    if (selectedCategory !== allCategories || debouncedSearchQuery) return

    const el = document.getElementById(raw)
    if (!el) return

    const run = () => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      menuHashScrollDoneRef.current = true
    }
    const t = window.setTimeout(run, 120)
    return () => window.clearTimeout(t)
  }, [
    loading,
    selectedCategory,
    debouncedSearchQuery,
    allCategories,
    groupedProducts.length,
  ])

  // Սկելետոնի կոմպոնենտ ապրանքի քարտի համար
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-12 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded mx-auto mb-4 w-64 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="flex flex-wrap gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-12 w-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <Footer />
        </div>
        <div className="lg:hidden h-16"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-visible">
      {/* Բացատ ֆիքսված header-ի համար */}
      <div className="lg:hidden h-16"></div>
      <div className="hidden lg:block h-24"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 lg:w-80 relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                searching ? 'text-orange-500 animate-pulse' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder={searchCopy.productsPage}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-gray-900 placeholder-gray-500 bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md focus:bg-white"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-5 w-5 text-gray-500" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-gray-900 font-medium"
                >
                  <option value="newest">{productsCopy.sortNewest}</option>
                  <option value="price_asc">{productsCopy.sortPriceAsc}</option>
                  <option value="price_desc">{productsCopy.sortPriceDesc}</option>
                  <option value="popular">{productsCopy.sortPopular}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-gray-500" />
                <input
                  type="number"
                  placeholder={productsCopy.priceFrom}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min={0}
                  step={100}
                  className="w-24 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-gray-900"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="number"
                  placeholder={productsCopy.priceTo}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min={0}
                  step={100}
                  className="w-24 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-gray-900"
                />
                <span className="text-gray-600 text-sm">֏</span>
              </div>
            </div>
          </div>

          {/* Category Filter - Mobile 2 rows, Desktop single row */}
          <div>
            {/* Mobile - 2 rows */}
            <div className="lg:hidden">
              <div className="space-y-3">
                {/* Առաջին շարք - Բոլորը, Պիդե, Կոմբո - 3 մեծ կոճակ */}
                <div className="grid grid-cols-3 gap-3">
                  {[allCategories, 'Պիդե', 'Կոմբո'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-4 rounded-2xl font-bold transition-all duration-300 text-base ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                      }`}
                      style={selectedCategory === category ? {
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      } : {}}
                    >
                      {category === allCategories
                        ? allCategories
                        : getCategoryDisplayName(category, locale)}
                    </button>
                  ))}
                </div>
                
                {/* Երկրորդ շարք - մնացած կատեգորիաներ */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories
                    .filter(cat => !['Պիդե', 'Կոմբո'].includes(cat.name))
                    .map((category) => (
                    <button
                      key={`mobile-${category.id}`}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 text-sm ${
                        selectedCategory === category.name
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                      }`}
                      style={selectedCategory === category.name ? {
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      } : {}}
                    >
                      {getCategoryDisplayName(category.name, locale)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Desktop - single row */}
            <div className="hidden lg:flex flex-wrap gap-4">
              {/* «Բոլորը» կոճակ */}
              <button
                onClick={() => setSelectedCategory(allCategories)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                  selectedCategory === allCategories
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                }`}
                style={selectedCategory === allCategories ? {
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                } : {}}
              >
                {allCategories}
              </button>
              
              {/* Դինամիկ կատեգորիաներ */}
              {categories.map((category) => (
                <button
                  key={`desktop-${category.id}`}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                  }`}
                  style={selectedCategory === category.name ? {
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  } : {}}
                >
                  {getCategoryDisplayName(category.name, locale)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Display */}
        {selectedCategory === allCategories && !debouncedSearchQuery ? (
          // Ցուցադրել ապրանքները խմբավորված ըստ կատեգորիաների
          <div className="space-y-16 mt-24">
            {groupedProducts.map(({ category, products: categoryProducts }) => (
              <div
                key={category}
                id={getMenuCategorySectionId(category)}
                className="scroll-mt-28 lg:scroll-mt-32"
              >
                {/* Կատեգորիայի վերնագիր */}
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mr-4">
                    {getCategoryDisplayName(category, locale)}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                </div>
                
                {/* Կատեգորիայի ապրանքներ */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16 md:gap-12 overflow-visible">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      variant="compact"
                      addedToCart={addedToCart}
                      isInWishlist={isInWishlist(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Ցուցադրել ապրանքները ստանդարտ ցանցում (կոնկրետ կատեգորիայի կամ որոնման համար)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16 md:gap-12 overflow-visible mt-24">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                variant="compact"
                addedToCart={addedToCart}
                isInWishlist={isInWishlist(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            {debouncedSearchQuery ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {productsCopy.searchNoResultsTitle(debouncedSearchQuery)}
                </h3>
                <p className="text-gray-600 mb-6">
                  {productsCopy.searchNoResultsHint}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                  >
                    {productsCopy.clearSearch}
                  </button>
                  <button
                    onClick={() => setSelectedCategory(allCategories)}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    {productsCopy.showAllProducts}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg">{productsCopy.categoryEmpty(selectedCategory)}</p>
                <p className="text-gray-400">{productsCopy.tryAnotherCategory}</p>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Footer - Hidden on mobile and tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
      
      {/* Add bottom padding for mobile and tablet nav */}
      <div className="lg:hidden h-16"></div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded mx-auto mb-4 w-64 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-12 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <Footer />
        </div>
        <div className="lg:hidden h-16"></div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  )
}
