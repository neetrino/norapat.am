'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, CreditCard, Phone, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import Footer from '@/components/Footer'
import { useI18n } from '@/i18n/I18nContext'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'

interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  address: string | null
}

export default function CheckoutPage() {
  const { locale, t } = useI18n()
  const cp = t.checkoutPage
  const router = useRouter()
  const { items, getTotalPrice, clearCart, validateCart } = useCart()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: 'asap',
    paymentMethod: 'cash',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')
  const [promoApplying, setPromoApplying] = useState(false)

  // Redirect if cart is empty and validate cart
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    } else {
      // Валидируем корзину при загрузке страницы
      validateCart()
    }
  }, [items, router, validateCart])

  // Load user profile and auto-fill form (only for authenticated users)
  useEffect(() => {
    const loadUserProfile = async () => {
      if (status === 'loading') return
      
      if (!session) return

      try {
        const response = await fetch('/api/user/profile')

        if (response.ok) {
          const profile = await response.json()
          setUserProfile(profile)
          setFormData(prev => ({
            ...prev,
            name: profile.name || '',
            phone: profile.phone || '',
            address: profile.address || ''
          }))
        }
      } catch {
        // Продолжаем как гость при ошибке загрузки профиля
      }
    }

    loadUserProfile()
  }, [session, status])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const applyPromo = async () => {
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    setPromoApplying(true)
    setPromoMessage('')
    setPromoDiscount(0)
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, total: getTotalPrice() })
      })
      const data = await res.json()
      if (data.valid && data.discountAmount != null) {
        setPromoDiscount(data.discountAmount)
        setPromoMessage(data.message || 'Զեղչ կիրառված')
      } else {
        setPromoMessage(data.message || 'Պրոմո կոդը սխալ է')
      }
    } catch {
      setPromoMessage('Սխալ')
    } finally {
      setPromoApplying(false)
    }
  }

  const finalTotal = Math.max(0, getTotalPrice() - promoDiscount)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = cp.errorName
    }

    if (!formData.phone.trim()) {
      newErrors.phone = cp.errorPhone
    } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = cp.errorPhoneFormat
    }

    if (!formData.address.trim()) {
      newErrors.address = cp.errorAddress
    }

    // Время доставки уже имеет дефолтное значение, валидация не нужна

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    await validateCart()
    if (items.length === 0) {
      alert(cp.alertEmptyCart)
      router.push('/products')
      return
    }

    setIsSubmitting(true)

    const orderPayload = {
      ...formData,
      email: session?.user?.email,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: finalTotal,
      promoCode: promoDiscount > 0 ? promoCode.trim().toUpperCase() : undefined
    }

    try {
      if (formData.paymentMethod === 'idram') {
        const response = await fetch('/api/payment/idram/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Idram init failed')
        }

        clearCart()

        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.paymentUrl
        form.style.display = 'none'
        Object.entries(data.paymentParams).forEach(([k, v]) => {
          if (v) {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = k
            input.value = String(v)
            form.appendChild(input)
          }
        })
        document.body.appendChild(form)
        form.submit()
        return
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || response.statusText)
      }

      clearCart()
      window.location.href = '/order-success'
    } catch (error) {
      console.error('Order submit error:', error)
      alert(cp.alertOrderError)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Отступ для fixed хедера */}
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />
      
      {/* Mobile App Style Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 pb-20 lg:pb-8">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/cart"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 mr-2" />
              <span className="text-lg font-medium">{cp.backToCartShort}</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{cp.titleShort}</h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center space-x-4 mb-8">
          <Link 
            href="/cart"
            className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {cp.backToCart}
          </Link>
          <div className="h-8 w-px bg-gray-300"></div>
          <h1 className="text-3xl font-bold text-gray-900">{cp.title}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* Mobile Order Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{cp.deliveryData}</h2>
                {!session && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {cp.guestOrder}
                  </span>
                )}
              </div>
                
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    {cp.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={cp.namePlaceholder}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    {cp.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+374 99 123 456"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {cp.address}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-gray-900 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={cp.addressPlaceholder}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {cp.deliveryTime}
                  </label>
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900"
                  >
                    <option value="asap">{cp.asap}</option>
                    <option value="11:00-12:00">11:00 - 12:00</option>
                    <option value="12:00-13:00">12:00 - 13:00</option>
                    <option value="13:00-14:00">13:00 - 14:00</option>
                    <option value="14:00-15:00">14:00 - 15:00</option>
                    <option value="15:00-16:00">15:00 - 16:00</option>
                    <option value="16:00-17:00">16:00 - 17:00</option>
                    <option value="17:00-18:00">17:00 - 18:00</option>
                    <option value="18:00-19:00">18:00 - 19:00</option>
                    <option value="19:00-20:00">19:00 - 20:00</option>
                    <option value="20:00-21:00">20:00 - 21:00</option>
                  </select>
                  {errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>}
                </div>
              </div>
            </div>

            {/* Mobile Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{cp.paymentMethod}</h2>
              <div className="space-y-4">
                <label className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  formData.paymentMethod === 'cash' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{cp.cash}</h3>
                      <p className="text-sm text-gray-600">{cp.cashDesc}</p>
                    </div>
                    {formData.paymentMethod === 'cash' && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>
                
                <label className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  formData.paymentMethod === 'card' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{cp.card}</h3>
                      <p className="text-sm text-gray-600">{cp.cardDesc}</p>
                    </div>
                    {formData.paymentMethod === 'card' && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>

                <label className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  formData.paymentMethod === 'idram' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="idram"
                    checked={formData.paymentMethod === 'idram'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-orange-600">ID</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{cp.idram}</h3>
                      <p className="text-sm text-gray-600">{cp.idramDesc}</p>
                    </div>
                    {formData.paymentMethod === 'idram' && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Mobile Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{cp.comment}</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-gray-900"
                placeholder={cp.commentPlaceholder}
              />
            </div>

            {/* Mobile Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{cp.yourOrder}</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {getProductDisplayName(item.product.name, locale)}
                      </div>
                        <div className="text-xs text-gray-600">{item.quantity} {cp.qtyUnit}.</div>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {item.product.price * item.quantity} ֏
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-300 pt-3 space-y-2">
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Զեղչ (պրոմո)</span>
                      <span>-{promoDiscount} ֏</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>{cp.total}</span>
                    <span>{finalTotal} ֏</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {cp.freeDelivery}
                  </div>
                </div>
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Պրոմո կոդ</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="PROMO"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promoApplying}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50"
                    >
                      {promoApplying ? '...' : 'Կիրառել'}
                    </button>
                  </div>
                  {promoMessage && <p className={`text-sm mt-1 ${promoDiscount > 0 ? 'text-green-600' : 'text-red-600'}`}>{promoMessage}</p>}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? cp.submitting : cp.submit}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                {cp.agreeTerms}
              </p>
              {!session && (
                <p className="text-xs text-blue-600 mt-2 text-center">
                  💡 {cp.guestHint}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">{cp.deliveryData}</h2>
                  {!session && (
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {cp.guestOrder}
                    </span>
                  )}
                </div>
                
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      {cp.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={cp.namePlaceholder}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      {cp.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+374 99 123 456"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      {cp.address}
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-gray-900 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={cp.addressPlaceholder}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {cp.deliveryTime}
                    </label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900"
                    >
                      <option value="asap">{cp.asap}</option>
                      <option value="11:00-12:00">11:00 - 12:00</option>
                      <option value="12:00-13:00">12:00 - 13:00</option>
                      <option value="13:00-14:00">13:00 - 14:00</option>
                      <option value="14:00-15:00">14:00 - 15:00</option>
                      <option value="15:00-16:00">15:00 - 16:00</option>
                      <option value="16:00-17:00">16:00 - 17:00</option>
                      <option value="17:00-18:00">17:00 - 18:00</option>
                      <option value="18:00-19:00">18:00 - 19:00</option>
                      <option value="19:00-20:00">19:00 - 20:00</option>
                      <option value="20:00-21:00">20:00 - 21:00</option>
                    </select>
                    {errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      <CreditCard className="inline h-4 w-4 mr-1" />
                      {cp.paymentMethod} *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.paymentMethod === 'cash' 
                          ? 'border-orange-500 bg-orange-50 shadow-md' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{cp.cash}</h3>
                          <p className="text-sm text-gray-600">{cp.cashDescFull}</p>
                          {formData.paymentMethod === 'cash' && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                      
                      <label className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.paymentMethod === 'card' 
                          ? 'border-orange-500 bg-orange-50 shadow-md' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="h-8 w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{cp.card}</h3>
                          <p className="text-sm text-gray-600">{cp.cardDescFull}</p>
                          {formData.paymentMethod === 'card' && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>

                      <label className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.paymentMethod === 'idram' 
                          ? 'border-orange-500 bg-orange-50 shadow-md' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="idram"
                          checked={formData.paymentMethod === 'idram'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-orange-600">ID</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{cp.idram}</h3>
                          <p className="text-sm text-gray-600">{cp.idramDescFull}</p>
                          {formData.paymentMethod === 'idram' && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {cp.comment}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-gray-900"
                      placeholder={cp.commentPlaceholder}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{cp.yourOrder}</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center py-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {getProductDisplayName(item.product.name, locale)}
                        </div>
                        <div className="text-sm text-gray-600">{item.quantity} {cp.qtyUnit}.</div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {item.product.price * item.quantity} ֏
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-300 pt-4 space-y-2">
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Զեղչ (պրոմո)</span>
                        <span>-{promoDiscount} ֏</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>{cp.total}</span>
                      <span>{finalTotal} ֏</span>
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      {cp.freeDelivery}
                    </div>
                  </div>
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Պրոմո կոդ</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="PROMO"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        disabled={promoApplying}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50"
                      >
                        {promoApplying ? '...' : 'Կիրառել'}
                      </button>
                    </div>
                    {promoMessage && <p className={`text-sm mt-1 ${promoDiscount > 0 ? 'text-green-600' : 'text-red-600'}`}>{promoMessage}</p>}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? cp.submitting : cp.submit}
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  {cp.agreeTerms}
                </p>
                {!session && (
                  <p className="text-xs text-blue-600 mt-2 text-center">
                    💡 {cp.guestHint}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Hide Footer on Mobile and Tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  )
}
