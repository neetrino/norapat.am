'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
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
  const { locale } = useI18n()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

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

      {/* Zoom modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal
          aria-label="Zoomed image"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close zoom"
          >
            <X className="h-8 w-8" />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-square max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage!}
              alt={altText}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-contain"
              onClick={() => setIsZoomOpen(false)}
            />
          </div>

          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <span className="text-3xl">‹</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                aria-label="Next image"
              >
                <span className="text-3xl">›</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
