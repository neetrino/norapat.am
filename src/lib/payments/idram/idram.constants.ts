/** Idram GetPayment endpoint (test and production). */
export const IDRAM_GET_PAYMENT_URL =
  'https://banking.idram.am/Payment/GetPayment' as const

/** Float comparison tolerance for AMD totals vs Idram EDP_AMOUNT. */
export const IDRAM_AMOUNT_TOLERANCE = 0.01
