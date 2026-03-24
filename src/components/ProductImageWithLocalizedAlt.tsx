'use client'

import Image, { type ImageProps } from 'next/image'
import { useI18n } from '@/i18n/I18nContext'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'

type ProductImageWithLocalizedAltProps = Omit<ImageProps, 'alt'> & {
  productName: string
}

/**
 * Next/Image with `alt` from localized product title (DB name is Russian).
 */
export function ProductImageWithLocalizedAlt({
  productName,
  ...props
}: ProductImageWithLocalizedAltProps) {
  const { locale } = useI18n()
  return (
    <Image {...props} alt={getProductDisplayName(productName, locale)} />
  )
}
