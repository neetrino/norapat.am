'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Minus,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayData { date: string; orders: number; revenue: number }
interface ProductStat { productId: string; name: string; price: number; totalQuantity: number; totalRevenue: number }
interface CustomerStat { userId: string; name: string; email: string; phone: string; totalSpend: number; orderCount: number }

interface AnalyticsData {
  revenue: { today: number; yesterday: number; thisWeek: number; lastWeek: number; thisMonth: number; lastMonth: number; total: number }
  orders: { today: number; yesterday: number; thisWeek: number; lastWeek: number; thisMonth: number; lastMonth: number; total: number }
  users: { newThisMonth: number; newLastMonth: number }
  dailyData: DayData[]
  topProducts: ProductStat[]
  topCustomers: CustomerStat[]
  statusBreakdown: Record<string, number>
  paymentBreakdown: Record<string, number>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ընկալված',
  CONFIRMED: 'Հաստատված',
  PREPARING: 'Պատրաստվում',
  READY: 'Պատրաստ',
  DELIVERED: 'Հասցված',
  CANCELLED: 'Չեղարկված',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-400',
  CONFIRMED: 'bg-blue-400',
  PREPARING: 'bg-orange-400',
  READY: 'bg-purple-400',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-400',
}

const PAYMENT_LABELS: Record<string, string> = {
  CASH: 'Կանխիկ',
  CARD: 'Քարտ',
  ONLINE: 'Առցանց',
  UNKNOWN: 'Անհայտ',
}

function fmt(n: number) {
  return n.toLocaleString('hy-AM', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  const pct = pctChange(current, previous)
  if (pct === null) return <span className="text-xs text-gray-400">—</span>
  if (pct === 0) return (
    <span className="inline-flex items-center gap-0.5 text-xs text-gray-500">
      <Minus className="h-3 w-3" /> 0%
    </span>
  )
  const up = pct > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? '+' : ''}{pct}%
    </span>
  )
}

function StatCard({
  label, value, subLabel, current, previous, icon: Icon, color,
}: {
  label: string; value: string; subLabel: string; current: number; previous: number
  icon: React.ElementType; color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <DeltaBadge current={current} previous={previous} />
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{subLabel}</p>
    </div>
  )
}

// ─── Bar Chart (SVG) ──────────────────────────────────────────────────────────

