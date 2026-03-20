import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setUTCHours(0, 0, 0, 0)
  return x
}

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = x.getUTCDay()
  const diff = day === 0 ? 6 : day - 1
  x.setUTCDate(x.getUTCDate() - diff)
  x.setUTCHours(0, 0, 0, 0)
  return x
}

function startOfMonth(d: Date): Date {
  const x = new Date(d)
  x.setUTCDate(1)
  x.setUTCHours(0, 0, 0, 0)
  return x
}

function subDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setUTCDate(x.getUTCDate() - n)
  return x
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = startOfWeek(now)
    const monthStart = startOfMonth(now)
    const last30Days = subDays(now, 30)

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenueAgg,
      ordersByStatus,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      orderItemsGrouped,
      newCustomersCount,
      usersWithOrders
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true }
      }),
      prisma.user.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.order.findMany({
        where: { userId: { not: null } },
        select: { userId: true, total: true }
      })
    ])

    const totalRevenue = totalRevenueAgg._sum.total ?? 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const statusMap: Record<string, number> = {}
    ordersByStatus.forEach((g) => {
      statusMap[g.status] = g._count.id
    })

    const productIds = orderItemsGrouped.map((g) => g.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    })
    const productNameMap = Object.fromEntries(products.map((p) => [p.id, p.name]))

    const salesByProduct = orderItemsGrouped
      .map((g) => ({
        productId: g.productId,
        name: productNameMap[g.productId] ?? g.productId,
        totalQuantity: g._sum.quantity ?? 0
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)

    const top5BestSelling = salesByProduct.slice(0, 5)
    const leastSelling = salesByProduct.slice(-5).reverse()

    const userSpend: Record<string, { total: number; orders: number }> = {}
    usersWithOrders.forEach((o) => {
      if (!o.userId) return
      if (!userSpend[o.userId]) userSpend[o.userId] = { total: 0, orders: 0 }
      userSpend[o.userId].total += o.total
      userSpend[o.userId].orders += 1
    })
    const userIds = Object.keys(userSpend)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true }
    })
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]))
    const topCustomersBySpend = userIds
      .map((id) => ({
        userId: id,
        name: userMap[id]?.name ?? userMap[id]?.email ?? id,
        totalSpend: userSpend[id].total,
        orderCount: userSpend[id].orders
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 5)

    const repeatOrderUserIds = userIds.filter((id) => userSpend[id].orders > 1)
    const repeatOrdersCount = repeatOrderUserIds.length

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      averageOrderValue,
      pendingOrders: statusMap.PENDING ?? 0,
      completedOrders: statusMap.DELIVERED ?? 0,
      ordersByStatus: statusMap,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      top5BestSelling,
      leastSelling,
      newCustomersCount,
      repeatOrdersCount,
      topCustomersBySpend
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
