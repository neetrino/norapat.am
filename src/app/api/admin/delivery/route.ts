import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  DELIVERY_RATES_SETTINGS_KEY,
  parseDeliveryRates,
  serializeDeliveryRates,
  sanitizeDeliveryRates,
} from '@/lib/deliveryRates'

async function ensureAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return session
}

export async function GET() {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const setting = await prisma.settings.findUnique({
      where: { key: DELIVERY_RATES_SETTINGS_KEY },
      select: { value: true },
    })

    return NextResponse.json({ rates: parseDeliveryRates(setting?.value) })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = (await request.json()) as { rates?: unknown }
    const rates = sanitizeDeliveryRates(json.rates)

    await prisma.settings.upsert({
      where: { key: DELIVERY_RATES_SETTINGS_KEY },
      update: { value: serializeDeliveryRates(rates) },
      create: {
        key: DELIVERY_RATES_SETTINGS_KEY,
        value: serializeDeliveryRates(rates),
      },
    })

    return NextResponse.json({ rates })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
