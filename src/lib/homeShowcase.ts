import type { ProductStatus } from '@/types'

/** Գլխավոր էջի «հատուկ առաջարկներ» — `page.tsx` / `/api/products?statusIn=...` */
export const HOME_PROMO_STATUSES_ORDERED: readonly ProductStatus[] = ['HIT', 'NEW']
/** Գլխավոր էջի «լավագույն ապրանքներ» — նույն API ֆիլտրը */
export const HOME_BEST_STATUSES_ORDERED: readonly ProductStatus[] = ['HIT', 'NEW', 'CLASSIC']

export const HOME_PROMO_STATUS_IN = HOME_PROMO_STATUSES_ORDERED.join(',')
export const HOME_BEST_STATUS_IN = HOME_BEST_STATUSES_ORDERED.join(',')
