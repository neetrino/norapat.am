'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'
import ImageSelectorMultiple from '@/components/ImageSelectorMultiple'
import { Category } from '@/types'

const statuses = [
  { value: 'HIT', label: 'Վաճառքի հիթ' },
  { value: 'NEW', label: 'Նորույթ' },
  { value: 'CLASSIC', label: 'Դասական' },
  { value: 'BANNER', label: 'Բաններ' }
]

export default function NewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    images: [] as string[],
    ingredients: '',
    isAvailable: true,
    status: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Բեռնում ենք կատեգորիաները
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    if (session?.user?.role === 'ADMIN') {
      fetchCategories()
    }
  }, [session])

  // Ստուգում ենք մուտքի իրավունքները
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Բեռնում...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/login')
    return null
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Պատրաստում ենք տվյալները
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : [],
        image: formData.images?.length ? formData.images[0] : 'no-image',
        images: formData.images || []
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Սխալ ապրանք ստեղծելիս')
      }

      // Վերաուղղում ենք ապրանքների էջ
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      setError(error instanceof Error ? error.message : 'Սխալ ապրանք ստեղծելիս')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Ֆիքսված վերնագրի բացատ */}
      <div className="h-header-spacer-mobile lg:hidden" aria-hidden />
      <div className="h-header-spacer-desktop hidden lg:block" aria-hidden />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Վերադարձ
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ավելացնել ապրանք</h1>
              <p className="text-gray-600 mt-2">Կատալոգում նոր ապրանքի ստեղծում</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Ապրանքի տվյալներ</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Անվանում */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ապրանքի անվանում *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Մուտքագրեք ապրանքի անվանումը"
                    required
                  />
                </div>

                {/* Կարճ նկարագրություն */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Կարճ նկարագրություն
                  </label>
                  <Input
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Կարճ ամփոփ նկարագրություն (նախաբան, քարտերում)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Կարճ ամփոփ, 1–2 նախադասություն
                  </p>
                </div>

                {/* Լիարժեք նկարագրություն */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Լիարժեք նկարագրություն *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Մանրամասն նկարագրություն ապրանքի մասին"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    rows={3}
                    required
                  />
                </div>

                {/* Գին */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Գին (֏) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Հին գին */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Հին գին (֏) — զեղչի համար
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    placeholder="Դատարկ = զեղչ չկա"
                  />
                </div>

                {/* Կատեգորիա */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Կատեգորիա *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  >
                    <option value="">Ընտրեք կատեգորիան</option>
                    {categories.filter(cat => cat.isActive).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Կարգավիճակ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ապրանքի կարգավիճակ
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Ընտրված չէ (սովորական ապրանք)</option>
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Նկարներ */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Նկարներ (մի քանի)
                  </label>
                  <ImageSelectorMultiple
                    value={formData.images}
                    onChange={(imagePaths) => handleInputChange('images', imagePaths)}
                  />
                </div>

                {/* Բաղադրիչներ */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Բաղադրիչներ
                  </label>
                  <Input
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                    placeholder="Բաղադրիչ 1, Բաղադրիչ 2, Բաղադրիչ 3"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Բաղադրիչները բաժանեք ստորակետերով
                  </p>
                </div>

                {/* Հասանելիություն */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Ապրանքը հասանելի է պատվերի համար
                    </span>
                  </label>
                </div>
              </div>

              {/* Կոճակներ */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-300">
                <Link href="/admin/products">
                  <Button type="button" variant="outline">
                    Չեղարկել
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading ? 'Ստեղծվում է...' : 'Ստեղծել ապրանք'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
