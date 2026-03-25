import type { Product } from '@/types'

/**
 * GET /api/products — առանց `limit` վերադարձնում է զանգված, `limit`-ով՝ `{ items, total, ... }`։
 */
export function parseProductsListResponse(data: unknown): { items: Product[]; total: number } {
  if (Array.isArray(data)) {
    const items = data as Product[]
    return { items, total: items.length }
  }
  if (
    data &&
    typeof data === 'object' &&
    'items' in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    const items = (data as { items: Product[] }).items
    const rawTotal = (data as { total?: unknown }).total
    const total = typeof rawTotal === 'number' ? rawTotal : items.length
    return { items, total }
  }
  return { items: [], total: 0 }
}
