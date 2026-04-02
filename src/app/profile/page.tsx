'use client'

import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Clock, Lock, MapPin, Package, RotateCcw, Trash2, User, Wallet, XCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import DeleteAccountModal from '@/components/DeleteAccountModal'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'
import { useI18n } from '@/i18n/I18nContext'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'

interface Order {
  id: string
  status: string
  total: number
  paymentMethod: string
  createdAt: string
  items: Array<{
    productId: string
    product: { id: string; name: string; image: string }
    quantity: number
    price: number
  }>
}

type Section = 'dashboard' | 'orders' | 'personal' | 'addresses' | 'password'
type FeedbackTone = 'success' | 'error'

function getFeedbackClass(tone: FeedbackTone) {
  return tone === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-rose-200 bg-rose-50 text-rose-700'
}


const CURRENCY = '֏'

export default function ProfilePage() {
  const { t, locale } = useI18n()
  const { profilePage, orderStatus, checkoutPage } = t
  const dateLocale = locale === 'hy' ? 'hy-AM' : locale === 'ru' ? 'ru-RU' : 'en-US'
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addItem: addToCart } = useCart()

  const [orders, setOrders] = useState<Order[]>([])
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [userProfile, setUserProfile] = useState({ name: '', email: '', phone: '', address: '' })
  const [personalForm, setPersonalForm] = useState({ name: '', phone: '' })
  const [addressForm, setAddressForm] = useState({ address: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [personalFeedback, setPersonalFeedback] = useState('')
  const [addressFeedback, setAddressFeedback] = useState('')
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [personalFeedbackTone, setPersonalFeedbackTone] = useState<FeedbackTone>('success')
  const [addressFeedbackTone, setAddressFeedbackTone] = useState<FeedbackTone>('success')
  const [passwordFeedbackTone, setPasswordFeedbackTone] = useState<FeedbackTone>('success')
  const [isSavingPersonal, setIsSavingPersonal] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }

    const load = async () => {
      try {
        const [ordersResponse, profileResponse] = await Promise.all([fetch('/api/orders'), fetch('/api/user/profile')])
        if (ordersResponse.ok) setOrders(await ordersResponse.json())
        if (profileResponse.ok) {
          const data = await profileResponse.json()
          const nextProfile = {
            name: data.name || session.user?.name || '',
            email: data.email || session.user?.email || '',
            phone: data.phone || '',
            address: data.address || '',
          }
          setUserProfile(nextProfile)
          setPersonalForm({ name: nextProfile.name, phone: nextProfile.phone })
          setAddressForm({ address: nextProfile.address })
        }
      } catch (error) {
        console.error('Profile load failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [router, session, status])

  const cardClass = 'rounded-3xl border border-slate-200 bg-white p-5 sm:p-6'
  const inputClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-300'
  const isPersonalDirty = personalForm.name !== userProfile.name || personalForm.phone !== userProfile.phone
  const isAddressDirty = addressForm.address !== userProfile.address
  const isPasswordDirty = Boolean(passwordForm.currentPassword || passwordForm.newPassword || passwordForm.confirmPassword)
  const navItems: Array<{ key: Section; label: string; icon: typeof User }> = [
    { key: 'dashboard', label: 'Վահանակ', icon: Wallet },
    { key: 'orders', label: 'Պատվերներ', icon: Package },
    { key: 'personal', label: 'Անձնական տեղեկություն', icon: User },
    { key: 'addresses', label: 'Հասցեներ', icon: MapPin },
    { key: 'password', label: 'Փոխել գաղտնաբառը', icon: Lock },
  ]

  const saveProfile = async (payload: { name: string; phone: string; address: string }) => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.error || 'Չհաջողվեց պահպանել տվյալները։')
    const nextProfile = {
      name: data.name || '',
      email: data.email || userProfile.email || session?.user?.email || '',
      phone: data.phone || '',
      address: data.address || '',
    }
    setUserProfile(nextProfile)
    setPersonalForm({ name: nextProfile.name, phone: nextProfile.phone })
    setAddressForm({ address: nextProfile.address })
  }

  const handlePersonalSave = async () => {
    if (!isPersonalDirty) {
      setPersonalFeedbackTone('success')
      setPersonalFeedback('No changes to save.')
      return
    }

    setIsSavingPersonal(true)
    setPersonalFeedback('')
    try {
      await saveProfile({ name: personalForm.name, phone: personalForm.phone, address: addressForm.address })
      setPersonalFeedbackTone('success')
      setPersonalFeedback('Saved successfully.')
    } catch (error) {
      setPersonalFeedbackTone('error')
      setPersonalFeedback(error instanceof Error ? error.message : 'Failed to save changes.')
    } finally {
      setIsSavingPersonal(false)
    }
  }

  const handleAddressSave = async () => {
    if (!isAddressDirty) {
      setAddressFeedbackTone('success')
      setAddressFeedback('No changes to save.')
      return
    }

    setIsSavingAddress(true)
    setAddressFeedback('')
    try {
      await saveProfile({ name: personalForm.name, phone: personalForm.phone, address: addressForm.address })
      setAddressFeedbackTone('success')
      setAddressFeedback('Address saved successfully.')
    } catch (error) {
      setAddressFeedbackTone('error')
      setAddressFeedback(error instanceof Error ? error.message : 'Failed to save address.')
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handlePasswordSave = async () => {
    setPasswordFeedback('')
    setPasswordFeedbackTone('error')
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) return setPasswordFeedback('Please fill in all fields.')
    if (passwordForm.newPassword.length < 6) return setPasswordFeedback('New password must be at least 6 characters.')
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return setPasswordFeedback('New passwords do not match.')

    setIsSavingPassword(true)
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || 'Failed to change password.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordFeedbackTone('success')
      setPasswordFeedback('Password changed successfully.')
    } catch (error) {
      setPasswordFeedbackTone('error')
      setPasswordFeedback(error instanceof Error ? error.message : 'Failed to change password.')
    } finally {
      setIsSavingPassword(false)
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

  const getPaymentMethodLabel = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'cash':
        return checkoutPage.cash
      case 'idram':
        return checkoutPage.idram
      case 'arca':
        return 'ArCa'
      case 'mastercard':
        return 'Mastercard'
      case 'visa':
        return 'Visa'
      case 'ameriabank':
        return 'Ameriabank'
      default:
        return paymentMethod
    }
  }

  const handleReorder = async (order: Order) => {
    if (order.items.length === 0) return
    setReorderingId(order.id)
    try {
      const ids = order.items.map((item) => item.productId).filter(Boolean)
      const response = await fetch(`/api/products?ids=${ids.join(',')}`)
      if (!response.ok) throw new Error('Failed to load products')
      const products: Product[] = await response.json()
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
    return <div className="flex min-h-screen items-center justify-center bg-white"><div className="h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
  }
  if (!session) return null

  const fullName = userProfile.name || profilePage.userDefault
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  const activeOrders = orders.filter((order) => !['DELIVERED', 'CANCELLED'].includes(order.status)).length
  const recentOrders = orders.slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="hidden h-header-spacer-desktop lg:block" aria-hidden />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-14 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pb-6 lg:pt-20">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="xl:self-start">
            <section className={cardClass}>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                  <Image
                    src="/profile-avatar.jpg"
                    alt="Profile avatar"
                    fill
                    sizes="64px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xl font-semibold text-slate-950">{fullName}</p>
                  <p className="truncate text-sm text-slate-600">{userProfile.email}</p>
                </div>
              </div>
              <nav className="mt-4 space-y-1 border-t border-slate-200 pt-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.key
                  return (
                    <button key={item.key} type="button" onClick={() => setActiveSection(item.key)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${isActive ? 'border border-red-500 bg-red-500 text-white' : 'text-slate-900 hover:bg-red-50 hover:text-slate-950'}`}>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-red-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
                <button type="button" onClick={() => setIsDeleteModalOpen(true)} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-900 transition-colors hover:bg-red-50 hover:text-slate-950"><Trash2 className="h-5 w-5 text-red-400" /><span>Ջնջել հաշիվը</span></button>
              </nav>
            </section>
          </aside>

          <main className="space-y-6">
            {activeSection === 'dashboard' && (
              <>
                <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[
                    { label: 'Ընդհանուր ծախս', value: `${new Intl.NumberFormat(dateLocale).format(totalSpent)} ${CURRENCY}`, hint: orders.length > 0 ? `Պատվերների քանակը ${orders.length}` : 'Դեռ պատվերներ չկան', icon: Wallet, accent: 'from-emerald-100 to-emerald-50 text-emerald-700 ring-emerald-100' },
                    { label: 'Սպասվող պատվերներ', value: `${activeOrders}`, hint: activeOrders > 0 ? 'Ակտիվ պատվերները տեսանելի են պատվերների բաժնում' : 'Բոլոր պատվերները ավարտված են', icon: Package, accent: 'from-amber-100 to-amber-50 text-amber-700 ring-amber-100' },
                  ].map((stat) => {
                    const Icon = stat.icon
                    return <article key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-1.5 text-3xl font-bold tracking-tight text-red-600">{stat.value}</p></div><div className={`rounded-2xl bg-gradient-to-br p-2 ring-1 ${stat.accent}`}><Icon className="h-5 w-5" /></div></div><p className="mt-2.5 text-sm leading-6 text-slate-600">{stat.hint}</p></article>
                  })}
                </section>
                <section className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{'Վերջին պատվերները'}</h2>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600">{'Այստեղ ցույց են տրված քո վերջին 4 պատվերները։'}</p>
                    </div>
                    {orders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveSection('orders')}
                        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        {profilePage.viewAllOrders}
                      </button>
                    )}
                  </div>
                  {recentOrders.length === 0 ? (
                    <div className="mt-3.5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 pt-7 pb-9 text-center">
                      <Package className="mx-auto h-12 w-12 text-slate-300" />
                      <p className="mt-4 text-base font-medium text-slate-700">{profilePage.noOrders}</p>
                      <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600">{profilePage.placeOrder}</Link>
                    </div>
                  ) : (
                    <div className="mt-3.5 grid grid-cols-1 gap-2.5 xl:grid-cols-2">
                      {recentOrders.map((order) => {
                        const statusInfo = getStatusInfo(order.status)
                        const firstItem = order.items[0]
                        const extraItemsCount = Math.max(order.items.length - 1, 0)

                        return (
                          <article key={order.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-3.5">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-base font-semibold text-slate-950">{profilePage.orderLabel} #{order.id.slice(-8)}</h3>
                                <p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                <p className="mt-1 text-xs font-medium text-slate-500">{checkoutPage.paymentMethod}: {getPaymentMethodLabel(order.paymentMethod)}</p>
                              </div>
                              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                                {getStatusIcon(order.status)}
                                <span>{statusInfo.text}</span>
                              </span>
                            </div>
                            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-orange-50">
                                {firstItem?.product?.image ? (
                                  <Image src={firstItem.product.image} alt={getProductDisplayName(firstItem.product.name, locale)} width={56} height={56} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center"><Package className="h-5 w-5 text-orange-500" /></div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{firstItem?.product?.name ?? '—'}</p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">{extraItemsCount > 0 ? `Եվս ${extraItemsCount} ապրանք` : '1 ապրանք'}</p>
                              </div>
                              <p className="text-sm font-bold text-red-600 sm:text-base">{new Intl.NumberFormat(dateLocale).format(order.total)} {CURRENCY}</p>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            {activeSection === 'orders' && (
              <section className={cardClass}>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><h2 className="text-xl font-semibold text-slate-950">{profilePage.ordersHistory}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Յուրաքանչյուր պատվերի կարգավիճակը, պարունակությունն ու կրկնելու գործողությունը հավաքված են այստեղ։</p></div>
                  {orders.length > 0 && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"><span className="font-semibold text-slate-950">{orders.length}</span> ընդհանուր պատվեր</div>}
                </div>
                {orders.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center"><Package className="mx-auto h-12 w-12 text-slate-300" /><p className="mt-4 text-base font-medium text-slate-700">{profilePage.noOrders}</p><Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600">{profilePage.placeOrder}</Link></div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.status)
                      return (
                        <article key={order.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
                            <div><h3 className="text-base font-semibold text-slate-950">{profilePage.orderLabel} #{order.id.slice(-8)}</h3><p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p><p className="mt-1 text-sm text-slate-500">{checkoutPage.paymentMethod}: <span className="font-medium text-slate-700">{getPaymentMethodLabel(order.paymentMethod)}</span></p></div>
                            <div className="flex flex-wrap items-center gap-3 lg:justify-end"><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>{getStatusIcon(order.status)}<span>{statusInfo.text}</span></span><p className="text-lg font-bold text-red-600">{new Intl.NumberFormat(dateLocale).format(order.total)} {CURRENCY}</p></div>
                          </div>
                          <div className="mt-4 space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-orange-50">{item.product?.image ? <Image src={item.product.image} alt={getProductDisplayName(item.product.name, locale)} width={48} height={48} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Package className="h-5 w-5 text-orange-500" /></div>}</div>
                                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{item.product?.name ?? '—'}</p><p className="mt-1 text-xs text-red-500 sm:text-sm">{item.quantity} {profilePage.qtyTimes} {new Intl.NumberFormat(dateLocale).format(item.price)} {CURRENCY}</p></div>
                                <p className="text-sm font-semibold text-red-600 sm:text-base">{new Intl.NumberFormat(dateLocale).format(item.quantity * item.price)} {CURRENCY}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">Կարող ես նույն պատվերը նորից ավելացնել զամբյուղ։</p>
                            <button type="button" onClick={() => handleReorder(order)} disabled={reorderingId === order.id} className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"><RotateCcw className="h-4 w-4" />{reorderingId === order.id ? profilePage.loading : profilePage.reorder}</button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {activeSection === 'personal' && (
              <section className={cardClass}>
                <h2 className="text-xl font-semibold text-slate-950">Անձնական տեղեկություն</h2>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div><label className="mb-2 block text-sm font-semibold text-slate-700">Անուն</label><input className={inputClass} value={personalForm.name} onChange={(event) => { setPersonalFeedback(''); setPersonalForm((prev) => ({ ...prev, name: event.target.value })) }} placeholder="Մուտքագրիր անունը" /></div>
                  <div><label className="mb-2 block text-sm font-semibold text-slate-700">Հեռախոս</label><input className={inputClass} value={personalForm.phone} onChange={(event) => { setPersonalFeedback(''); setPersonalForm((prev) => ({ ...prev, phone: event.target.value })) }} placeholder="Մուտքագրիր հեռախոսահամարը" /></div>
                </div>
                <div className="mt-4"><label className="mb-2 block text-sm font-semibold text-slate-700">Էլ. հասցե</label><input className={`${inputClass} bg-slate-100 text-slate-500`} value={userProfile.email} disabled readOnly /></div>
                {isPersonalDirty && !personalFeedback && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Unsaved changes.</div>}
                {personalFeedback && <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${getFeedbackClass(personalFeedbackTone)}`}>{personalFeedback}</div>}
                <button type="button" onClick={handlePersonalSave} disabled={isSavingPersonal} className="mt-6 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">{isSavingPersonal ? profilePage.loading : 'Պահպանել'}</button>
              </section>
            )}

            {activeSection === 'addresses' && (
              <section className={cardClass}>
                <h2 className="text-xl font-semibold text-slate-950">Հասցեներ</h2>
                <div className="mt-6"><label className="mb-2 block text-sm font-semibold text-slate-700">Հիմնական հասցե</label><textarea rows={5} className={inputClass} value={addressForm.address} onChange={(event) => { setAddressFeedback(''); setAddressForm({ address: event.target.value }) }} placeholder="Մուտքագրիր հասցեն" /></div>
                {isAddressDirty && !addressFeedback && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Address has unsaved changes.</div>}
                {addressFeedback && <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${getFeedbackClass(addressFeedbackTone)}`}>{addressFeedback}</div>}
                <button type="button" onClick={handleAddressSave} disabled={isSavingAddress} className="mt-6 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">{isSavingAddress ? profilePage.loading : 'Պահպանել հասցեն'}</button>
              </section>
            )}

            {activeSection === 'password' && (
              <section className={cardClass}>
                <h2 className="text-xl font-semibold text-slate-950">Փոխել գաղտնաբառը</h2>
                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div><label className="mb-2 block text-sm font-semibold text-slate-700">Ընթացիկ գաղտնաբառ</label><input type="password" className={inputClass} value={passwordForm.currentPassword} onChange={(event) => { setPasswordFeedback(''); setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value })) }} /></div>
                  <div><label className="mb-2 block text-sm font-semibold text-slate-700">Նոր գաղտնաբառ</label><input type="password" className={inputClass} value={passwordForm.newPassword} onChange={(event) => { setPasswordFeedback(''); setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value })) }} /></div>
                  <div><label className="mb-2 block text-sm font-semibold text-slate-700">Կրկնել նոր գաղտնաբառը</label><input type="password" className={inputClass} value={passwordForm.confirmPassword} onChange={(event) => { setPasswordFeedback(''); setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value })) }} /></div>
                </div>
                {isPasswordDirty && !passwordFeedback && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Password is not saved yet.</div>}
                {passwordFeedback && <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${getFeedbackClass(passwordFeedbackTone)}`}>{passwordFeedback}</div>}
                <button type="button" onClick={handlePasswordSave} disabled={isSavingPassword} className="mt-6 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">{isSavingPassword ? profilePage.loading : 'Փոխել գաղտնաբառը'}</button>
              </section>
            )}
          </main>
        </div>
      </div>
      <section className="hidden lg:block">
        <div className="mx-auto flex w-full max-w-7xl justify-center px-8 pb-6">
          <div className="relative mt-6 flex w-full max-w-4xl justify-center px-8 pt-6">
            <Image
              src="/profile-footer-couple.png"
              alt="Traditional Armenian couple"
              width={720}
              height={720}
              className="h-auto max-h-[360px] w-auto translate-y-2 object-contain"
              sizes="(max-width: 1280px) 50vw, 720px"
            />
          </div>
        </div>
      </section>
      <div className="mt-4 hidden lg:block lg:mt-6"><Footer /></div>
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteAccount} isLoading={isDeletingAccount} />
    </div>
  )
}
