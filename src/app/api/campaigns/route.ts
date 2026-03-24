import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/campaigns
 * Returns active campaigns for home page (current date within startDate–endDate, isActive).
 */
export async function GET() {
  try {
    const now = new Date()
    const campaigns = await prisma.campaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(campaigns)
  } catch (e) {
    console.error('[api/campaigns] GET error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
