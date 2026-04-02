import { IDRAM_AMOUNT_TOLERANCE } from '@/lib/payments/idram/idram.constants'

/** Idram expects dot as decimal separator; amounts sent as strings. */
export function formatOrderTotalForIdram(total: number): string {
  return total.toFixed(2)
}

export function idramAmountMatchesOrder(
  orderTotal: number,
  edpAmount: string
): boolean {
  const normalized = edpAmount.trim().replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  if (Number.isNaN(parsed)) {
    return false
  }
  return Math.abs(orderTotal - parsed) < IDRAM_AMOUNT_TOLERANCE
}
