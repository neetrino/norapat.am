import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/** Ապրանքի «հիթ/նոր/կլասիկ» կարգավիճակը սահմանվում է միայն ադմինից (Product.status)։ */
const STARRED_MUTATIONS_DISABLED_MESSAGE =
  'Starred highlights are disabled; set product status in the admin panel.'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ productIds: [] })
    }

    const items = await prisma.starredItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    })
    const productIds = items.map((i) => i.productId)
    return NextResponse.json({ productIds })
  } catch (error) {
    console.error('Starred GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ error: STARRED_MUTATIONS_DISABLED_MESSAGE }, { status: 403 })
}

export async function DELETE() {
  return NextResponse.json({ error: STARRED_MUTATIONS_DISABLED_MESSAGE }, { status: 403 })
}
