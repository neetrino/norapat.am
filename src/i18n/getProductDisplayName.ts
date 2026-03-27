import type { AppLocale } from './types'
import { PRODUCT_DISPLAY_NAMES } from './productDisplayNames'

/**
 * Localized product title from DB `product.name` (Russian canonical).
 */
export function getProductDisplayName(
  name: string | null | undefined,
  locale: AppLocale
): string {
  void locale
  if (name == null || name === '') {
    return ''
  }
  return PRODUCT_DISPLAY_NAMES[name] ?? name
}
