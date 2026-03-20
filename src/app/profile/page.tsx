'use client'

import { useSession, getSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ArrowLeft,
  Edit,
  Trash2,
  LogOut,
  RotateCcw,
  Heart
} from 'lucide-react'
import Footer from '@/components/Footer'
import EditProfileModal from '@/components/EditProfileModal'
import DeleteAccountModal from '@/components/DeleteAccountModal'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import type { Product } from '@/types'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items: Array<{
    productId: string
    product: {
      id: string
      name: string
      image: string
    }
    quantity: number
    price: number
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addItem: addToCart } = useCart()
  const { products: wishlistProducts, remove: removeFromWishlist, loading: wishlistLoading } = useWishlist()
  const [orders, setOrders] = useState<Order[]>([])
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: session?.user?.name || null,
    email: session?.user?.email || null,
    phone: null as string | null,
    address: null as string | null
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    fetchOrders()
    fetchUserProfile()
  }, [session, status, router])

  useEffect(() => {
    if (session?.user) {
      setUserProfile(prev => ({
        ...prev,
        name: session.user?.name || null,
        email: session.user?.email || null
      }))
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(prev => ({
          ...prev,
          name: data.name,
          phone: data.phone,
          address: data.address
        }))
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const handleSaveProfile = async (data: { name: string; phone: string; address: string }) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setUserProfile(prev => ({
          ...prev,
          name: updatedProfile.name,
          phone: updatedProfile.phone,
          address: updatedProfile.address
        }))
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Выходим из системы и перенаправляем на страницу подтверждения
        const { signOut } = await import('next-auth/react')
        
        // Выходим из системы с перенаправлением на страницу подтверждения
        await signOut({ callbackUrl: '/account-deleted' })
        
        // Принудительно обновляем сессию после выхода
        await getSession()
        
        // Перенаправляем на страницу подтверждения
        window.location.href = '/account-deleted'
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('❌ Error deleting account:', error)
      setIsDeletingAccount(false)
      throw error
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Ожидает подтверждения', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'CONFIRMED':
        return { text: 'Подтвержден', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'PREPARING':
        return { text: 'Готовится', color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'READY':
        return { text: 'Готов к выдаче', color: 'text-purple-600', bg: 'bg-purple-100' }
      case 'DELIVERED':
        return { text: 'Доставлен', color: 'text-green-600', bg: 'bg-green-100' }
      case 'CANCELLED':
        return { text: 'Отменен', color: 'text-red-600', bg: 'bg-red-100' }
      default:
        return { text: status, color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'CONFIRMED':
      case 'PREPARING':
      case 'READY':
        return <Package className="h-4 w-4" />
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleReorder = async (order: Order) => {
    if (order.items.length === 0) return
    setReorderingId(order.id)
    try {
      const ids = order.items.map((i) => i.productId).filter(Boolean)
      const res = await fetch(`/api/products?ids=${ids.join(',')}`)
      if (!res.ok) throw new Error('Failed to load products')
      const products: Product[] = await res.json()
      const qtyByProductId = Object.fromEntries(order.items.map((i) => [i.productId, i.quantity]))
      for (const product of products) {
        const qty = qtyByProductId[product.id] ?? 1
        addToCart(product, qty)
      }
      router.push('/cart')
    } catch (e) {
      console.error('Reorder failed:', e)
    } finally {
      setReorderingId(null)
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

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Отступ для fixed хедера */}
      <div className="lg:hidden h-16"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 pb-20 lg:pb-8">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Профиль</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
          
          {/* Mobile Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">{userProfile.name || 'Пользователь'}</h2>
                <p className="text-sm text-gray-600">{userProfile.email}</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{userProfile.phone || 'Не указан'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 truncate">{userProfile.address || 'Не указан'}</span>
              </div>
            </div>
            
            {/* Mobile Logout Button */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full text-gray-600 text-sm py-2 rounded-lg font-normal hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center space-x-1 border border-gray-200 hover:border-orange-200 mb-2"
            >
              <LogOut className="h-3 w-3" />
              <span>Выйти из аккаунта</span>
            </button>
            
            {/* Mobile Delete Account Button */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full text-gray-400 text-sm py-2 rounded-lg font-normal hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex items-center justify-center space-x-1 border border-gray-200 hover:border-red-200"
            >
              <Trash2 className="h-3 w-3" />
              <span>Удалить аккаунт</span>
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center space-x-4 mb-8">
          <Link 
            href="/"
            className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            На главную
          </Link>
          <div className="h-8 w-px bg-gray-300"></div>
          <h1 className="text-3xl font-bold text-gray-900">Мой профиль</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Profile Info - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Информация о профиле</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Имя</p>
                    <p className="font-medium text-gray-900">{userProfile.name || 'Не указано'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{userProfile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Телефон</p>
                    <p className="font-medium text-gray-900">{userProfile.phone || 'Не указан'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Адрес</p>
                    <p className="font-medium text-gray-900">{userProfile.address || 'Не указан'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Редактировать профиль
                </button>
                
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-gray-600 text-sm py-2 rounded-lg font-normal hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center space-x-1 border border-gray-200 hover:border-orange-200 mb-2"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Выйти из аккаунта</span>
                </button>
                
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full text-gray-400 text-sm py-2 rounded-lg font-normal hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex items-center justify-center space-x-1 border border-gray-200 hover:border-red-200"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Удалить аккаунт</span>
                </button>
              </div>
            </div>
          </div>

          {/* Wishlist & Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-500" />
                Նախընտրած ապրանքներ
              </h2>
              {wishlistLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : wishlistProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Դեռ ապրանքներ ավելացված չեն</p>
              ) : (
                <ul className="space-y-3">
                  {wishlistProducts.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                      <Link href={`/products/${p.id}`} className="flex-1 flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {p.image && p.image !== 'no-image' ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 m-3 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{p.name}</p>
                          <p className="text-sm text-gray-600">{p.price} ֏</p>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(p.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">История заказов</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>У вас пока нет заказов</p>
                  <Link 
                    href="/products"
                    className="inline-block mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Сделать заказ
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    return (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4">
                          <div className="mb-2 md:mb-0">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">Заказ #{order.id.slice(-8)}</h3>
                            <p className="text-xs md:text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center justify-between md:flex-col md:items-end">
                            <p className="text-base md:text-lg font-bold text-gray-900">{order.total} ֏</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{statusInfo.text}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 md:space-x-3">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {item.product?.image ? (
                                  <img 
                                    src={item.product.image} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm md:text-base truncate">{item.product?.name ?? '—'}</p>
                                <p className="text-xs md:text-sm text-gray-600">{item.quantity} шт. × {item.price} ֏</p>
                              </div>
                              <p className="font-semibold text-gray-900 text-sm md:text-base flex-shrink-0">{item.quantity * item.price} ֏</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            disabled={reorderingId === order.id}
                            className="flex items-center justify-center gap-2 w-full md:w-auto text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                            {reorderingId === order.id ? 'Загрузка...' : 'Повторить заказ'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hide Footer on Mobile and Tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={userProfile}
        onSave={handleSaveProfile}
      />
      
      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
      />
    </div>
  )
}
