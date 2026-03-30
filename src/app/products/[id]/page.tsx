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

const statusBadgeStyles = {
  HIT: {
    icon: Star,
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80',
  },
  NEW: {
    icon: Zap,
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80',
  },
  CLASSIC: {
    icon: Star,
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/80',
  },
} as const

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const t = hy.productPage

  try {
    const [product, similarProducts] = await Promise.all([
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

    const galleryImages =
      product.images && product.images.length > 0
        ? product.images
        : product.image && product.image !== 'no-image'
          ? [product.image]
          : []

    const statusLabel =
      product.status === 'HIT'
        ? t.badgeHit
        : product.status === 'NEW'
          ? t.badgeNew
          : product.status === 'CLASSIC'
            ? t.badgeClassic
            : null

    const statusStyle = product.status ? statusBadgeStyles[product.status as keyof typeof statusBadgeStyles] : null
    const StatusIcon = statusStyle?.icon
    const discountPercent =
      product.originalPrice != null && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null

    return (
      <div className="min-h-screen bg-[#fffaf7]" style={{ overflow: 'auto' }}>
        <div className="border-b border-[#f1e5de] bg-white/90 pt-header-breadcrumb backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="transition-colors hover:text-orange-500">
                {t.breadcrumbHome}
              </Link>
              <span>/</span>
              <Link href="/products" className="transition-colors hover:text-orange-500">
                {t.breadcrumbMenu}
              </Link>
              <span>/</span>
              <span className="font-medium text-slate-900">
                <ProductDisplayName name={product.name} />
              </span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Link
            href="/products"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eedfd6] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToCatalog}
          </Link>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[1.75rem] border border-[#efe3dd] bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-4">
                <div className="relative">
                  <ProductImageGallery images={galleryImages} productName={product.name} />

                  <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap gap-2 sm:left-4 sm:top-4">
                    <div className="inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
                      <CategoryDisplayName apiName={product.category?.name} />
                    </div>

                    {statusLabel && statusStyle && StatusIcon && (
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur ${statusStyle.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusLabel}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#efe3dd] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.prepTimeValue}</div>
                      <div className="text-xs text-slate-500">{t.prepTimeShort}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#efe3dd] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.deliveryTimeValue}</div>
                      <div className="text-xs text-slate-500">{t.delivery}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#efe3dd] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">24/7</div>
                      <div className="text-xs text-slate-500">{t.support}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#efe3dd] bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-900">{t.productInfo}</h2>
                  <span className="text-xs font-medium text-slate-400">{t.ingredients}</span>
                </div>

                <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <ProductCategoryLine apiName={product.category?.name} />
                  <li className="flex items-center gap-2 rounded-xl bg-[#fff8f4] px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    {t.prepTime}
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-[#fff8f4] px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    {t.weight}
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-[#fff8f4] px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    {t.freshIngredients}
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-[#fff8f4] px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    {t.noPreservatives}
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-28">
              <div className="rounded-[1.75rem] border border-[#efe3dd] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-3">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-[2rem]">
                      <ProductDisplayName name={product.name} />
                    </h1>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                          product.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80'
                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                        }`}
                      >
                        {product.isAvailable ? <Check className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {product.isAvailable ? t.stockAvailable : t.stockUnavailable}
                      </span>

                      {product.originalPrice != null && product.originalPrice > product.price && (
                        <>
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-500 line-through">
                            {product.originalPrice} ֏
                          </span>
                          {discountPercent != null && (
                            <span className="rounded-full bg-[#E53225] px-3 py-1.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(229,50,37,0.18)]">
                              -{discountPercent}%
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] bg-[#fff6f1] px-4 py-3 text-right ring-1 ring-[#f5ddd1]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {t.perServing}
                    </div>
                    <div className="mt-1 text-3xl font-black tracking-tight text-orange-600">
                      {product.price} ֏
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[#fffaf6] px-4 py-3 text-[15px] leading-7 text-slate-600">
                  {product.shortDescription || product.description}
                </div>

                <div className="mt-5">
                  <div className="mb-3 text-sm font-semibold text-slate-900">{t.ingredients}</div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={`${ingredient}-${index}`}
                        className="rounded-full border border-[#f0dfd4] bg-white px-3 py-1.5 text-sm font-medium text-slate-600"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-[#f1e5de] pt-5">
                  <ProductQuantityControls product={product} />
                </div>
              </div>
            </div>
          </div>

          {similarProducts.length > 0 && (
            <section className="mt-10">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-orange-500 to-red-500" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-[1.9rem]">
                    {t.similarProducts}
                  </h2>
                </div>

                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 rounded-full border border-[#eedfd6] bg-white px-4 py-2 text-sm font-semibold text-orange-600 transition-colors hover:border-orange-200 hover:text-orange-700"
                >
                  <span>{t.all}</span>
                  <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <SimilarProducts products={similarProducts} />
            </section>
          )}
        </div>

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
