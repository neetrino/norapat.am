'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem, OrderStatus, PaymentStatus, User } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Calendar,
  User as UserIcon,
  Phone,
  CreditCard,
  Package,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Truck,
  CheckSquare,
  ShoppingCart,
  Download,
} from 'lucide-react'

interface OrderWithDetails extends Order {
  user: User
  items: (OrderItem & {
    product: {
      id: string
      name: string
      price: number
      image: string
    }
  })[]
  totalAmount: number
}

interface OrdersResponse {
  orders: OrderWithDetails[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const statusBackgroundColors = {
  PENDING: 'bg-yellow-100',
  CONFIRMED: 'bg-blue-100',
  PREPARING: 'bg-orange-100',
  READY: 'bg-green-100',
  DELIVERED: 'bg-emerald-100',
  CANCELLED: 'bg-red-100'
}

const statusBorderColors = {
  PENDING: 'border-yellow-300',
  CONFIRMED: 'border-blue-300',
  PREPARING: 'border-orange-300',
  READY: 'border-green-300',
  DELIVERED: 'border-emerald-300',
  CANCELLED: 'border-red-300'
}

const _statusLabels = {
  PENDING: 'Սպասում',
  CONFIRMED: 'Հաստատված',
  PREPARING: 'Պատրաստվում',
  READY: 'Պատրաստ',
  DELIVERED: 'Առաքված',
  CANCELLED: 'Չեղարկված'
}

const paymentStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
}

const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Սպասվում է',
  PAID: 'Վճարված',
  FAILED: 'Ձախողված',
}

const ORDER_STATUSES_LIST: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'DELIVERED',
  'CANCELLED',
]

