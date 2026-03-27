import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const list = await prisma.campaign.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(list)
  } catch (error) {
    console.error('[api/admin/campaigns] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const image = typeof body.image === 'string' ? body.image.trim() : ''
    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      )
    }

    const linkType = ['NONE', 'PRODUCT', 'CATEGORY', 'URL'].includes(body.linkType)
      ? body.linkType
      : 'NONE'
    const linkValue =
      linkType !== 'NONE' && typeof body.linkValue === 'string'
        ? body.linkValue.trim()
        : null

    const startDate = body.startDate ? new Date(body.startDate) : new Date()
    const endDate = body.endDate ? new Date(body.endDate) : new Date()
    const sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : 0

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description: body.description || null,
        image,
        linkType,
        linkValue,
        startDate,
        endDate,
        isActive: body.isActive !== false,
        sortOrder,
      },
    })
    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('[api/admin/campaigns] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
