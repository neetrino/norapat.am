'use client'

import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductImageWithLocalizedAlt } from './ProductImageWithLocalizedAlt'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'
import { useI18n } from '@/i18n/I18nContext'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  mainImageClassName?: string
}

export function ProductImageGallery({
  images,
  productName,
  mainImageClassName = ''
}: ProductImageGalleryProps) {
  void mainImageClassName
  const { locale } = useI18n()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  const handleClose = useCallback(() => setIsZoomOpen(false), [])

  useEffect(() => {
    if (!isZoomOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isZoomOpen, handleClose])

  const displayImages = images.length > 0
    ? images.filter((src) => src && src !== 'no-image')
    : []

  const currentImage = displayImages[selectedIndex] ?? null

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : displayImages.length - 1))
  }, [displayImages.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => (i < displayImages.length - 1 ? i + 1 : 0))
  }, [displayImages.length])

  const altText = getProductDisplayName(productName, locale)

  if (displayImages.length === 0) {
    return (
      <div
        className="flex h-96 w-full items-center justify-center rounded-[1.5rem] border border-[#f1e3dc] bg-[radial-gradient(circle_at_top,#fff8f3_0%,#fff3eb_45%,#fdfaf7_100%)] text-8xl opacity-70"
        aria-label={altText}
      >
        🍟
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="group relative overflow-hidden rounded-[1.6rem] border border-[#f1e3dc] bg-[linear-gradient(165deg,#fffdfa_0%,#fff6ef_48%,#fffaf7_100%)] p-3 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:p-4">
        <div aria-hidden className="absolute inset-x-8 top-0 h-24 rounded-full bg-[#ffd9c7]/45 blur-3xl" />
        <div aria-hidden className="absolute -left-10 bottom-2 h-28 w-28 rounded-full bg-[#fff1e7] blur-3xl" />

        <div className="relative overflow-hidden rounded-[1.3rem] border border-white/80 bg-[radial-gradient(circle_at_top,rgba(255,245,238,0.95)_0%,rgba(255,251,247,0.9)_52%,rgba(255,255,255,0.95)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-white/60 to-transparent" />

          <div className="relative aspect-[1.06/1] min-h-[18rem] max-h-[26rem] sm:min-h-[21rem]">
            <ProductImageWithLocalizedAlt
              src={currentImage}
              productName={productName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="cursor-zoom-in object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03] sm:p-5"
              onClick={() => setIsZoomOpen(true)}
            />

            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-3 right-3 z-20 rounded-full border border-white/80 bg-white/92 p-2.5 shadow-[0_10px_22px_rgba(15,23,42,0.12)] opacity-100 transition-all duration-300 hover:scale-105 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Zoom"
            >
              <ZoomIn className="h-5 w-5 text-orange-600" />
            </button>
          </div>
        </div>
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border bg-white p-1.5 shadow-sm transition-all ${
                selectedIndex === index
                  ? 'border-orange-300 ring-2 ring-orange-200 shadow-[0_10px_22px_rgba(238,49,36,0.12)]'
                  : 'border-[#eee2db] hover:-translate-y-0.5 hover:border-orange-200'
              }`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#fff8f3]">
                <Image
                  src={src}
                  alt={`${altText} ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {isZoomOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 animate-zoom-backdrop"
            style={{
              background:
                'radial-gradient(ellipse 90% 90% at 50% 45%, rgba(40, 18, 18, 0.92) 0%, rgba(20, 8, 8, 0.96) 40%, rgba(12, 4, 4, 0.98) 70%, rgba(5, 2, 2, 0.99) 100%)',
              backdropFilter: 'blur(16px)',
            }}
            role="dialog"
            aria-modal
            aria-label="Zoomed image"
            onClick={handleClose}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 transition-all duration-200 hover:bg-white/25"
              aria-label="Close zoom"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            <div
              className="relative flex max-h-[85vh] w-full max-w-2xl flex-col items-center overflow-y-auto animate-zoom-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[60vh] min-h-[200px] w-full flex-shrink-0 overflow-hidden rounded-2xl bg-white/5 shadow-2xl ring-1 ring-white/20 aspect-square">
                <Image
                  src={currentImage}
                  alt={altText}
                  fill
                  sizes="(max-width: 896px) 100vw, 672px"
                  className="object-contain p-2"
                  priority
                />
              </div>

              <div className="mt-4 max-w-full flex-shrink-0 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="truncate text-center text-lg font-semibold text-white" title={altText}>
                  {altText}
                </p>
                {displayImages.length > 1 && (
                  <p className="mt-1 text-center text-sm text-white/70">
                    {selectedIndex + 1} / {displayImages.length}
                  </p>
                )}
              </div>
            </div>

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  className="absolute left-2 top-1/2 z-10 rounded-full bg-white/10 p-3 transition-all duration-200 hover:bg-white/25 sm:left-4"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="absolute right-2 top-1/2 z-10 rounded-full bg-white/10 p-3 transition-all duration-200 hover:bg-white/25 sm:right-4"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
