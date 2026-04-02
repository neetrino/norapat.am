import type { IdramCredentials } from '@/lib/payments/idram/idram.config'
import { formatOrderTotalForIdram } from '@/lib/payments/idram/formatIdramAmount'

export type IdramLanguageCode = 'EN' | 'AM' | 'RU'

type BuildParams = {
  credentials: IdramCredentials
  orderId: string
  orderTotal: number
  description: string
  language: IdramLanguageCode
  customerEmail?: string | null
}

/**
 * Hidden fields for POST to GetPayment (UTF-8). EDP_BILL_NO = order id (unique bill id).
 */
export function buildIdramFormFields(
  params: BuildParams
): Record<string, string> {
  const fields: Record<string, string> = {
    EDP_LANGUAGE: params.language,
    EDP_REC_ACCOUNT: params.credentials.recAccount,
    EDP_DESCRIPTION: params.description,
    EDP_AMOUNT: formatOrderTotalForIdram(params.orderTotal),
    EDP_BILL_NO: params.orderId,
  }
  if (params.customerEmail?.trim()) {
    fields.EDP_EMAIL = params.customerEmail.trim()
  }
  return fields
}
