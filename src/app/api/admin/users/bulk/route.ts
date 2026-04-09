import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MAX_BULK_IDS = 100

const bulkBodySchema = z.object({
  action: z.enum(['activate', 'deactivate', 'delete']),
  ids: z.array(z.string().min(1)).min(1).max(MAX_BULK_IDS),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const adminId = session.user.id
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let parsed: z.infer<typeof bulkBodySchema>
  try {
    const json: unknown = await request.json()
    parsed = bulkBodySchema.parse(json)
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const uniqueIds = [...new Set(parsed.ids.filter((id) => id !== adminId))]
  if (uniqueIds.length === 0) {
    return NextResponse.json({ error: 'No valid targets' }, { status: 400 })
  }

  const { action } = parsed

  if (action === 'activate') {
    const result = await prisma.user.updateMany({
      where: { id: { in: uniqueIds } },
      data: { deletedAt: null },
    })
    return NextResponse.json({ success: true, count: result.count })
  }

  if (action === 'deactivate') {
    const result = await prisma.user.updateMany({
      where: { id: { in: uniqueIds } },
      data: { deletedAt: new Date() },
    })
    return NextResponse.json({ success: true, count: result.count })
  }

  const count = await prisma.$transaction(async (tx) => {
    const usersToRemove = await tx.user.findMany({
      where: { id: { in: uniqueIds }, role: 'USER' },
      select: { id: true },
    })
    const idsToRemove = usersToRemove.map((u) => u.id)
    if (idsToRemove.length === 0) {
      return 0
    }
    await tx.order.updateMany({
      where: { userId: { in: idsToRemove } },
      data: { userId: null },
    })
    const deleted = await tx.user.deleteMany({
      where: { id: { in: idsToRemove } },
    })
    return deleted.count
  })

  return NextResponse.json({ success: true, count })
}
