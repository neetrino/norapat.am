'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem, User } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Eye, 
  RefreshCw, 
  ArrowLeft, 
  ChevronRight, 
  Calendar,
  User as UserIcon,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Truck,
  CheckSquare,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Plus,
  Download,
  Printer
} from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

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

const statusLabels = {
  PENDING: 'Սպասում',
  CONFIRMED: 'Հաստատված',
  PREPARING: 'Պատրաստվում',
  READY: 'Պատրաստ',
  DELIVERED: 'Առաքված',
  CANCELLED: 'Չեղարկված'
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [filterGroup, setFilterGroup] = useState<'all' | 'new' | 'in_progress' | 'delivered' | 'cancelled'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  // Ստուգել մուտքի իրավունքները
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/login')
      return
    }
  }, [session, status, router])

  // Բեռնել պատվերները
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (filterGroup !== 'all') {
        params.append('filter', filterGroup)
      } else if (statusFilter) {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/admin/orders?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data: OrdersResponse = await response.json()
      setOrders(data.orders)
      setPagination(data.pagination)
      
      // Հաշվել վիճակագրությունը
      const totalRevenue = data.orders.reduce((sum, order) => sum + order.totalAmount, 0)
      const pendingOrders = data.orders.filter(order => order.status === 'PENDING').length
      const completedOrders = data.orders.filter(order => order.status === 'DELIVERED').length
      
      setStats({
        totalOrders: data.pagination.total,
        pendingOrders,
        completedOrders,
        totalRevenue
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

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
  }, [currentPage, statusFilter, filterGroup])

  // Փոխել պատվերի կարգավիճակը
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
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
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
      )

      // Թարմացնել ընտրված պատվերը մոդալ պատուհանում
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Բեռնում պատվերներ...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Բացատ ֆիքսված header-ի համար */}
      <div className="lg:hidden h-16"></div>
      <div className="hidden lg:block h-24"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Վերադարձ
            </Link>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Պատվերների կառավարում</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              onClick={fetchOrders} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Թարմացնել
            </Button>
            <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ընդամենը պատվերներ</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Սպասում</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ավարտված</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Եկամուտ</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} ֏</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Quick filter chips - Նոր, Ընթացքում, Առաքված, Չեղարկված */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Filter className="inline h-4 w-4 mr-1" />
              Ֆիլտրել ըստ
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterGroup === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilterGroup('all'); setStatusFilter(''); setCurrentPage(1) }}
                className={filterGroup === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                Բոլորը
              </Button>
              <Button
                variant={filterGroup === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilterGroup('new'); setStatusFilter(''); setCurrentPage(1) }}
                className={filterGroup === 'new' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                Նոր
              </Button>
              <Button
                variant={filterGroup === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilterGroup('in_progress'); setStatusFilter(''); setCurrentPage(1) }}
                className={filterGroup === 'in_progress' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                Ընթացքում
              </Button>
              <Button
                variant={filterGroup === 'delivered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilterGroup('delivered'); setStatusFilter(''); setCurrentPage(1) }}
                className={filterGroup === 'delivered' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Առաքված
              </Button>
              <Button
                variant={filterGroup === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilterGroup('cancelled'); setStatusFilter(''); setCurrentPage(1) }}
                className={filterGroup === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                Չեղարկված
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center gap-1">
                  <Search className="inline h-4 w-4 shrink-0" aria-hidden />
                  <span className="underline underline-offset-2">Որոնում</span>
                </span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-500 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 font-medium"
                placeholder="Որոնում՝ անուն, email, հեռախոս կամ ID..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Կարգավիճակ (մանրամասն)
              </label>
              <select
                value={filterGroup !== 'all' ? '' : statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setFilterGroup('all'); setCurrentPage(1) }}
                className="w-full px-4 py-3 bg-white border-2 border-gray-500 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 font-medium"
              >
                <option value="">Բոլոր կարգավիճակները</option>
                <option value="PENDING">Սպասում</option>
                <option value="CONFIRMED">Հաստատված</option>
                <option value="PREPARING">Պատրաստվում</option>
                <option value="READY">Պատրաստ</option>
                <option value="DELIVERED">Առաքված</option>
                <option value="CANCELLED">Չեղարկված</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-300">
            <h2 className="text-xl font-semibold text-gray-900">
              Պատվերներ ({filteredOrders.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Պատվերներ չեն գտնվել</p>
                <p className="text-sm mt-2">
                  {searchTerm || statusFilter || filterGroup !== 'all'
                    ? 'Փորձեք փոխել որոնման ֆիլտրերը'
                    : 'Դեռ պատվերներ չկան'
                  }
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Պատվերի ինֆո - միայն հիմնական */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-orange-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Պատվեր #{order.id.slice(-8)}
                          </h3>
                        </div>
                        
                        {/* Միայն հիմնական ինֆո */}
                        <div className="flex items-center space-x-6 text-sm">
                          {/* Գումար */}
                          <div>
                            <span className="text-gray-500 text-xs">Գումար:</span>
                            <div className="text-lg font-bold text-orange-600">
                              {order.totalAmount.toLocaleString()} ֏
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500 text-xs">Ապրանքներ:</span>
                            <div className="text-base font-semibold text-gray-900">
                              {order.items.length} шт.
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500 text-xs">Ժամանակ:</span>
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString('hy-AM')} {new Date(order.createdAt).toLocaleTimeString('hy-AM', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500 text-xs">Հաճախորդ:</span>
                            <div className="text-sm font-medium text-gray-900">
                              {order.user?.name || order.name || 'Հյուր'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => openOrderDetails(order)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Մանրամասներ
                      </Button>
                      
                      {/* Կարգավիճակի ընտրություն */}
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-4 py-2 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors cursor-pointer appearance-none pr-10 ${statusColors[order.status]} font-medium`}
                        >
                          <option value="PENDING">⏳ Սպասում</option>
                          <option value="CONFIRMED">✅ Հաստատված</option>
                          <option value="PREPARING">👨‍🍳 Պատրաստվում</option>
                          <option value="READY">📦 Պատրաստ</option>
                          <option value="DELIVERED">🚚 Առաքված</option>
                          <option value="CANCELLED">❌ Չեղարկված</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Էջավորում */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Հետ
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Էջ {currentPage} {pagination.pages}-ից
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
              disabled={currentPage === pagination.pages}
              className="flex items-center gap-2"
            >
              Առաջ
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

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
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
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
                      <p className="text-sm text-gray-600 mb-1">Email</p>
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
                            <img
                              src={item.product.image}
                              alt={item.product.name}
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
                                {item.quantity} шт.
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
      
      {/* Hide Footer on Mobile and Tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}

