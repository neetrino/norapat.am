import { getIdramCredentials } from '@/lib/payments/idram/idram.config'
import { runIdramConfirm } from '@/lib/payments/idram/idram.confirm'
import { runIdramPrecheck } from '@/lib/payments/idram/idram.precheck'

/**
 * Routes Idram RESULT_URL POST to precheck or payment confirmation.
 */
export async function processIdramResult(
  fields: Record<string, string>
): Promise<string> {
  const credentials = getIdramCredentials()

  const precheckRaw = fields.EDP_PRECHECK?.trim().toUpperCase() ?? ''
  if (precheckRaw === 'YES') {
    return runIdramPrecheck({
      credentials,
      billNo: fields.EDP_BILL_NO ?? '',
      recAccount: fields.EDP_REC_ACCOUNT ?? '',
      amount: fields.EDP_AMOUNT ?? '',
    })
  }

  const checksum = fields.EDP_CHECKSUM?.trim() ?? ''
  if (checksum.length > 0) {
    return runIdramConfirm({
      credentials,
      billNo: fields.EDP_BILL_NO ?? '',
      recAccount: fields.EDP_REC_ACCOUNT ?? '',
      payerAccount: fields.EDP_PAYER_ACCOUNT ?? '',
      amount: fields.EDP_AMOUNT ?? '',
      transId: fields.EDP_TRANS_ID ?? '',
      transDate: fields.EDP_TRANS_DATE ?? '',
      checksum,
    })
  }

  return 'Unknown Idram callback'
}
