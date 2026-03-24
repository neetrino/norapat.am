import type { AppLocale } from './types'

/**
 * Category name → display (Armenian). Armenian names pass through.
 */
const CATEGORY_LABELS: Record<string, string> = {
  Պիդե: 'Պիդե',
  Կոմբո: 'Կոմբո',
  Սնաք: 'Սնաք',
  Սոուսներ: 'Սոուսներ',
  Ըմպելիքներ: 'Ըմպելիքներ',
  // Legacy Russian (if any)
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
