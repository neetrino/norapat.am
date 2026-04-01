/** Sample merchant IdramID from official API docs (HTML examples only). */
export const IDRAM_DOC_SAMPLE_REC_ACCOUNT = '100000114' as const

/** Dev-only stub secret — never valid for real Idram verification. */
export const IDRAM_DEV_STUB_SECRET_PLACEHOLDER =
  'dev-stub-not-for-real-idram-payments' as const

/** Idram GetPayment endpoint (test and production). */
export const IDRAM_GET_PAYMENT_URL =
  'https://banking.idram.am/Payment/GetPayment' as const

/** Float comparison tolerance for AMD totals vs Idram EDP_AMOUNT. */
export const IDRAM_AMOUNT_TOLERANCE = 0.01
