/** HTTP timeout for Arca REST calls (register.do, getOrderStatusExtended.do) */
export const ARCA_HTTP_TIMEOUT_MS = 25_000 as const

/** Delay before one retry when order is still in ACS (3DS) */
export const ARCA_ACS_RETRY_DELAY_MS = 2_000 as const

/** Arca (Armenian Card) vPOS — REST API base URLs */
export const ARCA_TEST_BASE_URL =
  'https://ipaytest.arca.am:8445/payment/rest' as const

export const ARCA_LIVE_BASE_URL =
  'https://ipay.arca.am/payment/rest' as const

/** ISO 4217 currency code for Armenian Dram */
export const ARCA_CURRENCY_AMD = '051' as const

/**
 * orderStatus values returned by getOrderStatusExtended.do
 * Docs section 7.1.5
 */
export const ARCA_ORDER_STATUS = {
  /** Order registered but not paid */
  REGISTERED: 0,
  /** Funds held on card (two-stage pre-authorization) */
  HELD: 1,
  /** Full payment authorization completed (paid) */
  DEPOSITED: 2,
  /** Authorization cancelled */
  CANCELLED: 3,
  /** Refund processed */
  REFUNDED: 4,
  /** ACS authentication initiated (3DS in progress) */
  ACS_AUTH: 5,
  /** Authorization declined */
  DECLINED: 6,
} as const
