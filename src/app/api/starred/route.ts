import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const productId = body?.productId
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'productId required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.starredItem.upsert({
      where: {
        userId_productId: { userId: session.user.id, productId },
      },
      create: { userId: session.user.id, productId },
      update: {},
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Starred POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 })
    }

    await prisma.starredItem.deleteMany({
      where: { userId: session.user.id, productId },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Starred DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
