import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface PromoUpdateBody {
  code?: string
  discountPercent?: number | null
  discountAmount?: number | null
  minOrderAmount?: number | null
  maxUses?: number | null
  validFrom?: string | null
  validUntil?: string | null
  isActive?: boolean
}

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
    const body = (await _request.json()) as PromoUpdateBody

    const data: Prisma.PromoCodeUpdateInput = {
      ...(body.code !== undefined && { code: String(body.code).trim().toUpperCase() }),
      ...(body.discountPercent !== undefined && { discountPercent: body.discountPercent }),
      ...(body.discountAmount !== undefined && { discountAmount: body.discountAmount }),
      ...(body.minOrderAmount !== undefined && { minOrderAmount: body.minOrderAmount }),
      ...(body.maxUses !== undefined && { maxUses: body.maxUses }),
      ...(body.validFrom !== undefined && body.validFrom !== null
        ? { validFrom: new Date(body.validFrom) }
        : {}),
      ...(body.validUntil !== undefined
        ? { validUntil: body.validUntil ? new Date(body.validUntil) : null }
        : {}),
      ...(body.isActive !== undefined && { isActive: body.isActive })
    }

    const promo = await prisma.promoCode.update({
      where: { id },
      data
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
