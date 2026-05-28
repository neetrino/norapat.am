import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DELIVERY_RATES_SETTINGS_KEY, parseDeliveryRates } from '@/lib/deliveryRates'

const CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=120'

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: DELIVERY_RATES_SETTINGS_KEY },
      select: { value: true },
    })

    return NextResponse.json(
      { rates: parseDeliveryRates(setting?.value) },
      { headers: { 'Cache-Control': CACHE_CONTROL } }
    )
  } catch {
    return NextResponse.json(
      { rates: [] },
      { headers: { 'Cache-Control': CACHE_CONTROL } }
    )
  }
}
