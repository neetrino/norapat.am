'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Tag } from 'lucide-react'

interface PromoCode {
  id: string
  code: string
  discountPercent: number | null
  discountAmount: number | null
  minOrderAmount: number | null
  maxUses: number | null
  usedCount: number
  validFrom: string
  validUntil: string | null
  isActive: boolean
  createdAt: string
}

export default function AdminPromoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [list, setList] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<PromoCode | null>(null)
  const [form, setForm] = useState({
    code: '',
    discountPercent: '' as string | number,
    discountAmount: '' as string | number,
    minOrderAmount: '' as string | number,
    maxUses: '' as string | number,
    isActive: true
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchList()
  }, [session, status, router])

  const fetchList = async () => {
    try {
      const res = await fetch('/api/admin/promo')
      if (res.ok) setList(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          discountPercent: form.discountPercent === '' ? null : Number(form.discountPercent),
          discountAmount: form.discountAmount === '' ? null : Number(form.discountAmount),
          minOrderAmount: form.minOrderAmount === '' ? null : Number(form.minOrderAmount),
          maxUses: form.maxUses === '' ? null : Number(form.maxUses),
          isActive: form.isActive
        })
      })
      if (res.ok) {
        await fetchList()
        setCreating(false)
        setForm({ code: '', discountPercent: '', discountAmount: '', minOrderAmount: '', maxUses: '', isActive: true })
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
      const res = await fetch(`/api/admin/promo/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          discountPercent: form.discountPercent === '' ? null : Number(form.discountPercent),
          discountAmount: form.discountAmount === '' ? null : Number(form.discountAmount),
          minOrderAmount: form.minOrderAmount === '' ? null : Number(form.minOrderAmount),
          maxUses: form.maxUses === '' ? null : Number(form.maxUses),
          isActive: form.isActive
        })
      })
      if (res.ok) {
        await fetchList()
        setEditing(null)
        setForm({ code: '', discountPercent: '', discountAmount: '', minOrderAmount: '', maxUses: '', isActive: true })
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
    if (!confirm('Ջնջե՞լ պրոմո կոդը')) return
    try {
      const res = await fetch(`/api/admin/promo/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchList()
      else alert('Ջնջումը ձախողվեց')
    } catch (e) {
      console.error(e)
    }
  }

  const openEdit = (p: PromoCode) => {
    setEditing(p)
    setForm({
      code: p.code,
      discountPercent: p.discountPercent ?? '',
      discountAmount: p.discountAmount ?? '',
      minOrderAmount: p.minOrderAmount ?? '',
      maxUses: p.maxUses ?? '',
      isActive: p.isActive
    })
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="flex items-center text-gray-600 hover:text-orange-500">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Վահանակ
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Պրոմո կոդեր</h1>
        </div>

        {!creating && !editing && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mb-6 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600"
          >
            <Plus className="h-5 w-5" />
            Ավելացնել
          </button>
        )}

        {(creating || editing) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Խմբագրել' : 'Նոր պրոմո կոդ'}</h2>
            <form onSubmit={editing ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Կոդ *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Զեղչ %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.discountPercent}
                    onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Զեղչ (֏)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.discountAmount}
                    onChange={(e) => setForm((f) => ({ ...f, discountAmount: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    placeholder="500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Նվազ. պատվեր (֏)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.minOrderAmount}
                    onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Օգտ. առավելագույն</label>
                  <input
                    type="number"
                    min={0}
                    value={form.maxUses}
                    onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    placeholder="Անսահման"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                <span className="text-sm text-gray-700">Ակտիվ</span>
              </label>
              <div className="flex gap-2">
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600">
                  {editing ? 'Պահել' : 'Ավելացնել'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false)
                    setEditing(null)
                    setForm({ code: '', discountPercent: '', discountAmount: '', minOrderAmount: '', maxUses: '', isActive: true })
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Կոդ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Զեղչ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Օգտ.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Կարգավիճակ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{p.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.discountPercent != null ? `${p.discountPercent}%` : p.discountAmount != null ? `${p.discountAmount} ֏` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.usedCount}{p.maxUses != null ? ` / ${p.maxUses}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {p.isActive ? 'Ակտիվ' : 'Անջատված'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button type="button" onClick={() => openEdit(p)} className="text-orange-600 hover:text-orange-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Tag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              Պրոմո կոդեր դեռ չկան
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
