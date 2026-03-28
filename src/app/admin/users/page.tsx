'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, RefreshCw, Users, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminUser {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
  deletedAt: string | null
  _count: { orders: number }
}

interface UsersResponse {
  users: AdminUser[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') router.push('/login')
  }, [session, status, router])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
      })
      const res = await fetch(`/api/admin/users?${params}`)
      if (!res.ok) throw new Error('Failed')
      const data: UsersResponse = await res.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const toggleActive = async (userId: string) => {
    setTogglingId(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' }),
      })
      if (!res.ok) return
      const data = await res.json()
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, deletedAt: data.isActive ? null : new Date().toISOString() } : u
        )
      )
    } finally {
      setTogglingId(null)
    }
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === users.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(users.map(u => u.id)))
    }
  }

  const exportCSV = () => {
    const rows = [
      ['Անուն', 'Email', 'Հեռախոս', 'Դեր', 'Պատվերներ', 'Կարգավիճակ', 'Ստեղծված'],
      ...users.map(u => [
        u.name || '',
        u.email,
        u.phone || '',
        u.role === 'ADMIN' ? 'admin' : 'customer',
        u._count.orders.toString(),
        u.deletedAt ? 'Անակտիվ' : 'Ակտիվ',
        new Date(u.createdAt).toLocaleDateString('hy-AM'),
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportExcel = () => {
    const rows = [
      ['Անուն', 'Email', 'Հեռախոս', 'Դեր', 'Պատվերներ', 'Կարգավիճակ', 'Ստեղծված'],
      ...users.map(u => [
        u.name || '',
        u.email,
        u.phone || '',
        u.role === 'ADMIN' ? 'admin' : 'customer',
        u._count.orders,
        u.deletedAt ? 'Անակտիվ' : 'Ակտիվ',
        new Date(u.createdAt).toLocaleDateString('hy-AM'),
      ]),
    ]
    const xml = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Օգտատերեր">
  <Table>
   ${rows.map(r => `<Row>${r.map(c => `<Cell><Data ss:Type="${typeof c === 'number' ? 'Number' : 'String'}">${c}</Data></Cell>`).join('')}</Row>`).join('')}
  </Table>
 </Worksheet>
</Workbook>`
    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.xls'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') return null

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Օգտատերեր</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {pagination.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCSV} className="text-sm border-cyan-400 text-cyan-600 hover:bg-cyan-50">
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportExcel} className="text-sm border-cyan-400 text-cyan-600 hover:bg-cyan-50">
            Export Excel
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            placeholder="Որոնում՝ անուն, email, հեռախոս..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.size === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left">Օգտատեր</th>
                <th className="px-4 py-3 text-left">Կոնտակտ</th>
                <th className="px-4 py-3 text-center">Պատվերներ</th>
                <th className="px-4 py-3 text-center">Դերեր</th>
                <th className="px-4 py-3 text-center">Կարգավիճակ</th>
                <th className="px-4 py-3 text-center">Ստեղծված</th>
                <th className="px-4 py-3 text-center">
                  <Mail className="h-4 w-4 inline" /> Վերականգնում
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <Users className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                    Օգտատերեր չեն գտնվել
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  const isActive = !user.deletedAt
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      {/* Name + ID */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{user.name || '—'}</div>
                        <div className="text-xs text-gray-400 mt-0.5 font-mono">{user.id}</div>
                      </td>
                      {/* Contact */}
                      <td className="px-4 py-3">
                        <div className="text-gray-700">{user.email}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{user.phone || '—'}</div>
                      </td>
                      {/* Orders count */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-gray-700 font-medium">{user._count.orders}</span>
                      </td>
                      {/* Role */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {user.role === 'ADMIN' ? 'admin' : 'customer'}
                        </span>
                      </td>
                      {/* Toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleActive(user.id)}
                          disabled={togglingId === user.id}
                          aria-label={isActive ? 'Անակտիվ դարձնել' : 'Ակտիվ դարձնել'}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                            isActive ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      {/* Created */}
                      <td className="px-4 py-3 text-center text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'numeric',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      {/* Reset password */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Ուղարկե՞լ գաղտնաբառի վերականգնման հղում ${user.email}-ին`)) {
                              fetch('/api/auth/forgot-password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: user.email }),
                              })
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400 text-cyan-600 text-xs font-medium hover:bg-cyan-50 transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Վերականգնում
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Հետ
            </Button>
            <span className="text-sm text-gray-500">
              {currentPage} / {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
              disabled={currentPage === pagination.pages}
            >
              Առաջ
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
