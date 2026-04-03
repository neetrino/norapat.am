import { prisma } from '@/lib/prisma'
import type { IdramCredentials } from '@/lib/payments/idram/idram.config'
import {
  computeIdramChecksum,
  idramChecksumsMatch,
} from '@/lib/payments/idram/idram.checksum'
import { idramAmountMatchesOrder } from '@/lib/payments/idram/formatIdramAmount'

type ConfirmInput = {
  credentials: IdramCredentials
  billNo: string
  recAccount: string
  payerAccount: string
  amount: string
  transId: string
  transDate: string
  checksum: string
}

/**
 * Payment confirmation (b): verify checksum and totals; update order; respond "OK".
 */
export async function runIdramConfirm(
  input: ConfirmInput
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

  const computed = computeIdramChecksum({
    credentials: input.credentials,
    edpBillNo: input.billNo.trim(),
    edpPayerAccount: input.payerAccount.trim(),
    edpTransId: input.transId.trim(),
    edpTransDate: input.transDate.trim(),
    edpAmount: input.amount.trim(),
  })

  if (!idramChecksumsMatch(input.checksum, computed)) {
    return 'EDP_CHECKSUM not correct'
  }

  if (!idramAmountMatchesOrder(order.total, input.amount)) {
    return 'EDP_AMOUNT mismatch'
  }

  if (
    order.idramTransactionId &&
    order.idramTransactionId === input.transId.trim()
  ) {
    return 'OK'
  }

  if (order.idramTransactionId) {
    return 'Order already paid'
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      idramTransactionId: input.transId.trim(),
      idramInitSecret: null,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
  })

  return 'OK'
}
