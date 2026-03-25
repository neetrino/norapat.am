import type { CategoryWithCount } from '@/types'

/**
 * `/products` խմբավորված ցուցակում կատեգորիայի բաժնի HTML id (hash հղումների համար)
 */
export function getMenuCategorySectionId(categoryName: string): string {
  const bytes = new TextEncoder().encode(categoryName)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }
  const base64 =
    typeof globalThis.btoa === 'function'
      ? globalThis.btoa(binary)
      : Buffer.from(bytes).toString('base64')
  const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `mc-${urlSafe}`
}

/** Նույն սեմանտիկ խումբ (ըմպելիքներ) — տարբեր լեզուներով DB անուններ */
const DRINKS_ALIASES = ['Ըմպելիքներ', 'Напитки', 'Drinks'] as const

function isDrinksAlias(name: string): boolean {
  return (DRINKS_ALIASES as readonly string[]).includes(name)
}

/**
 * Կատեգորիաների ցուցակից մեկ «ըմպելիքներ» տող (ընտրությունը՝ hy → ru → en)
 */
export function dedupeCategoriesForNav(categories: CategoryWithCount[]): CategoryWithCount[] {
  const drinksRows = categories.filter((c) => isDrinksAlias(c.name))
  if (drinksRows.length <= 1) {
    return categories
  }

  const canonical =
    drinksRows.find((c) => c.name === 'Ըմպելիքներ') ??
    drinksRows.find((c) => c.name === 'Напитки') ??
    drinksRows[0]

  const result: CategoryWithCount[] = []
  let drinksInserted = false

  for (const c of categories) {
    if (!isDrinksAlias(c.name)) {
      result.push(c)
      continue
    }
    if (!drinksInserted) {
      result.push(canonical)
      drinksInserted = true
    }
  }

  return result
}

/**
 * Ակտիվ pill-ի համար — նույն DB անուն կամ նույն «ըմպելիքներ» խումբ
 */
export function isSameCategoryNavSelection(
  activeCategory: string | undefined,
  pillCategoryName: string
): boolean {
  if (activeCategory == null || activeCategory === '') {
    return false
  }
  if (activeCategory === pillCategoryName) {
    return true
  }
  return isDrinksAlias(activeCategory) && isDrinksAlias(pillCategoryName)
}

/**
 * Ապրանքների ֆիլտր — ընտրած կատեգորիան համընկնում է ապրանքի կատեգորիայի հետ (ներառյալ ըմպելիքների ալիասներ)
 */
export function productMatchesCategoryFilter(
  activeCategory: string,
  productCategoryName: string | null | undefined
): boolean {
  if (productCategoryName == null || productCategoryName === '') {
    return false
  }
  if (activeCategory === productCategoryName) {
    return true
  }
  return isDrinksAlias(activeCategory) && isDrinksAlias(productCategoryName)
}
