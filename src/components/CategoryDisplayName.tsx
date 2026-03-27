'use client'

import { useI18n } from '@/i18n/I18nContext'
import { getCategoryDisplayName } from '@/i18n/getCategoryDisplayName'

type CategoryDisplayNameProps = {
  apiName: string | null | undefined
}

/**
 * Client-only: translates DB category name for current locale (e.g. in Server Components).
 */
export function CategoryDisplayName({ apiName }: CategoryDisplayNameProps) {
  const { locale, t } = useI18n()
  const uncategorized = t.productCard.uncategorized
  if (!apiName) {
    return <>{uncategorized}</>
  }
  return <>{getCategoryDisplayName(apiName, locale)}</>
}
