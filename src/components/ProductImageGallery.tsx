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

/**
 * Product image gallery with thumbnails and zoom modal
 */
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
        className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-2xl text-8xl opacity-70"
        aria-label={altText}
      >
        🥟
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image with zoom trigger */}
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
        <div className="relative aspect-square min-h-[20rem] max-h-96">
          <ProductImageWithLocalizedAlt
            src={currentImage!}
            productName={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
            onClick={() => setIsZoomOpen(true)}
          />
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="absolute bottom-3 right-3 p-2 bg-white/90 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            aria-label="Zoom"
          >
            <ZoomIn className="h-5 w-5 text-orange-600" />
          </button>
        </div>
      </div>

      {/* Thumbnails (only when multiple images) */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-orange-500 ring-2 ring-orange-200'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <Image
                src={src}
                alt={`${altText} ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom modal — портал в body для правильного fixed позиционирования */}
      {isZoomOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 animate-zoom-backdrop"
            style={{
              background: 'radial-gradient(ellipse 90% 90% at 50% 45%, rgba(40, 18, 18, 0.92) 0%, rgba(20, 8, 8, 0.96) 40%, rgba(12, 4, 4, 0.98) 70%, rgba(5, 2, 2, 0.99) 100%)',
              backdropFilter: 'blur(16px)',
            }}
            role="dialog"
            aria-modal
            aria-label="Zoomed image"
            onClick={handleClose}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/25 rounded-full transition-all duration-200"
              aria-label="Close zoom"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Image card container */}
            <div
              className="relative flex flex-col items-center w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-zoom-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image container with subtle frame */}
              <div className="relative w-full aspect-square max-h-[60vh] min-h-[200px] flex-shrink-0 bg-white/5 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <Image
                  src={currentImage!}
                  alt={altText}
                  fill
                  sizes="(max-width: 896px) 100vw, 672px"
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* Product name caption */}
              <div className="mt-4 px-4 py-3 flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-xl max-w-full">
                <p className="text-white text-lg font-semibold text-center truncate" title={altText}>
                  {altText}
                </p>
                {displayImages.length > 1 && (
                  <p className="text-white/70 text-sm text-center mt-1">
                    {selectedIndex + 1} / {displayImages.length}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 rounded-full transition-all duration-200 z-10"
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
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 rounded-full transition-all duration-200 z-10"
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
