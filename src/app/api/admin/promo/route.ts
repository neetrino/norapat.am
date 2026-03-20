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

    const list = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(list)
  } catch (error) {
    console.error('Admin promo list error:', error)
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
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const existing = await prisma.promoCode.findUnique({ where: { code } })
    if (existing) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 })
    }

    const promo = await prisma.promoCode.create({
      data: {
        code,
        discountPercent: body.discountPercent ?? null,
        discountAmount: body.discountAmount ?? null,
        minOrderAmount: body.minOrderAmount ?? null,
        maxUses: body.maxUses ?? null,
        validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
        validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
        isActive: body.isActive !== false
      }
    })
    return NextResponse.json(promo, { status: 201 })
  } catch (error) {
    console.error('Admin promo create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
