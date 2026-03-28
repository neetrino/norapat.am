'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Filter, Package, Percent, Search } from 'lucide-react'
import type { Product, CategoryWithCount } from '@/types'

type DiscountMode = 'PERCENT' | 'FIXED' | 'CLEAR'
type ApplyScope = 'FILTERED' | 'SELECTED'
type AvailabilityFilter = 'ALL' | 'AVAILABLE' | 'UNAVAILABLE'
type DiscountFilter = 'ALL' | 'DISCOUNTED' | 'WITHOUT_DISCOUNT'

type AdminProduct = Product & {
  category?: {
    id: string
    name: string
    isActive: boolean
  } | null
}

function getBasePrice(product: AdminProduct) {
  return product.originalPrice ?? product.price
}

function getDiscountPercent(product: AdminProduct) {
  const basePrice = getBasePrice(product)

  if (!product.originalPrice || basePrice <= 0 || product.price >= basePrice) {
    return null
  }

  return Math.round(((basePrice - product.price) / basePrice) * 100)
}

export default function AdminDiscountsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('ALL')
  const [discountFilter, setDiscountFilter] = useState<DiscountFilter>('ALL')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [mode, setMode] = useState<DiscountMode>('PERCENT')
  const [amount, setAmount] = useState('10')
  const [applyScope, setApplyScope] = useState<ApplyScope>('FILTERED')
  const [resultMessage, setResultMessage] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    void loadData()
  }, [session, status, router])

  const loadData = async () => {
    try {
      setLoading(true)

      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories?includeInactive=true'),
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(Array.isArray(productsData) ? productsData : [])
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      }
    } catch (error) {
      console.error('Failed to load discounts page data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch) ||
      (product.shortDescription ?? '').toLowerCase().includes(normalizedSearch)

    const matchesCategory =
      selectedCategory === 'ALL' || product.category?.id === selectedCategory

    const matchesAvailability =
      availabilityFilter === 'ALL' ||
      (availabilityFilter === 'AVAILABLE' && product.isAvailable) ||
      (availabilityFilter === 'UNAVAILABLE' && !product.isAvailable)

    const hasDiscount = product.originalPrice != null && product.originalPrice > product.price
    const matchesDiscount =
      discountFilter === 'ALL' ||
      (discountFilter === 'DISCOUNTED' && hasDiscount) ||
      (discountFilter === 'WITHOUT_DISCOUNT' && !hasDiscount)

    return matchesSearch && matchesCategory && matchesAvailability && matchesDiscount
  })

  const filteredIds = filteredProducts.map((product) => product.id)
  const selectedSet = new Set(selectedIds)
  const selectedCountInFilter = filteredIds.filter((id) => selectedSet.has(id)).length
  const targetIds = applyScope === 'FILTERED' ? filteredIds : selectedIds
  const discountedCount = filteredProducts.filter(
    (product) => product.originalPrice != null && product.originalPrice > product.price
  ).length

  const toggleProduct = (productId: string) => {
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    )
  }

  const toggleFilteredSelection = () => {
    const allFilteredSelected =
      filteredIds.length > 0 && filteredIds.every((id) => selectedSet.has(id))

    if (allFilteredSelected) {
      setSelectedIds((current) => current.filter((id) => !filteredIds.includes(id)))
      return
    }

    setSelectedIds((current) => [...new Set([...current, ...filteredIds])])
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  const handleApply = async () => {
    setResultMessage('')

    if (targetIds.length === 0) {
      setResultMessage('Ընտրեք գոնե մեկ ապրանք կամ օգտագործեք ֆիլտրերը։')
      return
    }

    if (mode !== 'CLEAR') {
      const numericAmount = Number(amount)

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        setResultMessage('Զեղչի արժեքը պետք է լինի դրական թիվ։')
        return
      }
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/admin/products/bulk-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: targetIds,
          mode,
          amount: mode === 'CLEAR' ? null : Number(amount),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResultMessage(data.error || 'Չհաջողվեց թարմացնել զեղչերը։')
        return
      }

      setResultMessage(
        data.updatedCount > 0
          ? `Թարմացվեց ${data.updatedCount} ապրանք։`
          : 'Փոփոխելու բան չկար։'
      )
      setSelectedIds([])
      await loadData()
    } catch (error) {
      console.error('Failed to apply bulk discounts:', error)
      setResultMessage('Սերվերի սխալ առաջացավ bulk update-ի ժամանակ։')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') return null

  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedSet.has(id))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="flex items-center text-gray-600 hover:text-orange-500">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Վահանակ
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Զեղչեր</h1>
            <p className="text-sm text-gray-500 mt-1">
              Մասայական զեղչեր ըստ category-ի, availability-ի կամ ընտրված ապրանքների
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6">
          <div className="space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Ֆիլտրեր</h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Որոնել ապրանք..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="ALL">Բոլոր կատեգորիաները</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category._count.products})
                    </option>
                  ))}
                </select>

                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="ALL">Բոլոր availability-ները</option>
                  <option value="AVAILABLE">Միայն ակտիվ</option>
                  <option value="UNAVAILABLE">Միայն անջատված</option>
                </select>

                <select
                  value={discountFilter}
                  onChange={(e) => setDiscountFilter(e.target.value as DiscountFilter)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="ALL">Բոլոր ապրանքները</option>
                  <option value="DISCOUNTED">Միայն զեղչված</option>
                  <option value="WITHOUT_DISCOUNT">Միայն առանց զեղչի</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-sm text-gray-600">Ֆիլտրով գտնված</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm text-gray-600">Զեղչված</p>
                  <p className="text-2xl font-bold text-gray-900">{discountedCount}</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Percent className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Մասայական գործողություն</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Գործողություն
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as DiscountMode)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    <option value="PERCENT">Դնել տոկոսային զեղչ</option>
                    <option value="FIXED">Դնել ֆիքսված գումարով զեղչ</option>
                    <option value="CLEAR">Հանել զեղչը</option>
                  </select>
                </div>

                {mode !== 'CLEAR' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {mode === 'PERCENT' ? 'Տոկոս (%)' : 'Գումար (֏)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={mode === 'PERCENT' ? '99' : undefined}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Կիրառել ում վրա
                  </label>
                  <select
                    value={applyScope}
                    onChange={(e) => setApplyScope(e.target.value as ApplyScope)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    <option value="FILTERED">Բոլոր ֆիլտրած ապրանքների վրա</option>
                    <option value="SELECTED">Միայն ընտրված ապրանքների վրա</option>
                  </select>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                  Թիրախավորվելու է <span className="font-semibold text-gray-900">{targetIds.length}</span> ապրանք
                  {applyScope === 'SELECTED' ? ' (ձեռքով ընտրված)' : ' (ֆիլտրերի հիման վրա)'}։
                </div>

                {resultMessage && (
                  <div className="rounded-2xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-800">
                    {resultMessage}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium px-4 py-3 rounded-xl transition-colors"
                >
                  {submitting ? 'Կիրառվում է...' : mode === 'CLEAR' ? 'Հանել զեղչը' : 'Կիրառել զեղչը'}
                </button>
              </div>
            </section>
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ապրանքներ</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ընտրված է {selectedCountInFilter} / {filteredProducts.length} ֆիլտրած ապրանք
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleFilteredSelection}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50"
                >
                  {allFilteredSelected ? 'Հանել ֆիլտրած ընտրությունը' : 'Ընտրել բոլոր ֆիլտրածները'}
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50"
                >
                  Մաքրել ընտրությունը
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ընտրել</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ապրանք</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Կատեգորիա</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Գին</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Զեղչ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const discountPercent = getDiscountPercent(product)
                    const isSelected = selectedSet.has(product.id)

                    return (
                      <tr key={product.id} className={isSelected ? 'bg-orange-50/60' : 'bg-white'}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProduct(product.id)}
                            className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                              <Package className="h-5 w-5 text-orange-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.shortDescription || product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {product.category?.name || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-semibold">{product.price.toLocaleString()} ֏</div>
                          {product.originalPrice != null && (
                            <div className="text-xs text-gray-400 line-through">
                              {product.originalPrice.toLocaleString()} ֏
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {discountPercent != null ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700 font-medium">
                              -{discountPercent}%
                            </span>
                          ) : (
                            <span className="text-gray-400">Չկա</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 font-medium ${
                              product.isAvailable
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {product.isAvailable ? 'Ակտիվ' : 'Անջատված'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-16 text-center">
                <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Այս ֆիլտրերով ապրանք չգտնվեց</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
