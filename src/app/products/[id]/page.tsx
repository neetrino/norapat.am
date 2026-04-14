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
import { PRODUCT_PAGE_MOBILE_ACCENT_TEXT_CLASS } from '@/constants/productPageUi'

const statusBadgeStyles = {
  HIT: {
    icon: Star,
    className: 'text-[#b86114]',
  },
  NEW: {
    icon: Zap,
    className: 'text-[#6c8a2b]',
  },
  CLASSIC: {
    icon: Star,
    className: 'text-[#6f633d]',
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
          isBestSeller: true,
          isSpecialOffer: true,
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
          isBestSeller: true,
          isSpecialOffer: true,
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

    const hotOverlay =
      product.status === 'HIT' ? (
        <span className="rounded-full bg-[#E53228] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          {t.badgeHotPill}
        </span>
      ) : null

    return (
      <div
        className="min-h-screen bg-[#faf9f6] pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:bg-[#fffaf7] lg:pb-0"
        style={{ overflow: 'auto' }}
      >
        <div className="hidden border-b border-[#f1e5de] bg-white/90 pt-header-breadcrumb backdrop-blur lg:block">
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

        <div className="h-header-spacer-mobile lg:hidden" aria-hidden />

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Link
            href="/products"
            className="mb-5 hidden items-center gap-2 rounded-full border border-[#eedfd6] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600 lg:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToCatalog}
          </Link>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-[#efe3dd] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)] lg:rounded-[1.75rem] lg:shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <div className="relative">
                  <ProductImageGallery
                    images={galleryImages}
                    productName={product.name}
                    overlayTopRight={hotOverlay}
                    hideThumbnailsOnMobile
                  />

                  <div className="pointer-events-none absolute left-3 top-2 z-20 hidden flex-wrap gap-2 sm:left-4 sm:top-3 lg:flex">
                    <div className="inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
                      <CategoryDisplayName apiName={product.category?.name} />
                    </div>

                    {statusLabel && statusStyle && StatusIcon && (
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold drop-shadow-[0_1px_0_rgba(255,255,255,0.85)] ${statusStyle.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusLabel}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 lg:hidden"
              >
                <Link href="/" className="transition-colors hover:text-[#E53225]">
                  {t.breadcrumbHome}
                </Link>
                <span className="text-slate-400">/</span>
                <Link href="/products" className="transition-colors hover:text-[#E53225]">
                  {t.breadcrumbMenu}
                </Link>
                <span className="text-slate-400">/</span>
                <span className="font-semibold text-slate-800">
                  <CategoryDisplayName apiName={product.category?.name} />
                </span>
              </nav>

              <div className="hidden gap-3 lg:grid lg:grid-cols-3">
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

              <div className="hidden rounded-[1.5rem] border border-[#efe3dd] bg-white p-4 shadow-sm sm:p-5 lg:block">
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
              <div className="rounded-none border-0 bg-transparent p-0 shadow-none lg:rounded-[1.75rem] lg:border lg:border-[#efe3dd] lg:bg-white lg:p-6 lg:shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col gap-4">
                  <div className="order-1 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                    <div className="min-w-0 flex-1 space-y-3">
                      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-[2rem]">
                        <ProductDisplayName name={product.name} />
                      </h1>

                      <div className="lg:hidden">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className={`text-3xl font-bold tracking-tight ${PRODUCT_PAGE_MOBILE_ACCENT_TEXT_CLASS}`}>
                            {product.price} ֏
                          </span>
                          <span className="text-sm text-slate-500">{t.pricePerKg}</span>
                        </div>
                      </div>

                      <div className="hidden flex-wrap items-center gap-2 lg:flex">
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

                    <div className="hidden shrink-0 rounded-[1.25rem] bg-[#fff6f1] px-4 py-3 text-right ring-1 ring-[#f5ddd1] lg:block">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {t.perServing}
                      </div>
                      <div className="mt-1 text-3xl font-black tracking-tight text-orange-600">
                        {product.price} ֏
                      </div>
                    </div>
                  </div>

                  <div className="order-2 lg:order-5 lg:border-t lg:border-[#f1e5de] lg:pt-5">
                    <ProductQuantityControls product={product} variant="responsive" />
                  </div>

                  <div className="order-3 rounded-2xl bg-white/80 px-4 py-3 text-[15px] leading-7 text-slate-600 ring-1 ring-slate-200/60 lg:order-2 lg:rounded-2xl lg:bg-[#fffaf6] lg:ring-0">
                    {product.shortDescription || product.description}
                  </div>

                  <div className="order-4 lg:order-3">
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

        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error loading product page:', error)
    notFound()
  }
}
