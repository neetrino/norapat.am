/**
 * Category `name` from API → static image under /public/categories/.
 */
const CATEGORY_NAV_IMAGE_BY_NAME: Record<string, string> = {
  Pizza: '/categories/pizza.svg',
  Պիցցա: '/categories/pizza.svg',
  Պիդե: '/categories/pide.svg',
  Pide: '/categories/pide.svg',
  Կոմբո: '/categories/combo.svg',
  Combo: '/categories/combo.svg',
  Սնաք: '/categories/snack.svg',
  Սնեք: '/categories/snack.svg',
  Snacks: '/categories/snack.svg',
  Սոուսներ: '/categories/sauce.svg',
  Sauces: '/categories/sauce.svg',
  Ըմպելիքներ: '/categories/drinks.svg',
  Напитки: '/categories/drinks.svg',
  Drinks: '/categories/drinks.svg',
}

/**
 * Returns public URL for category pill icon, or default asset.
 */
export function getCategoryNavImageSrc(categoryName: string): string {
  const trimmed = categoryName.trim()
  return CATEGORY_NAV_IMAGE_BY_NAME[trimmed] ?? '/categories/default.svg'
}
