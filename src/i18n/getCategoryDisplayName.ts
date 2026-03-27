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
}

export function getCategoryDisplayName(
  apiName: string | null | undefined,
  locale: AppLocale
): string {
  void locale
  if (apiName == null || apiName === '') {
    return ''
  }
  return CATEGORY_LABELS[apiName] ?? apiName
}