function BarChart({ data, field, color }: { data: DayData[]; field: 'orders' | 'revenue'; color: string }) {
  const values = data.map((d) => d[field])
  const maxVal = Math.max(...values, 1)
  const chartH = 120
  const barW = Math.max(4, Math.floor(560 / data.length) - 2)

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${data.length * (barW + 2)} ${chartH + 24}`}
        className="w-full"
        style={{ minWidth: data.length * (barW + 2) }}
      >
        {data.map((d, i) => {
          const h = Math.round((d[field] / maxVal) * chartH)
          const x = i * (barW + 2)
          const y = chartH - h
          const isWeekend = new Date(d.date + 'T00:00:00Z').getUTCDay() % 6 === 0
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={2}
                fill={isWeekend ? color.replace('500', '300') : color}
                opacity={0.85}
              />
              {/* Date label every 5 days */}
              {i % 5 === 0 && (
                <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  {d.date.slice(5)}
                </text>
              )}
              <title>{d.date}: {field === 'revenue' ? `${fmt(d[field])} դր.` : `${d[field]} պատ.`}</title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Donut-style status bar ───────────────────────────────────────────────────

function StatusBar({ breakdown, total }: { breakdown: Record<string, number>; total: number }) {
  if (total === 0) return <p className="text-sm text-gray-400">Տվյալ չկա</p>
  return (
    <div className="space-y-2">
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
        {Object.entries(breakdown).map(([status, count]) => (
          <div
            key={status}
            className={`${STATUS_COLORS[status] ?? 'bg-gray-300'} transition-all`}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${STATUS_LABELS[status] ?? status}: ${count}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
        {Object.entries(breakdown).map(([status, count]) => (
          <div key={status} className="flex items-center gap-1.5 text-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-300'}`} />
            <span className="text-gray-700">{STATUS_LABELS[status] ?? status}</span>
            <span className="font-semibold text-gray-900">{count}</span>
            <span className="text-gray-400 text-xs">({Math.round((count / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Period = 'day' | 'week' | 'month' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  day: 'Օր',
  week: 'Շաբաթ',
  month: 'Ամիս',
  all: 'Ընդհանուր',
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('month')
  const [chartField, setChartField] = useState<'orders' | 'revenue'>('revenue')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [session, status, router])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Revenue & orders for selected period
  const revCurrent = period === 'day' ? data.revenue.today : period === 'week' ? data.revenue.thisWeek : period === 'month' ? data.revenue.thisMonth : data.revenue.total
  const revPrevious = period === 'day' ? data.revenue.yesterday : period === 'week' ? data.revenue.lastWeek : period === 'month' ? data.revenue.lastMonth : 0
  const ordCurrent = period === 'day' ? data.orders.today : period === 'week' ? data.orders.thisWeek : period === 'month' ? data.orders.thisMonth : data.orders.total
  const ordPrevious = period === 'day' ? data.orders.yesterday : period === 'week' ? data.orders.lastWeek : period === 'month' ? data.orders.lastMonth : 0
  const avgOrder = ordCurrent > 0 ? revCurrent / ordCurrent : 0
  const avgPrevOrder = ordPrevious > 0 ? revPrevious / ordPrevious : 0

  const totalOrdersAll = data.orders.total
  const periodLabel = period === 'day' ? 'երեկ' : period === 'week' ? 'նախ. շաբ.' : period === 'month' ? 'նախ. ամիս' : ''

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Վերլուծություն</h1>
          <p className="text-sm text-gray-500 mt-0.5">Բիզնեսի ամփոփ ցուցանիշները</p>
        </div>
        {/* Period tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Եկամուտ"
          value={`${fmt(revCurrent)} դր.`}
          subLabel={periodLabel ? `${periodLabel}՝ ${fmt(revPrevious)} դր.` : 'Բոլոր ժամանակ'}
          current={revCurrent}
          previous={revPrevious}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          label="Պատվերներ"
          value={fmt(ordCurrent)}
          subLabel={periodLabel ? `${periodLabel}՝ ${fmt(ordPrevious)}` : 'Ընդամենը'}
          current={ordCurrent}
          previous={ordPrevious}
          icon={ShoppingCart}
          color="bg-orange-500"
        />
        <StatCard
          label="Միջ. պատվեր"
          value={`${fmt(avgOrder)} դր.`}
          subLabel={periodLabel ? `${periodLabel}՝ ${fmt(avgPrevOrder)} դր.` : 'Ամբողջ ժամ.'}
          current={avgOrder}
          previous={avgPrevOrder}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          label="Նոր հաճախ. (ամիս)"
          value={fmt(data.users.newThisMonth)}
          subLabel={`Նախ. ամիս՝ ${fmt(data.users.newLastMonth)}`}
          current={data.users.newThisMonth}
          previous={data.users.newLastMonth}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Վերջին 30 օրը</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ամեն գծիկ — 1 օր</p>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setChartField('revenue')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${chartField === 'revenue' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'}`}
            >
              Եկամուտ
            </button>
            <button
              onClick={() => setChartField('orders')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${chartField === 'orders' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'}`}
            >
              Պատվերներ
            </button>
          </div>
        </div>
        <BarChart data={data.dailyData} field={chartField} color={chartField === 'revenue' ? '#f97316' : '#3b82f6'} />
      </div>

      {/* Top Products + Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Լավագույն ապրանքներ</h2>
          </div>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">Տվյալ չկա</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((p, i) => {
                const maxRev = data.topProducts[0]?.totalRevenue ?? 1
                const pct = Math.round((p.totalRevenue / maxRev) * 100)
                return (
                  <div key={p.productId} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-gray-400 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                        <span className="text-sm font-semibold text-gray-900 shrink-0">{fmt(p.totalRevenue)} դր.</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{p.totalQuantity} հ.</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-purple-500" />
            <h2 className="font-semibold text-gray-900">Լավագույն հաճախորդներ</h2>
          </div>
          {data.topCustomers.length === 0 ? (
            <p className="text-sm text-gray-400">Տվյալ չկա</p>
          ) : (
            <div className="space-y-3">
              {data.topCustomers.map((c, i) => {
                const maxSpend = data.topCustomers[0]?.totalSpend ?? 1
                const pct = Math.round((c.totalSpend / maxSpend) * 100)
                return (
                  <div key={c.userId} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-gray-400 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-800 truncate">{c.name}</span>
                        <span className="text-sm font-semibold text-gray-900 shrink-0">{fmt(c.totalSpend)} դր.</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{c.orderCount} պատ.</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Status + Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Պատվերների կարգավիճակ</h2>
          <StatusBar breakdown={data.statusBreakdown} total={totalOrdersAll} />
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Վճարման եղանակ</h2>
          {Object.keys(data.paymentBreakdown).length === 0 ? (
            <p className="text-sm text-gray-400">Տվյալ չկա</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.paymentBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([method, count]) => {
                  const maxCount = Math.max(...Object.values(data.paymentBreakdown))
                  const pct = Math.round((count / maxCount) * 100)
                  const pctOfTotal = Math.round((count / totalOrdersAll) * 100)
                  return (
                    <div key={method} className="flex items-center gap-3">
                      <span className="w-20 text-sm text-gray-700 shrink-0">{PAYMENT_LABELS[method] ?? method}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right shrink-0">{count}</span>
                      <span className="text-xs text-gray-400 w-8 shrink-0">{pctOfTotal}%</span>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
