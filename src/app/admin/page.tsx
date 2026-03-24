'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  Settings,
  Tag
} from 'lucide-react'
interface ProductStat { productId: string; name: string; totalQuantity: number }
interface CustomerStat { userId: string; name: string | null; totalSpend: number; orderCount: number }

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  averageOrderValue: number
  pendingOrders: number
  completedOrders: number
  ordersByStatus?: Record<string, number>
  ordersToday: number
  ordersThisWeek: number
  ordersThisMonth: number
  top5BestSelling: ProductStat[]
  leastSelling: ProductStat[]
  newCustomersCount: number
  repeatOrdersCount: number
  topCustomersBySpend: CustomerStat[]
}

const defaultStats: Stats = {
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  pendingOrders: 0,
  completedOrders: 0,
  ordersToday: 0,
  ordersThisWeek: 0,
  ordersThisMonth: 0,
  top5BestSelling: [],
  leastSelling: [],
  newCustomersCount: 0,
  repeatOrdersCount: 0,
  topCustomersBySpend: []
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    // Загружаем статистику
    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
        if (response.ok) {
        const data = await response.json()
        setStats({ ...defaultStats, ...data })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Կառավարման վահանակ</h1>
          <p className="text-gray-600">Ապրանքների, պատվերների և օգտատերերի կառավարում</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ապրանքներ</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Заказы</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Пользователи</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Выручка</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue} ֏</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Средний чек</p>
                <p className="text-3xl font-bold text-gray-900">{Math.round(stats.averageOrderValue)} ֏</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics: orders by period */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-sm font-medium text-gray-600">Заказы сегодня</p>
            <p className="text-2xl font-bold text-gray-900">{stats.ordersToday}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-sm font-medium text-gray-600">За неделю</p>
            <p className="text-2xl font-bold text-gray-900">{stats.ordersThisWeek}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-sm font-medium text-gray-600">За месяц</p>
            <p className="text-2xl font-bold text-gray-900">{stats.ordersThisMonth}</p>
          </div>
        </div>

        {/* Analytics: products & customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Топ-5 товаров</h2>
            {stats.top5BestSelling.length === 0 ? (
              <p className="text-gray-500 text-sm">Нет данных</p>
            ) : (
              <ul className="space-y-2">
                {stats.top5BestSelling.map((p, i) => (
                  <li key={p.productId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{i + 1}. {p.name}</span>
                    <span className="font-medium text-gray-900">{p.totalQuantity} шт.</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Меньше всего продано</h2>
            {stats.leastSelling.length === 0 ? (
              <p className="text-gray-500 text-sm">Нет данных</p>
            ) : (
              <ul className="space-y-2">
                {stats.leastSelling.map((p) => (
                  <li key={p.productId} className="flex justify-between text-sm">
                    <span className="text-gray-700 truncate">{p.name}</span>
                    <span className="font-medium text-gray-900">{p.totalQuantity} шт.</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Клиенты</h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Новые за 30 дней</span>
                <span className="font-semibold text-gray-900">{stats.newCustomersCount}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Повторные заказы (клиентов)</span>
                <span className="font-semibold text-gray-900">{stats.repeatOrdersCount}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Топ клиенты по сумме</h2>
            {stats.topCustomersBySpend.length === 0 ? (
              <p className="text-gray-500 text-sm">Нет данных</p>
            ) : (
              <ul className="space-y-2">
                {stats.topCustomersBySpend.map((c) => (
                  <li key={c.userId} className="flex justify-between text-sm">
                    <span className="text-gray-700 truncate">{c.name ?? c.userId}</span>
                    <span className="font-medium text-gray-900">{c.totalSpend} ֏ ({c.orderCount})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Быстрые действия</h2>
            <div className="space-y-4">
              <Link 
                href="/admin/products" 
                className="flex items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <Package className="h-6 w-6 text-orange-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Управление товарами</h3>
                  <p className="text-sm text-gray-600">Добавить, изменить или удалить товары</p>
                </div>
              </Link>
              
              <Link 
                href="/admin/orders" 
                className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-blue-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Управление заказами</h3>
                  <p className="text-sm text-gray-600">Просмотр и изменение статусов заказов</p>
                </div>
              </Link>
              
              <Link 
                href="/admin/categories" 
                className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <Tag className="h-6 w-6 text-green-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Управление категориями</h3>
                  <p className="text-sm text-gray-600">Добавлять, редактировать и удалять категории</p>
                </div>
              </Link>

              <Link 
                href="/admin/promo" 
                className="flex items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <Tag className="h-6 w-6 text-amber-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Промо коды</h3>
                  <p className="text-sm text-gray-600">Создание и управление скидочными кодами</p>
                </div>
              </Link>
              
              <Link 
                href="/admin/settings" 
                className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <Settings className="h-6 w-6 text-purple-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Настройки сайта</h3>
                  <p className="text-sm text-gray-600">Управление логотипом и настройками</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Статус заказов</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="font-medium text-gray-900">Ожидают подтверждения</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="font-medium text-gray-900">Завершены</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.completedOrders}</span>
              </div>
            </div>
          </div>
        </div>

    </div>
  )
}
