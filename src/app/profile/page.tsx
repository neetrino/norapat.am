'use client'

import { useSession, getSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Clock, Edit, Heart, LogOut, Mail, MapPin, Package, Phone, RotateCcw, Trash2, User, Wallet, XCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import EditProfileModal from '@/components/EditProfileModal'
import DeleteAccountModal from '@/components/DeleteAccountModal'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import type { Product } from '@/types'
import { useI18n } from '@/i18n/I18nContext'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items: Array<{
    productId: string
    product: { id: string; name: string; image: string }
    quantity: number
    price: number
  }>
}

const CURRENCY = '֏'

export default function ProfilePage() {
  const { t, locale } = useI18n()
  const { profilePage, orderStatus } = t
  const dateLocale = locale === 'hy' ? 'hy-AM' : locale === 'ru' ? 'ru-RU' : 'en-US'
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
  const [userProfile, setUserProfile] = useState({ name: session?.user?.name || null, email: session?.user?.email || null, phone: null as string | null, address: null as string | null })

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
    if (!session?.user) return
    setUserProfile((prev) => ({ ...prev, name: session.user?.name || null, email: session.user?.email || null }))
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) setOrders(await response.json())
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
        setUserProfile((prev) => ({ ...prev, name: data.name, phone: data.phone, address: data.address }))
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const handleSaveProfile = async (data: { name: string; phone: string; address: string }) => {
    try {
      const response = await fetch('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!response.ok) throw new Error('Failed to update profile')
      const updatedProfile = await response.json()
      setUserProfile((prev) => ({ ...prev, name: updatedProfile.name, phone: updatedProfile.phone, address: updatedProfile.address }))
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      const response = await fetch('/api/user/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }
      const { signOut } = await import('next-auth/react')
      await signOut({ callbackUrl: '/account-deleted' })
      await getSession()
      window.location.href = '/account-deleted'
    } catch (error) {
      console.error('Error deleting account:', error)
      setIsDeletingAccount(false)
      throw error
    }
  }

  const getStatusInfo = (statusValue: string) => {
    switch (statusValue) {
      case 'PENDING':
        return { text: orderStatus.PENDING, color: 'text-amber-700', bg: 'bg-amber-100' }
      case 'CONFIRMED':
        return { text: orderStatus.CONFIRMED, color: 'text-sky-700', bg: 'bg-sky-100' }
      case 'PREPARING':
        return { text: orderStatus.PREPARING, color: 'text-orange-700', bg: 'bg-orange-100' }
      case 'READY':
        return { text: orderStatus.READY, color: 'text-violet-700', bg: 'bg-violet-100' }
      case 'DELIVERED':
        return { text: orderStatus.DELIVERED, color: 'text-emerald-700', bg: 'bg-emerald-100' }
      case 'CANCELLED':
        return { text: orderStatus.CANCELLED, color: 'text-rose-700', bg: 'bg-rose-100' }
      default:
        return { text: statusValue, color: 'text-slate-700', bg: 'bg-slate-100' }
    }
  }

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
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
      const ids = order.items.map((item) => item.productId).filter(Boolean)
      const res = await fetch(`/api/products?ids=${ids.join(',')}`)
      if (!res.ok) throw new Error('Failed to load products')
      const products: Product[] = await res.json()
      const qtyByProductId = Object.fromEntries(order.items.map((item) => [item.productId, item.quantity]))
      for (const product of products) addToCart(product, qtyByProductId[product.id] ?? 1)
      router.push('/cart')
    } catch (error) {
      console.error('Reorder failed:', error)
    } finally {
      setReorderingId(null)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-gray-600">{profilePage.loading}</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const fullName = userProfile.name || profilePage.userDefault
  const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'
  const profileFields = [
    { label: profilePage.name, value: userProfile.name || profilePage.notSet, icon: User },
    { label: profilePage.email, value: userProfile.email || profilePage.notSet, icon: Mail },
    { label: profilePage.phone, value: userProfile.phone || profilePage.notSet, icon: Phone },
    { label: profilePage.address, value: userProfile.address || profilePage.notSet, icon: MapPin },
  ]
  const profileCompletion = Math.round((profileFields.filter((field) => field.value !== profilePage.notSet).length / profileFields.length) * 100)
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  const activeOrders = orders.filter((order) => !['DELIVERED', 'CANCELLED'].includes(order.status)).length
  const latestOrder = orders[0]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#fff_100%)]">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="hidden h-header-spacer-desktop lg:block" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10 lg:pt-10">
        <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-orange-500">
              <ArrowLeft className="h-4 w-4" />
              <span className="lg:hidden">{profilePage.back}</span>
              <span className="hidden lg:inline">{profilePage.backHome}</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{profilePage.titleDesktop}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Պրոֆիլի տվյալներն ու պատվերների պատմությունը հավաքված են մեկ պարզ ու հավասարակշռված էջում։</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md">
              <Edit className="h-4 w-4" />
              {profilePage.editProfile}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
            <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)]">
              <div className="bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_45%),linear-gradient(135deg,#fff7ed_0%,#ffffff_75%)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white shadow-lg shadow-slate-900/15">{initials}</div>
                    <div className="min-w-0">
                      <p className="truncate text-xl font-semibold text-slate-950">{fullName}</p>
                      <p className="truncate text-sm text-slate-600">{userProfile.email}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setIsEditModalOpen(true)} className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/90 text-orange-500 transition-colors hover:bg-orange-50" aria-label={profilePage.editProfile}>
                    <Edit className="h-4 w-4" />
                  </button>
                </div>

              </div>

              <div className="space-y-3 p-4 sm:p-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Բաժիններ</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <a href="#overview" className="rounded-2xl border border-transparent bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-orange-200 hover:text-orange-600">{profilePage.profileInfo}</a>
                    <a href="#orders" className="rounded-2xl border border-transparent bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-orange-200 hover:text-orange-600">{profilePage.ordersHistory}</a>
                  </div>
                </div>

                <div className="space-y-2">
                  <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600">
                    <LogOut className="h-4 w-4" />
                    {profilePage.logout}
                  </button>
                  <button type="button" onClick={() => setIsDeleteModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 px-4 py-3 text-sm font-medium text-rose-500 transition-all hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" />
                    {profilePage.deleteAccount}
                  </button>
                </div>
              </div>
            </section>
          </aside>
          <main className="space-y-6">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {[
                { label: 'Ընդհանուր ծախս', value: `${new Intl.NumberFormat(dateLocale).format(totalSpent)} ${CURRENCY}`, hint: orders.length > 0 ? `Պատվերների քանակը ${orders.length}` : 'Դեռ պատվերներ չկան', icon: Wallet, accent: 'from-emerald-100 to-emerald-50 text-emerald-700 ring-emerald-100' },
                { label: 'Սպասվող պատվերներ', value: `${activeOrders}`, hint: activeOrders > 0 ? 'Ակտիվ պատվերները տեսանելի են ներքևում' : 'Բոլոր պատվերները ավարտված են', icon: Package, accent: 'from-amber-100 to-amber-50 text-amber-700 ring-amber-100' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <article key={stat.label} className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p>
                      </div>
                      <div className={`rounded-2xl bg-gradient-to-br p-3 ring-1 ${stat.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{stat.hint}</p>
                  </article>
                )
              })}
            </section>
            <section id="overview" className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] sm:p-6 lg:p-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Overview</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{profilePage.profileInfo}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Կարևոր տվյալները խմբավորված են այնպես, որ արագ գտնես ինչ է լրացված, ինչ է պետք թարմացնել և որտեղ են հիմնական գործողությունները։</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[320px] xl:max-w-[360px] xl:grid-cols-1">
                  <button type="button" onClick={() => setIsEditModalOpen(true)} className="rounded-2xl bg-slate-950 px-5 py-4 text-left text-white transition-transform hover:-translate-y-0.5">
                    <span className="block text-sm font-semibold">{profilePage.editProfile}</span>
                    <span className="mt-1 block text-sm text-slate-300">Թարմացրու անունը, հեռախոսը և հասցեն մեկ պատուհանից։</span>
                  </button>
                  <Link href={latestOrder ? '#orders' : '/products'} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition-colors hover:border-orange-200 hover:bg-orange-50">
                    <span className="block text-sm font-semibold text-slate-900">{latestOrder ? 'Տեսնել վերջին պատվերները' : profilePage.placeOrder}</span>
                    <span className="mt-1 block text-sm text-slate-600">{latestOrder ? 'Վերջին պատվերի կարգավիճակն ու պարունակությունը հասանելի են այստեղ։' : 'Սկսիր պատվերը և այն կհայտնվի այս էջում։'}</span>
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {profileFields.map((field) => {
                  const Icon = field.icon
                  const isEmpty = field.value === profilePage.notSet
                  return (
                    <article key={field.label} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="rounded-2xl bg-white p-3 text-slate-500 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-500">{field.label}</p>
                        <p className={`mt-1 break-words text-base font-semibold ${isEmpty ? 'text-slate-400' : 'text-slate-950'}`}>{field.value}</p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
            {false && (
              <>
            <section id="wishlist" className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] sm:p-6 lg:p-7">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-950">
                    <Heart className="h-5 w-5 text-orange-500" />
                    {profilePage.wishlistHeading}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Պահված ապրանքները հավաքված են մեկ տեղում, որ հեշտ համեմատես ու արագ վերադառնաս դրանց։</p>
                </div>
                <Link href="/wishlist" className="inline-flex items-center justify-center rounded-full border border-orange-200 px-4 py-2.5 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50">
                  {profilePage.openWishlist}
                </Link>
              </div>

              {wishlistLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                </div>
              ) : wishlistProducts.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                  <Heart className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-4 text-base font-medium text-slate-700">{profilePage.wishlistEmpty}</p>
                  <p className="mt-2 text-sm text-slate-500">Ապրանքները պահպանելիս դրանք կհայտնվեն այստեղ ավելի հարմար դիտարկման համար։</p>
                  <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                    {profilePage.placeOrder}
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {wishlistProducts.map((product) => (
                    <li key={product.id} className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/40 sm:flex-row sm:items-center">
                      <Link href={`/products/${product.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                          {product.image && product.image !== 'no-image' ? <Image src={product.image} alt={product.name} width={64} height={64} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Package className="h-6 w-6 text-slate-400" /></div>}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-slate-950">{product.name}</p>
                          <p className="mt-1 text-sm text-slate-500">Պահված ապրանք</p>
                        </div>
                      </Link>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <p className="text-base font-semibold text-slate-950">{new Intl.NumberFormat(dateLocale).format(product.price)} {CURRENCY}</p>
                        <button type="button" onClick={() => removeFromWishlist(product.id)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500" aria-label={profilePage.removeWishlistAria}>
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
              </>
            )}
            <section id="orders" className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] sm:p-6 lg:p-7">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{profilePage.ordersHistory}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Յուրաքանչյուր պատվերի կարգավիճակը, պարունակությունն ու կրկնելու գործողությունը մեկ հստակ timeline-ի մեջ են։</p>
                </div>
                {orders.length > 0 && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"><span className="font-semibold text-slate-950">{orders.length}</span> ընդհանուր պատվեր</div>}
              </div>

              {orders.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-4 text-base font-medium text-slate-700">{profilePage.noOrders}</p>
                  <p className="mt-2 text-sm text-slate-500">Առաջին պատվերից հետո այստեղ կտեսնես ամբողջ պատմությունը և արագ կրկնելու կոճակը։</p>
                  <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                    {profilePage.placeOrder}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    return (
                      <article key={order.id} className="rounded-[24px] border border-slate-200 bg-slate-50/55 p-4 sm:p-5">
                        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-slate-950">{profilePage.orderLabel} #{order.id.slice(-8)}</h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                              {getStatusIcon(order.status)}
                              <span>{statusInfo.text}</span>
                            </span>
                            <p className="text-lg font-bold text-slate-950">{new Intl.NumberFormat(dateLocale).format(order.total)} {CURRENCY}</p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-orange-50">
                                {item.product?.image ? <Image src={item.product.image} alt={getProductDisplayName(item.product.name, locale)} width={48} height={48} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Package className="h-5 w-5 text-orange-500" /></div>}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{item.product?.name ?? '—'}</p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">{item.quantity} {profilePage.qtyTimes} {new Intl.NumberFormat(dateLocale).format(item.price)} {CURRENCY}</p>
                              </div>
                              <p className="text-sm font-semibold text-slate-900 sm:text-base">{new Intl.NumberFormat(dateLocale).format(item.quantity * item.price)} {CURRENCY}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-slate-500">Ցանկության դեպքում կարող ես նույն կազմով նորից ավելացնել զամբյուղ։</p>
                          <button type="button" onClick={() => handleReorder(order)} disabled={reorderingId === order.id} className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60">
                            <RotateCcw className="h-4 w-4" />
                            {reorderingId === order.id ? profilePage.loading : profilePage.reorder}
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      <div className="hidden lg:block"><Footer /></div>
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={userProfile} onSave={handleSaveProfile} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteAccount} isLoading={isDeletingAccount} />
    </div>
  )
}
