'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Megaphone } from 'lucide-react'
import type { Campaign } from '@/types'
import type { CategoryWithCount } from '@/types'
import type { Product } from '@/types'

const LINK_TYPES = [
  { value: 'NONE', label: 'Առանց հղումի' },
  { value: 'PRODUCT', label: 'Ապրանք' },
  { value: 'CATEGORY', label: 'Կատեգորիա' },
  { value: 'URL', label: 'Կամայական URL' },
] as const

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('hy-AM', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function AdminCampaignsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [list, setList] = useState<Campaign[]>([])
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    linkType: 'NONE' as 'NONE' | 'PRODUCT' | 'CATEGORY' | 'URL',
    linkValue: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    isActive: true,
    sortOrder: 0,
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchList()
    fetchCategories()
    fetchProducts()
  }, [session, status, router])

  const fetchList = async () => {
    try {
      const res = await fetch('/api/admin/campaigns')
      if (res.ok) setList(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : [] as CategoryWithCount[])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          linkValue: form.linkType === 'NONE' ? null : form.linkValue || null,
        }),
      })
      if (res.ok) {
        await fetchList()
        setCreating(false)
        resetForm()
      } else {
        const err = await res.json()
        alert(err.error || 'Սխալ')
      }
    } catch (e) {
      console.error(e)
      alert('Սխալ')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    try {
      const res = await fetch(`/api/admin/campaigns/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          linkValue: form.linkType === 'NONE' ? null : form.linkValue || null,
        }),
      })
      if (res.ok) {
        await fetchList()
        setEditing(null)
        resetForm()
      } else {
        const err = await res.json()
        alert(err.error || 'Սխալ')
      }
    } catch (e) {
      console.error(e)
      alert('Սխալ')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ջնջե՞լ ակցիան')) return
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchList()
      else alert('Ջնջումը ձախողվեց')
    } catch (e) {
      console.error(e)
    }
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      image: '',
      linkType: 'NONE',
      linkValue: '',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      isActive: true,
      sortOrder: 0,
    })
  }

  const openEdit = (c: Campaign) => {
    setEditing(c)
    setForm({
      title: c.title,
      description: c.description || '',
      image: c.image,
      linkType: c.linkType,
      linkValue: c.linkValue || '',
      startDate: new Date(c.startDate).toISOString().slice(0, 16),
      endDate: new Date(c.endDate).toISOString().slice(0, 16),
      isActive: c.isActive,
      sortOrder: c.sortOrder,
    })
  }

  const getLinkLabel = (c: Campaign) => {
    if (c.linkType === 'NONE' || !c.linkValue) return '—'
    if (c.linkType === 'PRODUCT') {
      const p = products.find((x) => x.id === c.linkValue)
      return p ? p.name : c.linkValue
    }
    if (c.linkType === 'CATEGORY') return c.linkValue
    if (c.linkType === 'URL') return c.linkValue.slice(0, 30) + '…'
    return c.linkValue
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!session || session.user?.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden h-16" />
      <div className="hidden lg:block h-24" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="flex items-center text-gray-600 hover:text-orange-500">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Ադմին
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Ակցիաներ</h1>
        </div>

        {!creating && !editing && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mb-6 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600"
          >
            <Plus className="h-5 w-5" />
            Ավելացնել ակցիա
          </button>
        )}

        {(creating || editing) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? 'Խմբագրել' : 'Նոր ակցիա'}
            </h2>
            <form
              onSubmit={editing ? handleUpdate : handleCreate}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Անվանում *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Նկարագրություն
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Նկար URL *
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="https://..."
                  required
                />
                {form.image && (
                  <div className="mt-2 rounded-lg overflow-hidden max-w-xs">
                    <img
                      src={form.image}
                      alt=""
                      className="w-full h-24 object-cover"
                      onError={() => {}}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Հղման տեսակ
                  </label>
                  <select
                    value={form.linkType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        linkType: e.target.value as Campaign['linkType'],
                        linkValue: '',
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  >
                    {LINK_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                {form.linkType !== 'NONE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {form.linkType === 'PRODUCT'
                        ? 'Ապրանք'
                        : form.linkType === 'CATEGORY'
                          ? 'Կատեգորիա'
                          : 'URL'}
                    </label>
                    {form.linkType === 'PRODUCT' ? (
                      <select
                        value={form.linkValue}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, linkValue: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                      >
                        <option value="">Ընտրել...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    ) : form.linkType === 'CATEGORY' ? (
                      <select
                        value={form.linkValue}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, linkValue: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                      >
                        <option value="">Ընտրել...</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="url"
                        value={form.linkValue}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, linkValue: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        placeholder="https://..."
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Սկիզբ
                  </label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startDate: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ավարտ
                  </label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endDate: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isActive: e.target.checked }))
                    }
                  />
                  <span className="text-sm text-gray-700">Ակտիվ</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Կարգի համար</label>
                  <input
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sortOrder: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600"
                >
                  {editing ? 'Պահել' : 'Ավելացնել'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false)
                    setEditing(null)
                    resetForm()
                  }}
                  className="border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50"
                >
                  Չեղարկել
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ակցիա
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Հղում
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ժամկետ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Կարգավիճակ
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={c.image}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{c.title}</div>
                        {c.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {c.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {getLinkLabel(c)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(c.startDate)} – {formatDate(c.endDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {c.isActive ? 'Ակտիվ' : 'Անջատված'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Megaphone className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Ակցիաներ դեռ չեն ավելացվել</p>
              <p className="text-sm mt-1">
                Ավելացրեք ժամանակավոր ակցիաներ, բաննեռներ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
