import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/promo/validate
 * Body: { code: string, total: number }
 * Returns: { valid: boolean, discountAmount?: number, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
    const total = typeof body.total === 'number' ? body.total : 0

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Մուտքագրեք պրոմո կոդ' },
        { status: 400 }
      )
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code, isActive: true }
    })

    if (!promo) {
      return NextResponse.json(
        { valid: false, message: 'Պրոմո կոդը չի գտնվել' }
      )
    }

    const now = new Date()
    if (promo.validFrom && now < promo.validFrom) {
      return NextResponse.json(
        { valid: false, message: 'Պրոմո կոդը դեռ չի գործում' }
      )
    }
    if (promo.validUntil && now > promo.validUntil) {
      return NextResponse.json(
        { valid: false, message: 'Պրոմո կոդի ժամկետը լրացել է' }
      )
    }
    if (promo.maxUses != null && promo.usedCount >= promo.maxUses) {
      return NextResponse.json(
        { valid: false, message: 'Պրոմո կոդի օգտագործումները սպառվել են' }
      )
    }
    if (promo.minOrderAmount != null && total < promo.minOrderAmount) {
      return NextResponse.json(
        { valid: false, message: `Նվազագույն պատվեր ${promo.minOrderAmount} ֏` }
      )
    }

    let discountAmount = 0
    if (promo.discountPercent != null && promo.discountPercent > 0) {
      discountAmount = Math.round((total * promo.discountPercent) / 100)
    } else if (promo.discountAmount != null && promo.discountAmount > 0) {
      discountAmount = promo.discountAmount
    }
    if (discountAmount > total) discountAmount = total

    return NextResponse.json({
      valid: true,
      discountAmount,
      message: discountAmount > 0 ? `Զեղչ ${discountAmount} ֏` : ''
    })
  } catch (error) {
    console.error('Promo validate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
