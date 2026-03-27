'use client'

import { useI18n } from '@/i18n/I18nContext'
import { getProductDisplayName } from '@/i18n/getProductDisplayName'

type ProductDisplayNameProps = {
  name: string
  className?: string
}

/**
 * Localized product name for Server Component parents (detail page, etc.).
 */
export function ProductDisplayName({ name, className }: ProductDisplayNameProps) {
  const { locale } = useI18n()
  return <span className={className}>{getProductDisplayName(name, locale)}</span>
}
