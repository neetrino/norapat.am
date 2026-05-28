export interface DeliveryRate {
  city: string
  fee: number
}

export const DELIVERY_RATES_SETTINGS_KEY = 'deliveryRates'

function normalizeCity(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

function normalizeFee(value: unknown): number | null {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return null
  }

  if (value < 0) {
    return null
  }

  return Math.round(value)
}

export function sanitizeDeliveryRates(value: unknown): DeliveryRate[] {
  if (!Array.isArray(value)) {
    return []
  }

  const uniqueCities = new Set<string>()
  const rates: DeliveryRate[] = []

  for (const row of value) {
    if (!row || typeof row !== 'object') {
      continue
    }

    const city = normalizeCity((row as { city?: unknown }).city)
    const fee = normalizeFee((row as { fee?: unknown }).fee)

    if (!city || fee === null) {
      continue
    }

    const cityKey = city.toLocaleLowerCase('hy-AM')
    if (uniqueCities.has(cityKey)) {
      continue
    }

    uniqueCities.add(cityKey)
    rates.push({ city, fee })
  }

  return rates.sort((a, b) => a.city.localeCompare(b.city, 'hy-AM'))
}

export function parseDeliveryRates(value: string | null | undefined): DeliveryRate[] {
  if (!value) {
    return []
  }

  try {
    return sanitizeDeliveryRates(JSON.parse(value))
  } catch {
    return []
  }
}

export function serializeDeliveryRates(rates: DeliveryRate[]): string {
  return JSON.stringify(sanitizeDeliveryRates(rates))
}
