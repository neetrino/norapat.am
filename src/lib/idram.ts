/**
 * Idram payment integration (EDP API)
 * Docs: Idram merchant API, RESULT_URL for server callback
 */

import crypto from 'crypto'

const IDRAM_PAYMENT_URL = process.env.IDRAM_PAYMENT_URL || 'https://bank.idram.am/payment/'

export interface IdramPaymentParams {
  /** Order ID (EDP_BILL_NO) - unique per order */
  billNo: string
  /** Amount in AMD */
  amount: number
  /** Customer email (optional) */
  email?: string
  /** Order description */
  description?: string
  /** Language: AM, EN, RU */
  language?: 'AM' | 'EN' | 'RU'
  /** URL after successful payment */
  successUrl: string
  /** URL after failed/cancelled payment */
  failUrl: string
}

/**
 * Build Idram payment form params for redirect
 */
export function buildIdramPaymentParams(params: IdramPaymentParams): Record<string, string> {
  const edpRecAccount = process.env.IDRAM_EDP_REC_ACCOUNT
  if (!edpRecAccount) {
    throw new Error('IDRAM_EDP_REC_ACCOUNT is not configured')
  }

  return {
    EDP_REC_ACCOUNT: edpRecAccount,
    EDP_BILL_NO: params.billNo,
    EDP_AMOUNT: String(Math.round(params.amount)),
    EDP_LANGUAGE: params.language || 'AM',
    EDP_DESCRIPTION: params.description || `Order ${params.billNo}`,
    EDP_EMAIL: params.email || '',
    SUCCESS_URL: params.successUrl,
    FAIL_URL: params.failUrl
  }
}

/**
 * Get Idram payment redirect URL (for form POST target)
 */
export function getIdramPaymentUrl(): string {
  return IDRAM_PAYMENT_URL
}

/**
 * Verify Idram payment confirmation checksum (RESULT_URL callback)
 * Checksum: md5(EDP_REC_ACCOUNT:EDP_AMOUNT:SECRET:EDP_BILL_NO:EDP_PAYER_ACCOUNT:EDP_TRANS_ID:EDP_TRANS_DATE)
 */
export function verifyIdramChecksum(params: {
  edpRecAccount: string
  edpAmount: string
  edpBillNo: string
  edpPayerAccount: string
  edpTransId: string
  edpTransDate: string
  edpChecksum: string
}): boolean {
  const secret = process.env.IDRAM_SECRET_KEY
  if (!secret) return false

  const txtToHash = [
    params.edpRecAccount,
    params.edpAmount,
    secret,
    params.edpBillNo,
    params.edpPayerAccount,
    params.edpTransId,
    params.edpTransDate
  ].join(':')

  const computed = crypto.createHash('md5').update(txtToHash).digest('hex').toUpperCase()
  return computed === (params.edpChecksum || '').toUpperCase()
}

export function isIdramConfigured(): boolean {
  return Boolean(
    process.env.IDRAM_EDP_REC_ACCOUNT &&
    process.env.IDRAM_SECRET_KEY
  )
}
