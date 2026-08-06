import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  ShoppingBag, Truck, Wallet, Users, Zap, ArrowUpRight, TrendingUp,
  AlertTriangle, Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppStore'
import { StatCard, PageHeader, ProgressBar } from '../components/ui/Bits'
import { FREE_ORDER_LIMIT, STAGES, peso } from '../lib/constants'
import { LogoMark } from '../components/brand/Logo'

const PIE_COLORS = {
  new: '#94A3B8',
  pickup: '#FBBF24',
  washing: '#2D8BFF',
  ready: '#8B5CF6',
  delivery: '#22D3C5',
  completed: '#10B981',
}

function ChartTip({ active, payload, label, prefix }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-white shadow-lift border border-slate-100 px-3.5 py-2.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey || p.name} className="text-sm font-bold text-ink mt-0.5">
          {prefix ? peso(p.value) : p.value}
          <span className="text-slate-400 font-medium ml-1.5 text-xs">{p.name}</span>
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { stats, revenueSeries, shopOrders, shop, isFree, monthOrderCount, setUpgradeOpen, shopInventory } =
    useApp()

  const pieData = useMemo(
    () =>
      STAGES.map((s) => ({
        name: s.label,
        key: s.id,
        value: shopOrders.filter((o) => o.stage === s.id).length,
      })).filter((d) => d.value > 0),
    [shopOrders]
  )

  const recent = useMemo(
    () => [...shopOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
    [shopOrders]
  )

  const lowItems = shopInventory.filter((i) => Number(i.stock) <= Number(i.lowAt))
  const pct = Math.round((monthOrderCount / FREE_ORDER_LIMIT) * 100)

  return (
    <div>
      <PageHeader
        title={`Kumusta, ${shop?.owner?.split(' ')[0] || 'there'}! 👋`}
        subtitle={`Here's how ${shop?.name} is doing today.`}
        actions={
          <Link to="/orders" className="btn-primary">
            <ShoppingBag size={16} /> New Order
          </Link>
        }
      />

      {/* FREE usage banner */}
      {isFree && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-aqua p-5 sm:p-6 mb-6 shadow-lift relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-16 top-8 w-52 h-52 rounded-full bg-white/5" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={15} className="text-accent" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
                  Free Plan
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                You have used {monthOrderCount}/{FREE_ORDER_LIMIT} FREE orders this month
              </h3>
              <p className="text-sm text-white/85 mt-1">
                {monthOrderCount >= FREE_ORDER_LIMIT
                  ? 'Limit reached — new orders are blocked until you upgrade.'
                  : `${FREE_ORDER_LIMIT - monthOrderCount} orders left. Upgrade to BIZ for unlimited.`}
              </p>
              <div className="mt-3 max-w-md">
                <ProgressBar value={monthOrderCount} max={FREE_ORDER_LIMIT} danger={pct >= 80} />
                <p className="text-[11px] text-white/70 mt-1.5 font-semibold">{pct}% used</p>
              </div>
            </div>
            <button onClick={() => setUpgradeOpen(true)} className="btn-accent shrink-0 py-3 px-5">
              <Zap size={16} /> Upgrade to BIZ
            </button>
          </div>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<ShoppingBag size={19} />}
          label="Today's Orders"
          value={stats.todayCount}
          sub={`${stats.monthOrderCount} this month`}
          tone="brand"
          delay={0}
        />
        <StatCard
          icon={<Truck size={19} />}
          label="Pending Pickups"
          value={stats.pendingPickups}
          sub={`${stats.activeRiders} riders active`}
          tone="amber"
          delay={0.05}
        />
        <StatCard
          icon={<Wallet size={19} />}
          label="Revenue Today"
          value={peso(stats.revenueToday)}
          sub={`${peso(stats.monthRevenue)} this month`}
          tone="emerald"
          delay={0.1}
        />
        <StatCard
          icon={<Users size={19} />}
          label="Total Customers"
          value={stats.totalCustomers}
          sub={`${peso(stats.unpaid)} unpaid`}
          tone="violet"
          delay={0.15}
        />
      </div>

      {/* charts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-ink">Monthly Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
            </div>
            <span className="chip bg-emerald-50 text-emerald-600">
              <TrendingUp size={12} /> {peso(stats.monthRevenue)} MTD
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2D8BFF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2D8BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#EEF2F7" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                />
                <Tooltip content={<ChartTip prefix />} cursor={{ stroke: '#2D8BFF', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#2D8BFF"
                  strokeWidth={3}
                  fill="url(#rev)"
                  dot={{ r: 4, fill: '#fff', stroke: '#2D8BFF', strokeWidth: 2.5 }}
                  activeDot={{ r: 6, fill: '#2D8BFF', stroke: '#fff', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <h3 className="font-bold text-ink">Order Status</h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-2">All-time breakdown</p>
          <div className="h-[280px]">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={54}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {pieData.map((d) => (
                      <Cell key={d.key} fill={PIE_COLORS[d.key]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span className="text-[11px] text-slate-500 font-medium">{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-sm text-slate-400">No orders yet</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* recent + alerts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-ink">Recent Orders</h3>
            <Link to="/orders" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View board <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recent.length ? (
              recent.map((o) => {
                const stage = STAGES.find((s) => s.id === o.stage)
                return (
                  <Link
                    to="/orders"
                    key={o.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center text-[11px] font-extrabold shrink-0">
                      {o.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink truncate">{o.customerName}</p>
                      <p className="text-[11px] text-slate-400">
                        {o.no} · {o.kg}kg
                      </p>
                    </div>
                    <span className="chip bg-slate-100 shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${stage?.dot}`} />
                      <span className="text-slate-600 hidden sm:inline">{stage?.label}</span>
                    </span>
                    <span className="text-sm font-extrabold text-ink tabular-nums shrink-0 w-20 text-right">
                      {peso(o.total)}
                    </span>
                  </Link>
                )
              })
            ) : (
              <p className="px-5 py-10 text-center text-sm text-slate-400">No orders yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className={lowItems.length ? 'text-red-500' : 'text-emerald-500'} />
              <h3 className="font-bold text-ink text-sm">Low Stock</h3>
            </div>
            {lowItems.length ? (
              <div className="space-y-2">
                {lowItems.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-red-50 border border-red-100"
                  >
                    <span className="text-sm font-semibold text-red-700 truncate">{i.name}</span>
                    <span className="text-xs font-extrabold text-red-600 tabular-nums shrink-0">
                      {i.stock} {i.unit}
                    </span>
                  </div>
                ))}
                <Link to="/inventory" className="btn-ghost btn-sm w-full mt-1">
                  Restock now
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500">All supplies healthy ✅</p>
            )}
          </div>

          <div className="card p-5 text-center">
            <LogoMark size={52} className="mx-auto mb-3" />
            <h3 className="font-bold text-ink text-sm">Share your track link</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Let customers check their laundry status themselves — no login needed.
            </p>
            <Link to="/track" className="btn-ghost btn-sm w-full mt-3">
              Open /track
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
