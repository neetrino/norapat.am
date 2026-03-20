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

    const promo = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(body.code !== undefined && { code: String(body.code).trim().toUpperCase() }),
        ...(body.discountPercent !== undefined && { discountPercent: body.discountPercent }),
        ...(body.discountAmount !== undefined && { discountAmount: body.discountAmount }),
        ...(body.minOrderAmount !== undefined && { minOrderAmount: body.minOrderAmount }),
        ...(body.maxUses !== undefined && { maxUses: body.maxUses }),
        ...(body.validFrom !== undefined && { validFrom: body.validFrom ? new Date(body.validFrom) : null }),
        ...(body.validUntil !== undefined && { validUntil: body.validUntil ? new Date(body.validUntil) : null }),
        ...(body.isActive !== undefined && { isActive: !!body.isActive })
      }
    })
    return NextResponse.json(promo)
  } catch (error) {
    console.error('Admin promo update error:', error)
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
    await prisma.promoCode.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin promo delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
