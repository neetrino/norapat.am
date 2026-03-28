import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [categories, allProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        image: true,
        category: { select: { id: true, name: true } },
      },
      orderBy: { name: 'asc' },
    }),
  ])

  return NextResponse.json({ categories, allProducts })
}
