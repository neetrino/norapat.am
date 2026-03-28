import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { action } = await request.json()

  if (action === 'toggle') {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { deletedAt: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { deletedAt: user.deletedAt ? null : new Date() },
      select: { id: true, deletedAt: true },
    })

    return NextResponse.json({ success: true, isActive: !updated.deletedAt })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
