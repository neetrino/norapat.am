import type { AppLocale } from './types'

/**
 * DB `category.name` values (admin) → display labels per locale.
 * Unknown names pass through unchanged.
 */
const CATEGORY_LABELS: Record<string, Record<AppLocale, string>> = {
  Пиде: { hy: 'Պիդե', en: 'Pide', ru: 'Пиде' },
  Комбо: { hy: 'Կոմբո', en: 'Combo', ru: 'Комбо' },
  Снэк: { hy: 'Սնաք', en: 'Snacks', ru: 'Снэк' },
  Соусы: { hy: 'Սոուսներ', en: 'Sauces', ru: 'Соусы' },
  Напитки: { hy: 'Ըմպելիքներ', en: 'Drinks', ru: 'Напитки' },
}

export function getCategoryDisplayName(
  apiName: string | null | undefined,
  locale: AppLocale
): string {
  if (apiName == null || apiName === '') {
    return ''
  }
  const row = CATEGORY_LABELS[apiName]
  return row ? row[locale] : apiName
}
