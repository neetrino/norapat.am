import type { ArcaCredentials } from './arca.config'
import {
  ARCA_ACS_RETRY_DELAY_MS,
  ARCA_CURRENCY_AMD,
  ARCA_HTTP_TIMEOUT_MS,
  ARCA_ORDER_STATUS,
} from './arca.constants'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function arcaFetchSignal(): AbortSignal {
  return AbortSignal.timeout(ARCA_HTTP_TIMEOUT_MS)
}

// ─── Register Order ────────────────────────────────────────────────────────────

export type ArcaPageView = 'MOBILE' | 'DESKTOP'

type RegisterOrderParams = {
  credentials: ArcaCredentials
  baseUrl: string
  /** Our internal order ID (up to 32 chars) */
  orderNumber: string
  /** Total in AMD (will be converted to lumas: 1 AMD = 100 lumas) */
  amountAmd: number
  /** URL Arca redirects the user to after payment (success or fail) */
  returnUrl: string
  /** Short description shown on payment page (max 99 chars) */
  description: string
  /** ISO 639-1 language code (manual §7.1.1) */
  language?: 'hy' | 'en' | 'ru'
  /** Hosted payment page layout (manual §7.1.1) */
  pageView?: ArcaPageView
}

type RegisterOrderResult = {
  /** Arca's internal order UUID — used for status queries */
  arcaOrderId: string
  /** URL to redirect the user's browser to for payment */
  formUrl: string
}

const REGISTER_JSON_PARAMS = JSON.stringify({ FORCE_3DS2: 'true' })

/**
 * Registers a new order with the Arca payment gateway.
 * Corresponds to POST /payment/rest/register.do
 * Docs: section 7.1.1
 */
export async function arcaRegisterOrder(
  params: RegisterOrderParams
): Promise<RegisterOrderResult> {
  const amountLumas = Math.round(params.amountAmd * 100)

  const body = new URLSearchParams({
    userName: params.credentials.userName,
    password: params.credentials.password,
    orderNumber: params.orderNumber,
    amount: amountLumas.toString(),
    currency: ARCA_CURRENCY_AMD,
    returnUrl: params.returnUrl,
    description: params.description.slice(0, 99),
    language: params.language ?? 'en',
    jsonParams: REGISTER_JSON_PARAMS,
  })

  if (params.pageView) {
    body.set('pageView', params.pageView)
  }

  const url = `${params.baseUrl}/register.do`
  let response: Response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body.toString(),
      signal: arcaFetchSignal(),
    })
  } catch (err) {
    throw new Error(
      `Arca register.do network error: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  if (!response.ok) {
    throw new Error(`Arca register.do HTTP ${response.status} ${response.statusText}`)
  }

  let data: {
    orderId?: string
    formUrl?: string
    errorCode?: string | number
    errorMessage?: string
  }

  try {
    data = await response.json()
  } catch {
    throw new Error('Arca register.do: invalid JSON response')
  }

  const errorCode = data.errorCode !== undefined ? Number(data.errorCode) : null

  if (errorCode !== null && errorCode !== 0) {
    throw new Error(
      `Arca registration failed (errorCode=${errorCode}): ${data.errorMessage ?? 'unknown error'}`
    )
  }

  if (!data.orderId || !data.formUrl) {
    throw new Error('Arca register.do: response missing orderId or formUrl')
  }

  return {
    arcaOrderId: data.orderId,
    formUrl: data.formUrl,
  }
}

// ─── Get Order Status ─────────────────────────────────────────────────────────

type GetOrderStatusParams = {
  credentials: ArcaCredentials
  baseUrl: string
  /** Arca's internal order UUID (returned from register.do) */
  arcaOrderId: string
}

type GetOrderStatusResult = {
  /**
   * Numeric status (see ARCA_ORDER_STATUS constants):
   *   0 = registered (not paid)
   *   1 = held (two-stage)
   *   2 = deposited (paid)
   *   3 = cancelled
   *   4 = refunded
   *   5 = ACS auth in progress
   *   6 = declined
   *  -1 = unknown/missing
   */
  orderStatus: number
  errorCode: number
  errorMessage?: string
}

/**
 * Queries the extended status of an order from Arca.
 * Corresponds to POST /payment/rest/getOrderStatusExtended.do
 * Docs: section 7.1.5
 */
export async function arcaGetOrderStatus(
  params: GetOrderStatusParams
): Promise<GetOrderStatusResult> {
  const body = new URLSearchParams({
    userName: params.credentials.userName,
    password: params.credentials.password,
    orderId: params.arcaOrderId,
    language: 'en',
  })

  const url = `${params.baseUrl}/getOrderStatusExtended.do`
  let response: Response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body.toString(),
      signal: arcaFetchSignal(),
    })
  } catch (err) {
    throw new Error(
      `Arca getOrderStatusExtended.do network error: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  if (!response.ok) {
    throw new Error(
      `Arca getOrderStatusExtended.do HTTP ${response.status} ${response.statusText}`
    )
  }

  let data: {
    orderStatus?: number
    errorCode?: number
    errorMessage?: string
  }

  try {
    data = await response.json()
  } catch {
    throw new Error('Arca getOrderStatusExtended.do: invalid JSON response')
  }

  return {
    orderStatus: data.orderStatus ?? -1,
    errorCode: data.errorCode ?? -1,
    errorMessage: data.errorMessage,
  }
}

/**
 * Fetches status; if still ACS (3DS in progress), waits and polls once more.
 */
export async function arcaGetOrderStatusWithAcsRetry(
  params: GetOrderStatusParams
): Promise<GetOrderStatusResult> {
  let result = await arcaGetOrderStatus(params)
  if (result.orderStatus === ARCA_ORDER_STATUS.ACS_AUTH) {
    await sleep(ARCA_ACS_RETRY_DELAY_MS)
    result = await arcaGetOrderStatus(params)
  }
  return result
}
