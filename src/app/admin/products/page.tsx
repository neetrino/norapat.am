'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Search,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  Star,
  ChevronsUpDown,
  Copy,
} from 'lucide-react'
import { Product, ProductStatus } from '@/types'

type SortField = 'name' | 'price' | 'updatedAt'
type SortDir = 'asc' | 'desc'

const SPECIAL_STATUSES: ProductStatus[] = ['HIT', 'NEW', 'CLASSIC', 'BANNER']

const STATUS_LABELS: Record<ProductStatus, string> = {
  REGULAR: 'Սովորական',
  HIT: 'Հիթ',
  NEW: 'Նոր',
  CLASSIC: 'Կլասիկ',
  BANNER: 'Բաններ',
}

const STATUS_COLORS: Record<ProductStatus, string> = {
  REGULAR: 'bg-gray-100 text-gray-600',
  HIT:     'bg-orange-100 text-orange-700',
  NEW:     'bg-emerald-100 text-emerald-700',
  CLASSIC: 'bg-blue-100 text-blue-700',
  BANNER:  'bg-purple-100 text-purple-700',
}

export default function AdminProducts() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  // productsRef — latest products snapshot for debounce callbacks
  const productsRef = useRef<Product[]>([])
  // toggleDebounce — per-product: pending timer + server-side value for rollback
  const toggleDebounceRef = useRef<Map<string, { timer: ReturnType<typeof setTimeout>; serverValue: boolean }>>(new Map())

  // Keep ref in sync so debounce callbacks always read the latest state
  useEffect(() => { productsRef.current = products }, [products])

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchProducts()
  }, [session, status, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս ապրանքը:')) return
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId))
        setSelectedIds(prev => { const next = new Set(prev); next.delete(productId); return next })
      } else {
        alert('Սխալ ապրանքը ջնջելիս')
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Սխալ ապրանքը ջնջելիս')
    }
  }

  const handleToggleAvailable = useCallback((productId: string) => {
    // 1. Flip UI immediately — every click responds at once
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p)
    )

    const existing = toggleDebounceRef.current.get(productId)

    // serverValue = the value actually saved on the server before pending flips
    const serverValue = existing?.serverValue
      ?? (productsRef.current.find(p => p.id === productId)?.isAvailable ?? true)

    // Cancel the previous scheduled API call (user hasn't stopped clicking yet)
    if (existing) clearTimeout(existing.timer)

    // Schedule a single API call 250ms after the LAST click
    const timer = setTimeout(() => {
      toggleDebounceRef.current.delete(productId)

      const latest = productsRef.current.find(p => p.id === productId)
      if (!latest) return

      fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: latest.isAvailable }),
      })
        .then(res => {
          if (!res.ok) throw new Error('patch failed')
        })
        .catch(() => {
          // API failed → revert to last known server value
          setProducts(prev =>
            prev.map(p => p.id === productId ? { ...p, isAvailable: serverValue } : p)
          )
        })
    }, 250)

    toggleDebounceRef.current.set(productId, { timer, serverValue })
  }, [])

  const handleDuplicate = async (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${product.name} (պատճեն)`,
          shortDescription: product.shortDescription,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          images: product.images,
          categoryId: product.categoryId,
          ingredients: product.ingredients,
          status: product.status,
          isAvailable: false,
        }),
      })

      if (res.ok) {
        const newProduct = await res.json()
        setProducts(prev => [newProduct, ...prev])
      } else {
        alert('Սխալ ապրանքը պատճենելիս')
      }
    } catch (err) {
      console.error('Error duplicating product:', err)
      alert('Սխալ ապրանքը պատճենելիս')
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const exportCSV = () => {
    const rows = [
      ['Ապրանք', 'Գին (AMD)', 'Կատեգորիա', 'Կարգավիճակ', 'Առկայություն', 'Թարմացված'],
      ...filteredProducts.map(p => [
        p.name,
        String(p.price),
        p.category?.name ?? '',
        STATUS_LABELS[p.status],
        p.isAvailable ? 'Առկա' : 'Առկա չէ',
        new Date(p.updatedAt).toLocaleDateString('hy-AM'),
      ])
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ապրանքներ.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))] as string[]

  const filteredProducts = products
    .filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchCat = !selectedCategory || p.category?.name === selectedCategory
      const matchStatus =
        !selectedStatus ||
        selectedStatus === 'all' ||
        (selectedStatus === 'special' && SPECIAL_STATUSES.includes(p.status)) ||
        (selectedStatus === 'discounted' && p.originalPrice != null && p.originalPrice > p.price)
      return matchSearch && matchCat && matchStatus
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortField === 'name')  cmp = a.name.localeCompare(b.name)
      if (sortField === 'price') cmp = a.price - b.price
      if (sortField === 'updatedAt') cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
    return sortDir === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 text-orange-500 shrink-0" />
      : <ChevronDown className="h-3.5 w-3.5 text-orange-500 shrink-0" />
  }

  const allSelected = filteredProducts.length > 0 && selectedIds.size === filteredProducts.length
  const someSelected = selectedIds.size > 0 && !allSelected

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Բեռնվում է...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ապրանքներ</h1>
            <p className="text-sm text-gray-500 mt-0.5">Ապրանքների կառավարում</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-200"
          >
            <Plus className="h-4 w-4" />
            Ավելացնել ապրանք
          </Link>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Որոնում անվանմամբ..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white appearance-none transition"
              >
                <option value="">Բոլոր կատեգորիաները</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>


            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white appearance-none transition"
              >
                <option value="">????? ??????????????</option>
                <option value="special">?????? (??? / ??? / ?????? / ??????)</option>
                <option value="discounted">???????</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Table toolbar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <span className="text-sm text-gray-600">
              Ընդամենը ապրանքներ:{' '}
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
              {selectedIds.size > 0 && (
                <span className="ml-2 text-orange-600 font-medium">
                  ({selectedIds.size} ընտրված)
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 border border-orange-300 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Արտահանել CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  {/* Checkbox */}
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={el => {
                        if (el) {
                          el.indeterminate = someSelected
                        }
                      }}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                    />
                  </th>

                  {/* Product */}
                  <th
                    onClick={() => handleSort('name')}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      Ապրանք <SortIcon field="name" />
                    </span>
                  </th>

                  {/* Price */}
                  <th
                    onClick={() => handleSort('price')}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      Գին <SortIcon field="price" />
                    </span>
                  </th>

                  {/* Category */}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Կատեգորիա
                  </th>

                  {/* Status */}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Կարգավիճակ
                  </th>

                  {/* Updated */}
                  <th
                    onClick={() => handleSort('updatedAt')}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      Թարմացված <SortIcon field="updatedAt" />
                    </span>
                  </th>

                  {/* Actions */}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Գործողություններ
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => (
                  <tr
                    key={product.id}
                    className={`group transition-colors hover:bg-orange-50/40 ${
                      selectedIds.has(product.id) ? 'bg-orange-50/60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                      />
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-orange-50 flex items-center justify-center shrink-0 border border-gray-100">
                          {product.image && product.image !== 'no-image' ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-orange-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {product.name}
                          </p>
                          {product.shortDescription && (
                            <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">
                              {product.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">֏</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                        <p className="text-xs text-gray-400 line-through mt-0.5">
                          {product.originalPrice.toLocaleString()} ֏
                        </p>
                        <span className="mt-1 inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                        </>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {product.category?.name ?? <span className="text-gray-400 italic">—</span>}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Star
                          className={`h-4 w-4 shrink-0 ${
                            SPECIAL_STATUSES.includes(product.status)
                              ? 'fill-orange-400 text-orange-400'
                              : 'text-gray-300'
                          }`}
                        />
                        {product.status !== 'REGULAR' && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[product.status]}`}>
                            {STATUS_LABELS[product.status]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Updated */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(product.updatedAt).toLocaleDateString('hy-AM', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleToggleAvailable(product.id)}
                          title={product.isAvailable ? 'Ապաակտիվացնել' : 'Ակտիվացնել'}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400 cursor-pointer ${
                            product.isAvailable
                              ? 'bg-orange-500'
                              : 'bg-gray-200'
                          }`}
                          style={{ transition: 'background-color 120ms ease' }}
                        >
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm"
                            style={{
                              transform: product.isAvailable ? 'translateX(18px)' : 'translateX(2px)',
                              transition: 'transform 120ms ease',
                            }}
                          />
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          title="Խմբագրել"
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          title="Պատճենել"
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          title="Ջնջել"
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                <Package className="h-7 w-7 text-orange-300" />
              </div>
              <p className="text-gray-500 text-sm">Ապրանքներ չեն գտնվել</p>
              <p className="text-gray-400 text-xs mt-1">Փորձեք փոխել որոնման չափանիշները</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

