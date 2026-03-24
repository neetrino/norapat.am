'use client'

import { useI18n } from '@/i18n/I18nContext'
import { CategoryDisplayName } from '@/components/CategoryDisplayName'

type ProductCategoryLineProps = {
  apiName: string | null | undefined
}

/**
 * Product detail: localized "Category:" + translated category name.
 */
export function ProductCategoryLine({ apiName }: ProductCategoryLineProps) {
  const { t } = useI18n()
  return (
    <li className="flex items-center">
      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
      {t.products.categoryLabel}:{' '}
      <CategoryDisplayName apiName={apiName} />
    </li>
  )
}
