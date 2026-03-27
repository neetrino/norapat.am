import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await _request.json()

    const updateData: {
      title?: string
      description?: string | null
      image?: string
      linkType?: 'NONE' | 'PRODUCT' | 'CATEGORY' | 'URL'
      linkValue?: string | null
      startDate?: Date
      endDate?: Date
      isActive?: boolean
      sortOrder?: number
    } = {}
    if (typeof body.title === 'string') updateData.title = body.title.trim()
    if (typeof body.description === 'string')
      updateData.description = body.description.trim() || null
    if (typeof body.image === 'string') updateData.image = body.image.trim()
    if (['NONE', 'PRODUCT', 'CATEGORY', 'URL'].includes(body.linkType))
      updateData.linkType = body.linkType
    if (updateData.linkType !== undefined && updateData.linkType !== 'NONE') {
      updateData.linkValue =
        typeof body.linkValue === 'string' ? body.linkValue.trim() : null
    } else if (updateData.linkType === 'NONE') {
      updateData.linkValue = null
    }
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)
    if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive
    if (typeof body.sortOrder === 'number') updateData.sortOrder = body.sortOrder

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(campaign)
  } catch (error) {
    console.error('[api/admin/campaigns] PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.campaign.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[api/admin/campaigns] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
