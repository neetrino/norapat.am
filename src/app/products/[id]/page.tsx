import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, MapPin, Phone, Zap, Check, XCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import ProductQuantityControls from '@/components/ProductQuantityControls'
import { SimilarProducts } from '@/components/SimilarProducts'
import { CategoryDisplayName } from '@/components/CategoryDisplayName'
import { ProductCategoryLine } from '@/components/ProductCategoryLine'
import { ProductDisplayName } from '@/components/ProductDisplayName'
import { ProductImageGallery } from '@/components/ProductImageGallery'
import { prisma } from '@/lib/prisma'
import { hy } from '@/i18n/dictionaries'

// Server Component - տվյալները բեռնվում են սերվերից
export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const t = hy.productPage

  try {
    // Բեռնել տվյալները սերվերից - օպտիմիզացված հարցում
    const [product, similarProducts] = await Promise.all([
      // Հիմնական ապրանք
      prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          shortDescription: true,
          description: true,
          price: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              isActive: true
            }
          },
          image: true,
          images: true,
          originalPrice: true,
          ingredients: true,
          isAvailable: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      
      // Նմանատիպ ապրանքներ - միայն 4 հատ
      prisma.product.findMany({
        where: {
          isAvailable: true,
          id: { not: id }
        },
        select: {
          id: true,
          name: true,
          shortDescription: true,
          description: true,
          price: true,
          originalPrice: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              isActive: true
            }
          },
          image: true,
          images: true,
          ingredients: true,
          isAvailable: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 4
      })
    ])

  if (!product) {
      notFound()
    }

  return (
    <div className="min-h-screen bg-white" style={{ overflow: 'auto' }}>
      
      {/* Breadcrumb */}
      <div className="bg-white pt-header-breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">{t.breadcrumbHome}</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-orange-500">{t.breadcrumbMenu}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              <ProductDisplayName name={product.name} />
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t.backToCatalog}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image Gallery (multiple images + zoom) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-visible group relative p-4">
              <div className="relative">
                <ProductImageGallery
                  images={
                    (product.images && product.images.length > 0)
                      ? product.images
                      : product.image && product.image !== 'no-image'
                      ? [product.image]
                      : []
                  }
                  productName={product.name}
                />
                {/* Badges overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
                  {/* 3D Category Badge */}
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                    style={{
                      boxShadow: '0 10px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <CategoryDisplayName apiName={product.category?.name} />
                  </div>
                  
                  {/* 3D Special Badge */}
                  {product.status === 'HIT' && (
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-1 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                      style={{
                        boxShadow: '0 10px 25px rgba(255, 193, 7, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Star className="w-3 h-3" />
                      {t.badgeHit}
                    </div>
                  )}
                  
                  {product.status === 'NEW' && (
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-1 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                      style={{
                        boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Zap className="w-3 h-3" />
                      {t.badgeNew}
                    </div>
                  )}
                  
                  {product.status === 'CLASSIC' && (
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-3 py-1 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-1 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                      style={{
                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Star className="w-3 h-3" />
                      {t.badgeClassic}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div style={{ marginTop: '50px' }}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{t.productInfo}</h4>
                <ul className="space-y-2 text-gray-700">
                  <ProductCategoryLine apiName={product.category?.name} />
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    {t.prepTime}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    {t.weight}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    {t.freshIngredients}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    {t.noPreservatives}
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                <ProductDisplayName name={product.name} />
              </h1>
              {product.shortDescription ? (
                <>
                  <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                    {product.shortDescription}
                  </p>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      {t.fullDescription}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                </>
              ) : (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">{t.reviews}</span>
              </div>

              {/* Price: Ներկա արժեք / Հին գին / Զեղչված գին */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {product.originalPrice != null && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice} ֏
                  </span>
                )}
                <span className="text-4xl font-bold text-orange-500">{product.price} ֏</span>
                <span className="text-lg text-gray-500">{t.perServing}</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.isAvailable ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                    <Check className="h-4 w-4" />
                    {t.stockAvailable}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                    <XCircle className="h-4 w-4" />
                    {t.stockUnavailable}
                  </span>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.ingredients}</h3>
              <div className="flex flex-wrap gap-3">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-orange-100 text-orange-800 text-sm rounded-full font-medium hover:bg-orange-200 transition-colors"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

              {/* Quantity and Add to Cart - Client Component */}
            <div className="space-y-6">
                <ProductQuantityControls product={product} />
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">{t.prepTimeValue}</div>
                    <div className="text-sm text-gray-600">{t.prepTimeShort}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">{t.deliveryTimeValue}</div>
                    <div className="text-sm text-gray-600">{t.delivery}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">{t.support}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
          {similarProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {t.similarProducts}
              </h2>
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
              <Link 
                href="/products" 
                className="group text-orange-500 hover:text-orange-600 text-lg font-bold flex items-center space-x-2 transition-colors duration-300 ml-2"
              >
                <span>{t.all}</span>
                <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform duration-300" style={{ strokeWidth: 3 }} />
              </Link>
            </div>
            
            <SimilarProducts products={similarProducts} />
          </section>
        )}
      </div>

      {/* Hide Footer on Mobile and Tablet */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
    )
  } catch (error) {
    console.error('Error loading product page:', error)
    notFound()
  }
}

