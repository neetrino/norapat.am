'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Package,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  X
} from 'lucide-react'
import ImageSelector from '@/components/ImageSelector'

interface Category {
  id: string
  name: string
  description: string | null
  image: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    products: number
  }
}

export default function CategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInactive, setShowInactive] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  })
  const [formError, setFormError] = useState('')
  const formErrorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formError && formErrorRef.current) {
      formErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [formError])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/categories?includeInactive=${showInactive}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched categories:', data)
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }, [showInactive])

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    fetchCategories()
  }, [session, status, router, fetchCategories])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchCategories()
        setIsCreating(false)
        setFormData({ name: '', description: '', image: '', isActive: true })
      } else {
        const data = await response.json()
        setFormError(data.error || 'Չհաջողվեց ստեղծել կատեգորիան: Փորձե՛ք կրկին:')
      }
    } catch {
      setFormError('Կատեգորիա ստեղծելիս սխալ է տեղի ունեցել: Ստուգե՛ք ձեր կապը և փորձե՛ք կրկին:')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    setFormError('')

    try {
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchCategories()
        setEditingCategory(null)
        setFormData({ name: '', description: '', image: '', isActive: true })
      } else {
        const data = await response.json()
        setFormError(data.error || 'Չհաջողվեց թարմացնել կատեգորիան: Փորձե՛ք կրկին:')
      }
    } catch {
      setFormError('Կատեգորիա թարմացնելիս սխալ է տեղի ունեցել: Ստուգե՛ք ձեր կապը և փորձե՛ք կրկին:')
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս կատեգորիան:')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCategories()
      } else {
        const data = await response.json()
        alert(data.error || 'Չհաջողվեց ջնջել կատեգորիան: Հնարավոր է կատեգորիան ունի ապրանքներ:')
      }
    } catch {
      alert('Կատեգորիա ջնջելիս սխալ է տեղի ունեցել: Ստուգե՛ք ձեր կապը և փորձե՛ք կրկին:')
    }
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive
    })
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setIsCreating(false)
    setFormData({ name: '', description: '', image: '', isActive: true })
    setFormError('')
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
    if (selectedIds.size === categories.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(categories.map(c => c.id)))
    }
  }

  const handleBulkDelete = async () => {
    const deletable = categories.filter(c => selectedIds.has(c.id) && c._count.products === 0)
    const nonDeletable = categories.filter(c => selectedIds.has(c.id) && c._count.products > 0)

    if (deletable.length === 0) {
      alert('Ընտրված կատեգորիաները ջնջել հնարավոր չէ, քանի որ բոլորն ունեն ապրանքներ: Նախ տեղափոխե՛ք կամ ջնջե՛ք ապրանքները:')
      return
    }

    const msg = nonDeletable.length > 0
      ? `${deletable.length} կատեգորիա կջնջվի: ${nonDeletable.length} կատեգորիա ունի ապրանքներ և չի ջնջվի: Շարունակե՞լ:`
      : `Համոզվա՞ծ եք, որ ցանկանում եք ջնջել ${deletable.length} կատեգորիա:`

    if (!confirm(msg)) return

    for (const category of deletable) {
      await fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
    }

    setSelectedIds(new Set())
    await fetchCategories()
  }

  const handleBulkEdit = () => {
    if (selectedIds.size !== 1) return
    const category = categories.find(c => selectedIds.has(c.id))
    if (category) startEdit(category)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Բեռնում...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Կատեգորիաների կառավարում</h1>
              <p className="text-gray-600">Ավելացրեք, խմբագրեք և ջնջեք ապրանքների կատեգորիաները</p>
            </div>
            <Link 
              href="/admin"
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Վերադարձ
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
                  showInactive 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showInactive ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {showInactive ? 'Ցուցադրել բոլորը' : 'Թաքցնել ոչ ակտիվները'}
              </button>
            </div>
            
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ավելացնել կատեգորիա
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingCategory) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {isCreating ? 'Ստեղծել կատեգորիա' : 'Խմբագրել կատեգորիա'}
            </h2>
            
            <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-4">
              {formError && (
                <div ref={formErrorRef} className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{formError}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Կատեգորիայի անվանում *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Մուտքագրեք կատեգորիայի անվանումը"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Նկարագրություն
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Մուտքագրեք կատեգորիայի նկարագրությունը"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Նկար
                </label>
                <ImageSelector
                  value={formData.image}
                  onChange={(imagePath) => setFormData({ ...formData, image: imagePath })}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Ակտիվ կատեգորիա
                </label>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
                >
                  {isCreating ? 'Ստեղծել' : 'Պահպանել'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                >
                  Չեղարկել
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={toggleSelectAll} className="text-gray-400 hover:text-orange-500 transition-colors">
                {selectedIds.size === categories.length && categories.length > 0
                  ? <CheckSquare className="h-5 w-5 text-orange-500" />
                  : <Square className="h-5 w-5" />}
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Կատեգորիաներ ({categories.length})
              </h2>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Ընտրված՝ {selectedIds.size}</span>
                {selectedIds.size === 1 && (
                  <button
                    onClick={handleBulkEdit}
                    className="flex items-center px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Խմբագրել
                  </button>
                )}
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Ջնջել
                </button>
              </div>
            )}
          </div>
          
          {categories.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Կատեգորիաներ չեն գտնվել</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className={`p-6 hover:bg-gray-50 transition-colors ${selectedIds.has(category.id) ? 'bg-orange-50' : ''}`}>
                  <div className="flex items-center justify-between gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(category.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {selectedIds.has(category.id)
                        ? <CheckSquare className="h-5 w-5 text-orange-500" />
                        : <Square className="h-5 w-5" />}
                    </button>

                    {/* Изображение категории */}
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {category.image && !imageErrors.has(category.id) ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                            unoptimized
                            onError={() => {
                              console.error('Image load error for category:', category.name, category.image)
                              setImageErrors(prev => new Set(prev).add(category.id))
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Ակտիվ' : 'Ոչ ակտիվ'}
                        </span>
                      </div>
                      
                      {category.description && (
                        <p className="text-gray-600 mb-2">{category.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Ապրանքներ: {category._count.products}</span>
                        <span>Ստեղծվել է: {new Date(category.createdAt).toLocaleDateString('hy-AM')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                        title="Խմբագրել"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Ջնջել"
                        disabled={category._count.products > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
