import type { AppLocale } from './types'

/**
 * DB `category.name` values (admin) → display labels (Armenian).
 * Unknown names pass through unchanged.
 */
const CATEGORY_LABELS: Record<string, string> = {
  Пиде: 'Պիդե',
  Комбо: 'Կոմբո',
  Снэк: 'Սնաք',
  Соусы: 'Սոուսներ',
  Напитки: 'Ըմպելիքներ',
}

export function getCategoryDisplayName(
  apiName: string | null | undefined,
  _locale: AppLocale
): string {
  if (apiName == null || apiName === '') {
    return ''
  }
  return CATEGORY_LABELS[apiName] ?? apiName
}