const statusFilterActiveClass: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-500 hover:bg-yellow-600',
  CONFIRMED: 'bg-blue-500 hover:bg-blue-600',
  PREPARING: 'bg-orange-500 hover:bg-orange-600',
  READY: 'bg-green-500 hover:bg-green-600',
  DELIVERED: 'bg-emerald-500 hover:bg-emerald-600',
  CANCELLED: 'bg-red-500 hover:bg-red-600',
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [, setPaymentStatusChecking] = useState<Set<string>>(new Set())
  const ordersRef = useRef<OrderWithDetails[]>([])
  const checkPaymentStatusRef = useRef<(id: string) => Promise<void>>(async () => { /* placeholder */ })

  // Ստուգել մուտքի իրավունքները
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/login')
      return
    }
  }, [session, status, router])

  // Բեռնել պատվերները
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (orderStatusFilter !== 'all') {
        params.append('status', orderStatusFilter)
      }

      const response = await fetch(`/api/admin/orders?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data: OrdersResponse = await response.json()
      setOrders(data.orders)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, orderStatusFilter])

  // Բացել պատվերի մանրամասնությամբ մոդալ պատուհան
  const openOrderDetails = (order: OrderWithDetails) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  // Փակել մոդալ պատուհանը
  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Sync refs for stable polling closure
  useEffect(() => { ordersRef.current = orders }, [orders])
  useEffect(() => { checkPaymentStatusRef.current = checkPaymentStatus })

  // Ավտոմատ polling — ստուգել PENDING ոչ-կանխիկ պատվերների վճարման կարգավիճակը
  useEffect(() => {
    const timer = setInterval(() => {
      const pending = ordersRef.current.filter(o => o.paymentMethod !== 'cash' && o.paymentStatus === 'PENDING')
      pending.forEach(o => void checkPaymentStatusRef.current(o.id))
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  // Փոխել պատվերի կարգավիճակը
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      // Թարմացնել լոկալ state-ը
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )

      // Թարմացնել ընտրված պատվերը մոդալ պատուհանում
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus }),
      })
      if (!res.ok) return
      const data = await res.json() as { paymentStatus: PaymentStatus }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: data.paymentStatus } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, paymentStatus: data.paymentStatus } : null)
      }
    } catch (e) {
      console.error('Error updating payment status:', e)
    }
  }

  const checkPaymentStatus = async (orderId: string) => {
    setPaymentStatusChecking(prev => new Set(prev).add(orderId))
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoCheck: true }),
      })
      const data = await res.json() as { paymentStatus?: PaymentStatus; error?: string }
      if (!res.ok) {
        alert(data.error ?? 'Ստուգումը ձախողվեց')
        return
      }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: data.paymentStatus ?? null } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, paymentStatus: data.paymentStatus ?? null } : null)
      }
    } catch (e) {
      console.error('Error checking payment status:', e)
    } finally {
      setPaymentStatusChecking(prev => { const s = new Set(prev); s.delete(orderId); return s })
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)))
    }
  }

  const bulkUpdateStatus = async (newStatus: OrderStatus) => {
    await Promise.all(
      Array.from(selectedIds).map(id => updateOrderStatus(id, newStatus))
    )
    setSelectedIds(new Set())
  }

  const exportOrdersCsv = () => {
    const rows = [
      [
        'ID',
        'Հաճախորդ',
        'Email',
        'Հեռախոս',
        'Գումար (֏)',
        'Ապրանքներ',
        'Կարգավիճակ',
        'Ամսաթիվ',
        'Հասցե',
      ],
      ...filteredOrders.map(order => [
        order.id,
        order.user?.name || order.name || '',
        order.user?.email || '',
        order.user?.phone || order.phone || '',
        String(order.totalAmount),
        String(order.items.length),
        _statusLabels[order.status as OrderStatus] ?? order.status,
        new Date(order.createdAt).toLocaleString('hy-AM'),
        order.deliveryAddress || '',
      ]),
    ]
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'patverner.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Ստանալ կարգավիճակի պատկերը
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />
      case 'PREPARING': return <Package className="h-4 w-4" />
      case 'READY': return <CheckSquare className="h-4 w-4" />
      case 'DELIVERED': return <Truck className="h-4 w-4" />
      case 'CANCELLED': return <X className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  useEffect(() => {
    setSelectedIds(new Set())
  }, [currentPage, orderStatusFilter, searchTerm])

  // Զտել պատվերները որոնման հարցման համաձայն
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      (order.user?.name?.toLowerCase().includes(searchLower)) ||
      (order.user?.email?.toLowerCase().includes(searchLower)) ||
      (order.user?.phone?.toLowerCase().includes(searchLower)) ||
      order.name.toLowerCase().includes(searchLower) ||
      order.phone.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower)
    )
  })

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  const allFilteredSelected =
    filteredOrders.length > 0 && selectedIds.size === filteredOrders.length

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-7 w-7 text-orange-500 shrink-0" />
          <h1 className="text-2xl font-bold text-gray-900">Պատվերներ</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {pagination.total}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void fetchOrders()}
            className="text-sm border-gray-200"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Թարմացնել
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={exportOrdersCsv}
            className="text-sm border-cyan-400 text-cyan-600 hover:bg-cyan-50"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 space-y-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Ֆիլտրել ըստ
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={orderStatusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setOrderStatusFilter('all')
                setCurrentPage(1)
              }}
              className={orderStatusFilter === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              Բոլորը
            </Button>
            {ORDER_STATUSES_LIST.map(s => (
              <Button
                key={s}
                type="button"
                variant={orderStatusFilter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setOrderStatusFilter(s)
                  setCurrentPage(1)
                }}
                className={orderStatusFilter === s ? statusFilterActiveClass[s] : ''}
              >
                {_statusLabels[s]}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative max-w-md md:max-w-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Որոնում՝ անուն, email, հեռախոս, ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {selectedIds.size > 0 && (
          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2 bg-orange-50/50">
            <span className="text-sm text-gray-600">Ընտրված՝ {selectedIds.size}</span>
            <button
              type="button"
              onClick={() => bulkUpdateStatus('CONFIRMED')}
              className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Հաստատել
            </button>
            <button
              type="button"
              onClick={() => bulkUpdateStatus('PREPARING')}
              className="inline-flex items-center px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Package className="h-3.5 w-3.5 mr-1" />
              Պատրաստվում
            </button>
            <button
              type="button"
              onClick={() => bulkUpdateStatus('READY')}
              className="inline-flex items-center px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Package className="h-3.5 w-3.5 mr-1" />
              Պատրաստ
            </button>
            <button
              type="button"
              onClick={() => bulkUpdateStatus('DELIVERED')}
              className="inline-flex items-center px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Truck className="h-3.5 w-3.5 mr-1" />
              Առաքված
            </button>
            <button
              type="button"
              onClick={() => bulkUpdateStatus('CANCELLED')}
              className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Մերժել
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                    aria-label="Ընտրել բոլորը"
                  />
                </th>
                <th className="px-4 py-3 text-left">Պատվեր</th>
                <th className="px-4 py-3 text-left">Հաճախորդ</th>
                <th className="px-4 py-3 text-right">Գումար</th>
                <th className="px-4 py-3 text-center">Ապրանքներ</th>
                <th className="px-4 py-3 text-center">Ամսաթիվ</th>
                <th className="px-4 py-3 text-left min-w-[9rem]">Կարգավիճակ</th>
                <th className="px-4 py-3 text-center min-w-[8rem]">Վճարում</th>
                <th className="px-4 py-3 text-center">Գործողություն</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400">
                    <ShoppingCart className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                    Պատվերներ չեն գտնվել
                    <p className="text-xs mt-2 text-gray-400 font-normal normal-case">
                      {searchTerm || orderStatusFilter !== 'all'
                        ? 'Փորձեք փոխել ֆիլտրերը'
                        : 'Դեռ պատվերներ չկան'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 transition-colors ${selectedIds.has(order.id) ? 'bg-orange-50/60' : ''}`}
                  >
                    <td className="px-4 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-gray-300"
                        aria-label={`Ընտրել պատվեր ${order.id.slice(-8)}`}
                      />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="font-semibold text-gray-900">#{order.id.slice(-8)}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono truncate max-w-[10rem] md:max-w-xs">
                        {order.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="text-gray-900 font-medium">
                        {order.user?.name || order.name || 'Հյուր'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {order.user?.email || '—'}
                      </div>
                      {(order.user?.phone || order.phone) && (
                        <div className="text-xs text-gray-400 mt-0.5">{order.user?.phone || order.phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                      <span className="font-semibold text-orange-600">
                        {order.totalAmount.toLocaleString()} ֏
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center align-middle text-gray-700 font-medium">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-3 text-center align-middle text-gray-500 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('hy-AM', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <span className="block text-gray-400 mt-0.5 normal-case">
                        {new Date(order.createdAt).toLocaleTimeString('hy-AM', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        aria-label={_statusLabels[order.status as OrderStatus]}
                        className={`w-full max-w-[11rem] text-xs font-medium rounded-lg border-0 py-2 pl-2 pr-7 cursor-pointer appearance-none ${statusColors[order.status]}`}
                      >
                        <option value="PENDING">{_statusLabels.PENDING}</option>
                        <option value="CONFIRMED">{_statusLabels.CONFIRMED}</option>
                        <option value="PREPARING">{_statusLabels.PREPARING}</option>
                        <option value="READY">{_statusLabels.READY}</option>
                        <option value="DELIVERED">{_statusLabels.DELIVERED}</option>
                        <option value="CANCELLED">{_statusLabels.CANCELLED}</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-1">
                        <select
                          value={order.paymentStatus ?? ''}
                          onChange={e => { if (e.target.value) void updatePaymentStatus(order.id, e.target.value) }}
                          className={`text-xs font-medium rounded-lg border-0 py-2 pl-2 pr-7 cursor-pointer appearance-none ${order.paymentStatus ? paymentStatusColors[order.paymentStatus] : 'bg-gray-100 text-gray-500'}`}
                        >
                          <option value="" disabled>—</option>
                          <option value="PENDING">{paymentStatusLabels.PENDING}</option>
                          <option value="PAID">{paymentStatusLabels.PAID}</option>
                          <option value="FAILED">{paymentStatusLabels.FAILED}</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <Button
                        type="button"
                        onClick={() => openOrderDetails(order)}
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center gap-1 text-xs border-gray-200"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Մանրամասներ
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            <Button
              type="button"
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
              type="button"
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

        {/* Պատվերի մանրամասնությամբ մոդալ պատուհան */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900">
                  Պատվեր #{selectedOrder.id.slice(-8)}
                </h2>
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Փակել
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Կարգավիճակ և հիմնական ինֆո */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`${statusBackgroundColors[selectedOrder.status]} ${statusBorderColors[selectedOrder.status]} border rounded-2xl p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="font-medium text-gray-900">Կարգավիճակ</span>
                    </div>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                      aria-label={_statusLabels[selectedOrder.status as OrderStatus]}
                      className={`w-full px-3 py-2 bg-white border-2 ${statusBorderColors[selectedOrder.status]} rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 font-medium`}
                    >
                      <option value="PENDING">⏳ Սպասում</option>
                      <option value="CONFIRMED">✅ Հաստատված</option>
                      <option value="PREPARING">👨‍🍳 Պատրաստվում</option>
                      <option value="READY">📦 Պատրաստ</option>
                      <option value="DELIVERED">🚚 Առաքված</option>
                      <option value="CANCELLED">❌ Չեղարկված</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-900">Պատվերի ժամանակ</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleString('hy-AM')}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-900">Գումար</span>
                    </div>
                    <div className="text-lg font-semibold text-orange-600">
                      {selectedOrder.totalAmount.toLocaleString()} ֏
                    </div>
                    <div className="text-sm font-medium text-gray-700">{selectedOrder.paymentMethod}</div>
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500">Վճարման կարգավիճակ</p>
                      <select
                        value={selectedOrder.paymentStatus ?? ''}
                        onChange={e => { if (e.target.value) void updatePaymentStatus(selectedOrder.id, e.target.value) }}
                        className={`w-full text-sm font-medium rounded-xl border px-3 py-2 cursor-pointer ${selectedOrder.paymentStatus ? paymentStatusColors[selectedOrder.paymentStatus] : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                      >
                        <option value="" disabled>—</option>
                        <option value="PENDING">{paymentStatusLabels.PENDING}</option>
                        <option value="PAID">{paymentStatusLabels.PAID}</option>
                        <option value="FAILED">{paymentStatusLabels.FAILED}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Հաճախորդի և առաքման ինֆո */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-orange-500" />
                    Հաճախորդի և առաքման ինֆո
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Անուն</p>
                      <p className="font-medium text-gray-900">{selectedOrder.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Էլ. փոստ</p>
                      <p className="font-medium text-gray-900">{selectedOrder.user.email}</p>
                    </div>
                    {selectedOrder.user.phone && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Հեռախոս</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedOrder.user.phone}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Առաքման հասցե</p>
                      <p className="font-medium text-gray-900">{selectedOrder.deliveryAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Առաքման ժամանակ</p>
                      <p className="font-medium text-gray-900">{selectedOrder.deliveryTime}</p>
                    </div>
                  </div>
                </div>

                {/* Ապրանքներ պատվերում */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-500" />
                    Ապրանքներ պատվերում
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          {item.product.image && item.product.image !== 'no-image' ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={48}
                              height={48}
                              unoptimized
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                              <span className="text-lg">🥟</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm text-gray-900">{item.product.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600">
                                {item.product.price.toLocaleString()} ֏
                              </span>
                              <span className="text-gray-400">×</span>
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                                {item.quantity} հատ
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-gray-900">
                            {(item.product.price * item.quantity).toLocaleString()} ֏
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × {item.product.price.toLocaleString()} ֏
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
