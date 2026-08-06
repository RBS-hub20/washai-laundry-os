import { useMemo, useState } from 'react'
import {
  ShieldCheck, Store, Check, X, Clock, Search, Building2, Wallet, Users2, FileImage,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppStore'
import { PageHeader, StatCard, PlanBadge, Empty } from '../components/ui/Bits'
import { peso, FREE_ORDER_LIMIT, PLANS } from '../lib/constants'

export default function SuperAdmin() {
  const { shops, orders, payments, ordersUsedFor, approvePayment, rejectPayment, setPlan, switchShop } =
    useApp()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('pending')

  const pending = payments.filter((p) => p.status === 'pending')
  const resolved = payments.filter((p) => p.status !== 'pending')

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return shops
      .map((sh) => ({
        ...sh,
        used: ordersUsedFor(sh.id),
        totalOrders: orders.filter((o) => o.shopId === sh.id).length,
        revenue: orders.filter((o) => o.shopId === sh.id).reduce((a, o) => a + o.total, 0),
      }))
      .filter((sh) => !s || sh.name.toLowerCase().includes(s) || sh.owner.toLowerCase().includes(s))
  }, [shops, orders, q, ordersUsedFor])

  const mrr = shops.reduce((s, sh) => s + (PLANS[sh.plan]?.price || 0), 0)
  const paidShops = shops.filter((s) => s.plan !== 'FREE').length

  return (
    <div>
      <PageHeader
        title="Super Admin"
        subtitle="Platform-wide tenant and billing control"
        icon={<ShieldCheck size={20} />}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Building2 size={19} />} label="Total Shops" value={shops.length} tone="brand" />
        <StatCard
          icon={<Wallet size={19} />}
          label="Est. MRR"
          value={peso(mrr)}
          sub={`${paidShops} paying shops`}
          tone="emerald"
          delay={0.05}
        />
        <StatCard
          icon={<Clock size={19} />}
          label="Pending Proofs"
          value={pending.length}
          sub={pending.length ? 'Needs review' : 'All clear'}
          tone={pending.length ? 'amber' : 'emerald'}
          delay={0.1}
        />
        <StatCard
          icon={<Users2 size={19} />}
          label="Total Orders"
          value={orders.length}
          tone="violet"
          delay={0.15}
        />
      </div>

      {/* GCash proofs */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <h3 className="font-bold text-ink">GCash Payment Proofs</h3>
          <div className="ml-auto flex gap-1 p-1 rounded-xl bg-slate-100">
            {[
              ['pending', `Pending (${pending.length})`],
              ['resolved', `Resolved (${resolved.length})`],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  tab === id ? 'bg-white text-ink shadow-soft' : 'text-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {(tab === 'pending' ? pending : resolved).length ? (
            (tab === 'pending' ? pending : resolved).map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                  <FileImage size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-ink">{p.shopName}</p>
                    <PlanBadge plan={p.plan} />
                    <span className="chip bg-slate-100 text-slate-500 text-[10px]">{p.cycle}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Ref <span className="font-mono font-bold text-slate-700">{p.refNo}</span> · sent by{' '}
                    {p.senderName} · {new Date(p.createdAt).toLocaleDateString('en-PH')}
                  </p>
                  {p.proofName && (
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">📎 {p.proofName}</p>
                  )}
                </div>
                <p className="text-lg font-extrabold text-ink tabular-nums shrink-0">{peso(p.amount)}</p>

                {p.status === 'pending' ? (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => rejectPayment(p.id)} className="btn-danger btn-sm">
                      <X size={14} /> Reject
                    </button>
                    <button
                      onClick={() => approvePayment(p.id)}
                      className="btn btn-sm bg-emerald-500 text-white hover:bg-emerald-600 shadow-lift"
                    >
                      <Check size={14} /> Approve
                    </button>
                  </div>
                ) : (
                  <span
                    className={`chip shrink-0 ${
                      p.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {p.status === 'approved' ? <Check size={12} /> : <X size={12} />}
                    {p.status}
                  </span>
                )}
              </motion.div>
            ))
          ) : (
            <Empty
              icon={<Clock size={26} />}
              title={tab === 'pending' ? 'No pending proofs' : 'Nothing resolved yet'}
              hint={
                tab === 'pending'
                  ? 'GCash proofs submitted by shops will land here for approval.'
                  : 'Approved and rejected proofs appear here.'
              }
            />
          )}
        </div>
      </div>

      {/* shops */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center">
          <h3 className="font-bold text-ink shrink-0">All Shops ({rows.length})</h3>
          <div className="relative sm:ml-auto sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search shops…"
              className="input pl-9 py-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-50/70">
              <tr>
                <th className="th">Shop</th>
                <th className="th">Plan</th>
                <th className="th">Orders Used (mo)</th>
                <th className="th text-right">All-time</th>
                <th className="th text-right">Revenue</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((sh) => {
                const isFree = sh.plan === 'FREE'
                const pct = Math.min(100, (sh.used / FREE_ORDER_LIMIT) * 100)
                return (
                  <tr key={sh.id} className="hover:bg-slate-50/60 transition">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                          <Store size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink truncate">{sh.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {sh.owner} · {sh.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="td">
                      <PlanBadge plan={sh.plan} />
                    </td>
                    <td className="td w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden min-w-[60px]">
                          <div
                            className={`h-full rounded-full ${
                              isFree && pct >= 100 ? 'bg-red-500' : isFree && pct >= 80 ? 'bg-amber-400' : 'bg-brand-500'
                            }`}
                            style={{ width: `${isFree ? pct : 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 tabular-nums shrink-0">
                          {sh.used}
                          {isFree ? `/${FREE_ORDER_LIMIT}` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="td text-right tabular-nums">{sh.totalOrders}</td>
                    <td className="td text-right font-extrabold text-ink tabular-nums">
                      {peso(sh.revenue)}
                    </td>
                    <td className="td text-right">
                      <div className="flex gap-1.5 justify-end">
                        <select
                          value={sh.plan}
                          onChange={(e) => setPlan(sh.id, e.target.value)}
                          className="input py-1.5 px-2 text-xs w-24"
                          aria-label={`Change plan for ${sh.name}`}
                        >
                          <option value="FREE">FREE</option>
                          <option value="BIZ">BIZ</option>
                          <option value="GROWTH">GROWTH</option>
                        </select>
                        <button onClick={() => switchShop(sh.id)} className="btn-ghost btn-sm">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
