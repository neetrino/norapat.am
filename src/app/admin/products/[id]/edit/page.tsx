'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Product, Category } from '@/types'
import ImageSelectorMultiple from '@/components/ImageSelectorMultiple'
import { parseProductPriceForm, productApiToPriceFormFields } from '@/lib/productPriceForm'

const statuses = [
  { value: 'HIT', label: 'Վաճառքի հիթ' },
  { value: 'NEW', label: 'Նորույթ' },
  { value: 'CLASSIC', label: 'Դասական' },
  { value: 'BANNER', label: 'Բաններ' }
]

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [productId, setProductId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    listPrice: '',
    discountedPrice: '',
    categoryId: '',
    image: '',
    images: [] as string[],
    ingredients: '',
    isAvailable: true,
    status: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error])

  // Ստանում ենք ապրանքի ID-ն params-ից
  useEffect(() => {
    const getProductId = async () => {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    getProductId()
  }, [params])

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

  // Բեռնում ենք ապրանքի տվյալները
  useEffect(() => {
    if (!productId) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Ապրանքը չի գտնվել')
        }

        const productData = await response.json()
        setProduct(productData)
        
        // Լրացնում ենք ֆորման ապրանքի տվյալներով
        const productImages = productData.images && productData.images.length > 0
          ? productData.images
          : productData.image && productData.image !== 'no-image'
          ? [productData.image]
          : []
        const priceFields = productApiToPriceFormFields({
          price: productData.price,
          originalPrice: productData.originalPrice
        })
        setFormData({
          name: productData.name || '',
          shortDescription: productData.shortDescription || '',
          description: productData.description || '',
          listPrice: priceFields.listPrice,
          discountedPrice: priceFields.discountedPrice,
          categoryId: productData.categoryId || productData.category?.id || '',
          image: productData.image || '',
          images: productImages,
          ingredients: productData.ingredients?.join(', ') || '',
          isAvailable: productData.isAvailable ?? true,
          status: productData.status === 'REGULAR' ? '' : (productData.status || '')
        })
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Ապրանքը չի գտնվել')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  // Ստուգում ենք մուտքի իրավունքները
  if (status === 'loading' || !productId) {
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
    setSaving(true)
    setError('')

    try {
      const { listPrice, discountedPrice, ...restForm } = formData
      const parsed = parseProductPriceForm(listPrice, discountedPrice)
      if (!parsed.ok) {
        setError(parsed.error)
        setSaving(false)
        return
      }

      const productData = {
        ...restForm,
        price: parsed.price,
        originalPrice: parsed.originalPrice,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : [],
        image: formData.images?.length ? formData.images[0] : formData.image || 'no-image',
        images: formData.images || []
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Սխալ ապրանքը թարմացնելիս')
      }

      // Վերաուղղում ենք ապրանքների էջ
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      setError(error instanceof Error ? error.message : 'Սխալ ապրանքը թարմացնելիս')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս ապրանքը։')) {
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Սխալ ապրանքը ջնջելիս')
      }

      // Վերաուղղում ենք ապրանքների էջ
      router.push('/admin/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      setError(error instanceof Error ? error.message : 'Սխալ ապրանքը ջնջելիս')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ապրանքը բեռնվում է...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ապրանքը չի գտնվել</h2>
          <p className="text-gray-600 mb-4">Հարցված ապրանքը գոյություն չունի</p>
          <Link href="/admin/products">
            <Button>Վերադառնալ ապրանքներին</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 sm:pt-3">
        {/* Header */}
        <div className="mb-4 text-center">
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Խմբագրել ապրանքը</h1>
            <p className="text-gray-600 mt-1.5">Ապրանքի տվյալների փոփոխում</p>
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
                <div ref={errorRef} className="bg-red-50 border border-red-200 rounded-lg p-4">
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

                {/* Լիարժեք / սկզբնական գին */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Լիարժեք գին (֏) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.listPrice}
                    onChange={(e) => handleInputChange('listPrice', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Զեղչի դեպքում մուտքագրեք սկզբնական գինը, ապա ներքևում՝ զեղչվածը
                  </p>
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

                {/* Զեղչված գին */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Զեղչված գին (֏)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                    placeholder="Թողեք դատարկ, եթե զեղչ չկա"
                    className="w-full"
                  />
                </div>

                {/* Նկարներ (մի քանի) */}
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
              <div className="flex items-center justify-between pt-6 border-t border-gray-300">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Ջնջել ապրանքը
                </Button>

                <div className="flex items-center gap-4">
                  <Link href="/admin/products">
                    <Button type="button" variant="outline">
                      Չեղարկել
                    </Button>
                  </Link>
                  <Button type="submit" disabled={saving} className="flex items-center gap-2">
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saving ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
