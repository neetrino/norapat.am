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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const todayStart = startOfDay(now)
    const yesterdayStart = subDays(todayStart, 1)
    const weekStart = startOfWeek(now)
    const lastWeekStart = subDays(weekStart, 7)
    const monthStart = startOfMonth(now)
    const lastMonthStart = startOfMonth(subDays(monthStart, 1))
    const last30DaysStart = subDays(todayStart, 29)

    // Fetch all needed data in parallel
    const [
      revenueToday,
      revenueYesterday,
      revenueThisWeek,
      revenueLastWeek,
      revenueThisMonth,
      revenueLastMonth,
      revenueTotal,
      ordersToday,
      ordersYesterday,
      ordersThisWeek,
      ordersLastWeek,
      ordersThisMonth,
      ordersLastMonth,
      ordersTotal,
      ordersByStatus,
      ordersByPayment,
      last30DaysOrders,
      topProductItems,
      topCustomerOrders,
      newUsersThisMonth,
      newUsersLastMonth,
    ] = await Promise.all([
      // Revenue by period
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: todayStart } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: weekStart } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: lastWeekStart, lt: weekStart } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: monthStart } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: lastMonthStart, lt: monthStart } } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      // Order counts by period
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
      prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.order.count({ where: { createdAt: { gte: lastWeekStart, lt: weekStart } } }),
      prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.order.count({ where: { createdAt: { gte: lastMonthStart, lt: monthStart } } }),
      prisma.order.count(),
      // Status & payment breakdown
      prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.order.groupBy({ by: ['paymentMethod'], _count: { id: true } }),
      // Last 30 days daily data
      prisma.order.findMany({
        where: { createdAt: { gte: last30DaysStart } },
        select: { createdAt: true, total: true },
        orderBy: { createdAt: 'asc' },
      }),
      // Top products by revenue
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { price: 'desc' } },
        take: 10,
      }),
      // Top customers
      prisma.order.findMany({
        where: { userId: { not: null } },
        select: { userId: true, total: true },
      }),
      // New users
      prisma.user.count({ where: { createdAt: { gte: monthStart }, role: 'USER' } }),
      prisma.user.count({ where: { createdAt: { gte: lastMonthStart, lt: monthStart }, role: 'USER' } }),
    ])

    // Build daily chart data (last 30 days)
    const dailyMap: Record<string, { orders: number; revenue: number }> = {}
    for (let i = 0; i < 30; i++) {
      const d = subDays(now, 29 - i)
      const key = d.toISOString().slice(0, 10)
      dailyMap[key] = { orders: 0, revenue: 0 }
    }
    last30DaysOrders.forEach((o) => {
      const key = o.createdAt.toISOString().slice(0, 10)
      if (dailyMap[key]) {
        dailyMap[key].orders += 1
        dailyMap[key].revenue += o.total
      }
    })
    const dailyData = Object.entries(dailyMap).map(([date, v]) => ({ date, ...v }))

    // Top products with names
    const productIds = topProductItems.map((p) => p.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    })
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]))
    const topProducts = topProductItems.map((item) => ({
      productId: item.productId,
      name: productMap[item.productId]?.name ?? item.productId,
      price: productMap[item.productId]?.price ?? 0,
      totalQuantity: item._sum.quantity ?? 0,
      totalRevenue: item._sum.price ?? 0,
    }))

    // Top customers
    const userSpend: Record<string, { total: number; orders: number }> = {}
    topCustomerOrders.forEach((o) => {
      if (!o.userId) return
      if (!userSpend[o.userId]) userSpend[o.userId] = { total: 0, orders: 0 }
      userSpend[o.userId].total += o.total
      userSpend[o.userId].orders += 1
    })
    const topUserIds = Object.keys(userSpend)
      .sort((a, b) => userSpend[b].total - userSpend[a].total)
      .slice(0, 10)
    const topUsers = await prisma.user.findMany({
      where: { id: { in: topUserIds } },
      select: { id: true, name: true, email: true, phone: true },
    })
    const userMap = Object.fromEntries(topUsers.map((u) => [u.id, u]))
    const topCustomers = topUserIds.map((id) => ({
      userId: id,
      name: userMap[id]?.name ?? userMap[id]?.email ?? id,
      email: userMap[id]?.email ?? '',
      phone: userMap[id]?.phone ?? '',
      totalSpend: userSpend[id].total,
      orderCount: userSpend[id].orders,
    }))

    // Status breakdown
    const statusBreakdown = Object.fromEntries(
      ordersByStatus.map((g) => [g.status, g._count.id])
    )

    // Payment breakdown
    const paymentBreakdown = Object.fromEntries(
      ordersByPayment.map((g) => [g.paymentMethod ?? 'UNKNOWN', g._count.id])
    )

    return NextResponse.json({
      revenue: {
        today: revenueToday._sum.total ?? 0,
        yesterday: revenueYesterday._sum.total ?? 0,
        thisWeek: revenueThisWeek._sum.total ?? 0,
        lastWeek: revenueLastWeek._sum.total ?? 0,
        thisMonth: revenueThisMonth._sum.total ?? 0,
        lastMonth: revenueLastMonth._sum.total ?? 0,
        total: revenueTotal._sum.total ?? 0,
      },
      orders: {
        today: ordersToday,
        yesterday: ordersYesterday,
        thisWeek: ordersThisWeek,
        lastWeek: ordersLastWeek,
        thisMonth: ordersThisMonth,
        lastMonth: ordersLastMonth,
        total: ordersTotal,
      },
      users: {
        newThisMonth: newUsersThisMonth,
        newLastMonth: newUsersLastMonth,
      },
      dailyData,
      topProducts,
      topCustomers,
      statusBreakdown,
      paymentBreakdown,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
