import { prisma } from '@/lib/prisma'
import type { IdramCredentials } from '@/lib/payments/idram/idram.config'
import { idramAmountMatchesOrder } from '@/lib/payments/idram/formatIdramAmount'

type PrecheckInput = {
  credentials: IdramCredentials
  billNo: string
  recAccount: string
  amount: string
}

/**
 * Precheck (a): validate order from DB; plain-text response must be exactly "OK".
 */
export async function runIdramPrecheck(
  input: PrecheckInput
): Promise<string> {
  if (input.recAccount.trim() !== input.credentials.recAccount) {
    return 'EDP_REC_ACCOUNT mismatch'
  }

  const order = await prisma.order.findUnique({
    where: { id: input.billNo.trim() },
  })

  if (!order) {
    return 'Order not found'
  }

  if (order.paymentMethod !== 'idram') {
    return 'Invalid payment method'
  }

  if (order.idramTransactionId) {
    return 'OK'
  }

  if (!idramAmountMatchesOrder(order.total, input.amount)) {
    return 'EDP_AMOUNT mismatch'
  }

  if (order.status === 'CANCELLED') {
    return 'Order cancelled'
  }

  return 'OK'
}
