import type { ArcaCredentials } from './arca.config'
import { ARCA_CURRENCY_AMD } from './arca.constants'

// ─── Register Order ────────────────────────────────────────────────────────────

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
  /** ISO 639-1 language code: 'am', 'en', 'ru' */
  language?: string
}

type RegisterOrderResult = {
  /** Arca's internal order UUID — used for status queries */
  arcaOrderId: string
  /** URL to redirect the user's browser to for payment */
  formUrl: string
}

/**
 * Registers a new order with the Arca payment gateway.
 * Corresponds to POST /payment/rest/register.do
 * Docs: section 7.1.1
 */
export async function arcaRegisterOrder(
  params: RegisterOrderParams
): Promise<RegisterOrderResult> {
  // Arca expects amount in minimum currency units (lumas for AMD: 1 AMD = 100 lumas)
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
  })

  const url = `${params.baseUrl}/register.do`
  let response: Response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: body.toString(),
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
    throw new Error(
      'Arca register.do: response missing orderId or formUrl'
    )
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
