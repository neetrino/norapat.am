'use client'

import { useState, useEffect, useCallback, useRef, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, ArrowDownUp, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { Product, type CategoryWithCount } from '@/types'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { ProductsPageCategoryChips } from '@/components/ProductsPageCategoryChips'
import { ProductsPagePagination } from '@/components/ProductsPagePagination'
import { useI18n } from '@/i18n/I18nContext'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'
import { MENU_PRODUCTS_PAGE_SIZE } from '@/constants/menuPagination.constants'
import { parseProductsListResponse } from '@/lib/parseProductsListResponse'
import { dedupeCategoriesForNav, isSameCategoryNavSelection } from '@/lib/categoryNav.utils'

function ProductsPageContent() {
  const { t, locale } = useI18n()
  const productsCopy = t.products
  const searchCopy = t.search
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<string>('newest')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [menuPage, setMenuPage] = useState(1)
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const { isInWishlist, toggle: toggleWishlist } = useWishlist()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const productGridTopRef = useRef<HTMLDivElement>(null)

  const navCategories = useMemo(() => dedupeCategoriesForNav(categories), [categories])

  const activeCategoryLabel = useMemo(() => {
    if (!selectedCategoryName) return productsCopy.allCategories
    return getCategoryDisplayName(selectedCategoryName, locale)
  }, [selectedCategoryName, locale, productsCopy.allCategories])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategoryName) params.set('category', selectedCategoryName)
      if (debouncedSearchQuery) params.set('search', debouncedSearchQuery)
      params.set('sort', sortOrder)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      params.set('page', String(menuPage))
      params.set('limit', String(MENU_PRODUCTS_PAGE_SIZE))
      const response = await fetch(`/api/products?${params.toString()}`)
      const data: unknown = await response.json()
      const { items, total } = parseProductsListResponse(data)
      setFilteredProducts(items)
      setTotalProductCount(total)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategoryName, debouncedSearchQuery, sortOrder, minPrice, maxPrice, menuPage])

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/categories', { signal: controller.signal, cache: 'no-store' })
      .then((res) => { if (!res.ok) throw new Error('Failed'); return res.json() })
      .then((data: CategoryWithCount[]) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false))
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearchQuery(searchParam)
      setDebouncedSearchQuery(searchParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (searchQuery !== debouncedSearchQuery) setSearching(true)
    searchTimeoutRef.current = setTimeout(() => {
      setMenuPage(1)
      setDebouncedSearchQuery(searchQuery)
      setSearching(false)
    }, 300)
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current) }
  }, [searchQuery, debouncedSearchQuery])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    if (menuPage <= 1) return
    productGridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [menuPage])

  const totalPages = totalProductCount > 0 ? Math.ceil(totalProductCount / MENU_PRODUCTS_PAGE_SIZE) : 0

  useEffect(() => {
    if (totalPages === 0) { if (menuPage !== 1) setMenuPage(1); return }
    if (menuPage > totalPages) setMenuPage(totalPages)
  }, [totalPages, menuPage])

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1)
    setAddedToCart((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedToCart((prev) => { const s = new Set(prev); s.delete(product.id); return s })
    }, 2000)
  }, [addItem])

  const selectCategory = useCallback((name: string | null) => {
    setMenuPage(1)
    setSelectedCategoryName(name)
  }, [])

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
        <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />
        <div className="max-w-7xl mx-auto lg:flex">
          <div className="hidden lg:block w-56 xl:w-64 shrink-0 border-r border-gray-100 py-6 px-3 space-y-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-11 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
          <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8 space-y-4">
            <div className="h-11 bg-gray-100 rounded-2xl animate-pulse w-full" />
            <div className="h-6 bg-gray-100 rounded animate-pulse w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                  <div className="w-32 h-28 bg-gray-200 shrink-0" />
                  <div className="flex-1 p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-200 rounded-full mt-2 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />

      <div className="max-w-7xl mx-auto lg:flex">

        {/* ── Left Sidebar (desktop only) ── */}
        <aside
          className="hidden lg:block w-56 xl:w-64 shrink-0 border-r border-gray-100 bg-white"
          style={{
            position: 'sticky',
            top: 'calc(6rem + var(--top-bar-offset, 0px))',
            alignSelf: 'flex-start',
            height: 'calc(100vh - 6rem - var(--top-bar-offset, 0px))',
            overflowY: 'auto',
          }}
        >
          <nav className="py-5 px-3 space-y-0.5">
            {/* All */}
            <button
              type="button"
              onClick={() => selectCategory(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                selectedCategoryName === null
                  ? 'bg-[#FFE8E6] text-[#E53225] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="w-6 h-6 flex items-center justify-center shrink-0 text-[15px]">🍽️</span>
              <span className="truncate">{productsCopy.allCategories}</span>
            </button>

            {categoriesLoading
              ? [1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="h-11 rounded-xl bg-gray-100 animate-pulse mx-1" />
                ))
              : navCategories.map((cat) => {
                  const active =
                    selectedCategoryName != null &&
                    isSameCategoryNavSelection(selectedCategoryName, cat.name)
                  const label = getCategoryDisplayName(cat.name, locale)
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectCategory(cat.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-[#FFE8E6] text-[#E53225] font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {cat.image ? (
                        <div className="relative w-6 h-6 shrink-0">
                          <Image src={cat.image} alt="" fill sizes="24px" className="object-cover rounded-md" />
                        </div>
                      ) : (
                        <span className="w-6 h-6 flex items-center justify-center shrink-0 text-[15px] opacity-50">🍽️</span>
                      )}
                      <span className="truncate">{label}</span>
                    </button>
                  )
                })}
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-8">

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${searching ? 'text-[#E53225] animate-pulse' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder={searchCopy.productsPage}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53225]/30 focus:border-[#E53225] text-sm text-gray-900 placeholder-gray-400 bg-gray-50 transition-all hover:bg-white focus:bg-white"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E53225]" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <ArrowDownUp className="h-4 w-4 text-gray-400 shrink-0" />
                <select
                  value={sortOrder}
                  onChange={(e) => { setMenuPage(1); setSortOrder(e.target.value) }}
                  className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53225]/30 bg-white text-gray-800 text-sm"
                >
                  <option value="newest">{productsCopy.sortNewest}</option>
                  <option value="price_asc">{productsCopy.sortPriceAsc}</option>
                  <option value="price_desc">{productsCopy.sortPriceDesc}</option>
                  <option value="popular">{productsCopy.sortPopular}</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="number"
                  placeholder={productsCopy.priceFrom}
                  value={minPrice}
                  onChange={(e) => { setMenuPage(1); setMinPrice(e.target.value) }}
                  min={0} step={100}
                  className="w-20 px-2.5 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E53225]/30"
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="number"
                  placeholder={productsCopy.priceTo}
                  value={maxPrice}
                  onChange={(e) => { setMenuPage(1); setMaxPrice(e.target.value) }}
                  min={0} step={100}
                  className="w-20 px-2.5 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E53225]/30"
                />
                <span className="text-gray-500 text-sm">֏</span>
              </div>
            </div>
          </div>

          {/* Mobile category chips */}
          <div className="lg:hidden mb-5">
            <ProductsPageCategoryChips
              categories={categories}
              loading={categoriesLoading}
              selectedCategoryName={selectedCategoryName}
              onSelectCategory={selectCategory}
              allLabel={productsCopy.allCategories}
              locale={locale}
            />
          </div>

          {/* Active category heading */}
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {activeCategoryLabel}
          </h2>

          <div ref={productGridTopRef} className="scroll-mt-28" aria-hidden />

          {/* Product grid — 2 columns, horizontal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                variant="horizontal"
                addedToCart={addedToCart}
                isInWishlist={isInWishlist(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <ProductsPagePagination
              currentPage={menuPage}
              totalPages={totalPages}
              onPageChange={setMenuPage}
              prevLabel={productsCopy.paginationPrev}
              nextLabel={productsCopy.paginationNext}
              navAriaLabel={productsCopy.paginationAria(menuPage, totalPages)}
              pageNumberAriaLabel={productsCopy.paginationGoToPage}
            />
          )}

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🍽️</div>
              {debouncedSearchQuery ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {productsCopy.searchNoResultsTitle(debouncedSearchQuery)}
                  </h3>
                  <p className="text-gray-500 mb-6">{productsCopy.searchNoResultsHint}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => { setMenuPage(1); setSearchQuery(''); setDebouncedSearchQuery('') }}
                      className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                      {productsCopy.clearSearch}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMenuPage(1); setSelectedCategoryName(null); setSearchQuery(''); setDebouncedSearchQuery('') }}
                      className="bg-[#E53225] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#a51d1d] transition-colors text-sm"
                    >
                      {productsCopy.showAllProducts}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {selectedCategoryName ? (
                    <>
                      <p className="text-gray-500 text-base max-w-md mx-auto">
                        {productsCopy.categoryEmpty(getCategoryDisplayName(selectedCategoryName, locale))}
                      </p>
                      <p className="text-gray-400 mt-2 text-sm">{productsCopy.tryAnotherCategory}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-base max-w-md mx-auto">{productsCopy.catalogEmpty}</p>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      <div className="hidden lg:block"><Footer /></div>
      <div className="lg:hidden h-16" />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto lg:flex">
            <div className="hidden lg:block w-56 xl:w-64 shrink-0 border-r border-gray-100 py-6 px-3 space-y-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-11 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
            <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                    <div className="w-32 h-28 bg-gray-200 shrink-0" />
                    <div className="flex-1 p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-8 bg-gray-200 rounded-full mt-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  )
}
