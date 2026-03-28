'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BadgePercent,
  Search,
  X,
  ChevronDown,
  Tag,
  Package,
} from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number | null
  image: string | null
  category: { id: string; name: string } | null
}

type ApplyMode = 'category' | 'products'
type DiscountType = 'PERCENT' | 'FIXED'

function pct(original: number, current: number) {
  return Math.round(((original - current) / original) * 100)
}

export default function AdminDiscountsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Apply form
  const [mode, setMode] = useState<ApplyMode>('category')
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENT')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [discountValue, setDiscountValue] = useState('')
  const [search, setSearch] = useState('')
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set())

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/discounts')
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories)
        setAllProducts(data.allProducts)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchData()
  }, [session, status, router, fetchData])

  const discountedProducts = useMemo(
    () => allProducts.filter((p) => p.originalPrice != null),
    [allProducts]
  )

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase()
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category?.name.toLowerCase().includes(q) ?? false)
    )
  }, [allProducts, search])

  function showSuccess(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  async function applyDiscount(productIds: string[], clearMode = false) {
    if (!clearMode && !discountValue) return
    const amount = Number(discountValue)
    if (!clearMode && discountType === 'PERCENT' && (amount <= 0 || amount >= 100)) {
      alert('Տոկոսը պետք է լինի 1–99')
      return
    }
    if (!clearMode && discountType === 'FIXED' && amount <= 0) {
      alert('Գումարը պետք է լինի 0-ից մեծ')
      return
    }
    setApplying(true)
    try {
      const res = await fetch('/api/admin/products/bulk-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds,
          mode: clearMode ? 'CLEAR' : discountType,
          amount: clearMode ? null : amount,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        await fetchData()
        setSelectedProductIds(new Set())
        if (!clearMode) setDiscountValue('')
        showSuccess(
          clearMode
            ? `Հեռացված ${data.updatedCount} ապրանքի զեղչ`
            : `Կիրառված ${data.updatedCount} ապրանքի`
        )
      } else {
        const err = await res.json()
        alert(err.error || 'Սխալ')
      }
    } catch (e) {
      console.error(e)
      alert('Սխալ')
    } finally {
      setApplying(false)
    }
  }

  async function handleApplyByCategory() {
    if (!selectedCategory) { alert('Ընտրեք կատեգորիա'); return }
    const ids = allProducts
      .filter((p) => p.category?.id === selectedCategory)
      .map((p) => p.id)
    if (ids.length === 0) { alert('Կատեգորիայում ապրանք չկա'); return }
    await applyDiscount(ids)
  }

  async function handleApplyByProducts() {
    if (selectedProductIds.size === 0) { alert('Ընտրեք ապրանք'); return }
    await applyDiscount([...selectedProductIds])
  }

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!session || session.user?.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="flex items-center text-gray-500 hover:text-orange-500 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Վահանակ
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Զեղչեր</h1>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-medium">
            <BadgePercent className="h-4 w-4" />
            {successMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">Ընդհանուր ապրանք</p>
            <p className="text-2xl font-bold text-gray-900">{allProducts.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">Զեղչված ապրանք</p>
            <p className="text-2xl font-bold text-orange-500">{discountedProducts.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Կատեգորիա</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Apply discount panel ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Կիրառել զեղչ</h2>

            {/* Mode tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              <button
                type="button"
                onClick={() => setMode('category')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'category'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ըստ կատեգորիայի
              </button>
              <button
                type="button"
                onClick={() => { setMode('products'); setSelectedProductIds(new Set()) }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'products'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ըստ ապրանքի
              </button>
            </div>

            {/* Discount input + type toggle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Զեղչի չափ</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={1}
                    max={discountType === 'PERCENT' ? 99 : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'PERCENT' ? 'օր.՝ 20' : 'օր.՝ 500'}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  />
                </div>
                <div className="flex bg-gray-100 rounded-xl p-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { setDiscountType('PERCENT'); setDiscountValue('') }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      discountType === 'PERCENT'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDiscountType('FIXED'); setDiscountValue('') }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      discountType === 'FIXED'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    ֏
                  </button>
                </div>
              </div>
            </div>

            {/* Category mode */}
            {mode === 'category' && (
              <>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Կատեգորիա</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm appearance-none bg-white"
                    >
                      <option value="">— Ընտրեք —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={applying || !selectedCategory || !discountValue}
                  onClick={handleApplyByCategory}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  {applying ? 'Կիրառվում է...' : 'Կիրառել կատեգորիային'}
                </button>
              </>
            )}

            {/* Products mode */}
            {mode === 'products' && (
              <>
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Փնտրել ապրանք..."
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                    {search && (
                      <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden mb-4 max-h-56 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-6">Ոչինչ չի գտնվել</p>
                  ) : (
                    filteredProducts.map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                          selectedProductIds.has(p.id) ? 'bg-orange-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProductIds.has(p.id)}
                          onChange={() => toggleProduct(p.id)}
                          className="accent-orange-500"
                        />
                        <span className="text-sm text-gray-800 flex-1 truncate">{p.name}</span>
                        <span className="text-xs text-gray-400">{p.price.toLocaleString()} ֏</span>
                      </label>
                    ))
                  )}
                </div>
                {selectedProductIds.size > 0 && (
                  <p className="text-xs text-orange-600 mb-3 font-medium">
                    Ընտրված՝ {selectedProductIds.size} ապրանք
                  </p>
                )}
                <button
                  type="button"
                  disabled={applying || selectedProductIds.size === 0 || !discountValue}
                  onClick={handleApplyByProducts}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  {applying ? 'Կիրառվում է...' : `Կիրառել ընտրվածներին`}
                </button>
              </>
            )}
          </div>

          {/* ── Active discounts panel ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Ակտիվ զեղչեր</h2>
              {discountedProducts.length > 0 && (
                <button
                  type="button"
                  disabled={applying}
                  onClick={() => {
                    if (confirm('Հե՞ռացնել բոլոր զեղչերը')) {
                      applyDiscount(discountedProducts.map((p) => p.id), true)
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Հեռացնել բոլորը
                </button>
              )}
            </div>

            {discountedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Tag className="h-10 w-10 mb-2 text-gray-200" />
                <p className="text-sm">Ակտիվ զեղչ չկա</p>
              </div>
            ) : (
              <div className="space-y-0 max-h-[420px] overflow-y-auto -mx-2 px-2">
                {discountedProducts.map((p) => {
                  const orig = p.originalPrice!
                  const discount = pct(orig, p.price)
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                    >
                      {/* Icon placeholder */}
                      <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <Package className="h-4 w-4 text-orange-300" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">
                          <span className="line-through">{orig.toLocaleString()}</span>
                          {' → '}
                          <span className="text-orange-600 font-medium">{p.price.toLocaleString()} ֏</span>
                        </p>
                      </div>

                      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                        -{discount}%
                      </span>

                      <button
                        type="button"
                        disabled={applying}
                        onClick={() => applyDiscount([p.id], true)}
                        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                        title="Հեռացնել զեղչը"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
