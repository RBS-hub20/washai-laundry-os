import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Bike, GripVertical, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../store/AppStore'
import { PageHeader } from '../components/ui/Bits'
import OrderModal from '../components/orders/OrderModal'
import { STAGES, SERVICES, peso, FREE_ORDER_LIMIT } from '../lib/constants'

function OrderCard({ order, riders, onOpen, onDragStart, onDragEnd, dragging, onMove }) {
  const svc = SERVICES.find((s) => s.id === order.service)
  const rider = riders.find((r) => r.id === order.riderId)
  const payTone =
    order.paymentStatus === 'Paid'
      ? 'bg-emerald-50 text-emerald-600'
      : order.paymentStatus === 'Partial'
      ? 'bg-amber-50 text-amber-600'
      : 'bg-red-50 text-red-500'

  const idx = STAGES.findIndex((s) => s.id === order.stage)

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(order)}
      className={`group bg-white rounded-2xl border border-slate-100 shadow-soft p-3.5 cursor-pointer
                  hover:shadow-lift hover:border-brand-200 transition-all select-none
                  ${dragging ? 'card-dragging' : ''}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <GripVertical
          size={14}
          className="text-slate-300 group-hover:text-brand-400 shrink-0 mt-0.5 cursor-grab active:cursor-grabbing"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink truncate leading-tight">{order.customerName}</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
            {order.no} · {svc?.label}
          </p>
        </div>
        <span className={`chip shrink-0 text-[9px] ${payTone}`}>{order.paymentStatus}</span>
      </div>

      <div className="flex items-center justify-between gap-2 pl-6">
        <span className="chip bg-slate-100 text-slate-600 text-[10px]">{order.kg} kg</span>
        <span className="text-sm font-extrabold text-ink tabular-nums">{peso(order.total)}</span>
      </div>

      <div className="flex items-center gap-1.5 mt-2.5 pl-6 pt-2.5 border-t border-slate-50">
        <Bike size={12} className={rider ? 'text-brand-500' : 'text-slate-300'} />
        <span className={`text-[10px] font-semibold truncate ${rider ? 'text-slate-600' : 'text-slate-300'}`}>
          {rider ? rider.name : 'No rider'}
        </span>
        {/* mobile stage steppers */}
        <div className="ml-auto flex gap-0.5 lg:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (idx > 0) onMove(order.id, STAGES[idx - 1].id)
            }}
            disabled={idx === 0}
            className="w-6 h-6 grid place-items-center rounded-md bg-slate-100 text-slate-500 disabled:opacity-30 active:scale-90"
            aria-label="Move back"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (idx < STAGES.length - 1) onMove(order.id, STAGES[idx + 1].id)
            }}
            disabled={idx === STAGES.length - 1}
            className="w-6 h-6 grid place-items-center rounded-md bg-brand-500 text-white disabled:opacity-30 active:scale-90"
            aria-label="Move forward"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Orders() {
  const { shopOrders, shopRiders, moveOrder, limitReached, setUpgradeOpen, monthOrderCount, isFree } =
    useApp()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [dragId, setDragId] = useState(null)
  const [overCol, setOverCol] = useState(null)
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return shopOrders
    return shopOrders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(s) ||
        o.no.toLowerCase().includes(s) ||
        o.phone.includes(s)
    )
  }, [shopOrders, q])

  const byStage = useMemo(() => {
    const map = {}
    STAGES.forEach((s) => (map[s.id] = []))
    filtered.forEach((o) => map[o.stage]?.push(o))
    return map
  }, [filtered])

  const openNew = () => {
    if (limitReached) {
      setUpgradeOpen(true)
      return
    }
    setEditing(null)
    setModal(true)
  }

  const openEdit = (o) => {
    setEditing(o)
    setModal(true)
  }

  const onDragStart = (e, id) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  const onDrop = (e, stage) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || dragId
    if (id) {
      const order = shopOrders.find((o) => o.id === id)
      if (order && order.stage !== stage) moveOrder(id, stage)
    }
    setDragId(null)
    setOverCol(null)
  }

  return (
    <div>
      <PageHeader
        title="Orders Board"
        subtitle={`${filtered.length} order${filtered.length === 1 ? '' : 's'} · drag cards between columns to update status`}
        actions={
          <>
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search orders…"
                className="input pl-9 w-52"
              />
            </div>
            <button onClick={openNew} className={limitReached ? 'btn-ghost' : 'btn-primary'}>
              {limitReached ? <Lock size={15} /> : <Plus size={16} />}
              {limitReached ? 'Limit reached' : 'New Order'}
            </button>
          </>
        }
      />

      <div className="relative sm:hidden mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search orders…"
          className="input pl-9"
        />
      </div>

      {limitReached && (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <Lock size={18} className="text-red-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-700">
              FREE plan limit reached ({monthOrderCount}/{FREE_ORDER_LIMIT} orders)
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Creating new orders is blocked. Upgrade to BIZ for unlimited orders.
            </p>
          </div>
          <button onClick={() => setUpgradeOpen(true)} className="btn-accent btn-sm shrink-0">
            Upgrade now
          </button>
        </div>
      )}

      {/* Kanban */}
      <div className="flex gap-3.5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {STAGES.map((stage) => {
          const items = byStage[stage.id] || []
          const value = items.reduce((s, o) => s + o.total, 0)
          return (
            <div
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                setOverCol(stage.id)
              }}
              onDragLeave={() => setOverCol((c) => (c === stage.id ? null : c))}
              onDrop={(e) => onDrop(e, stage.id)}
              className={`shrink-0 w-[272px] rounded-2xl transition-colors ${
                overCol === stage.id ? 'kanban-col-over' : 'bg-slate-100/60'
              }`}
            >
              <div className="px-3.5 py-3 flex items-center gap-2 sticky top-0">
                <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  {stage.label}
                </h3>
                <span className="ml-auto text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-white text-slate-500 tabular-nums">
                  {items.length}
                </span>
              </div>
              {value > 0 && (
                <p className="px-3.5 -mt-1.5 pb-2 text-[10px] font-bold text-slate-400 tabular-nums">
                  {peso(value)}
                </p>
              )}

              <div className="px-2.5 pb-2.5 space-y-2.5 min-h-[140px] max-h-[calc(100vh-300px)] overflow-y-auto no-scrollbar">
                {items.map((o) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    riders={shopRiders}
                    onOpen={openEdit}
                    onDragStart={onDragStart}
                    onDragEnd={() => {
                      setDragId(null)
                      setOverCol(null)
                    }}
                    dragging={dragId === o.id}
                    onMove={moveOrder}
                  />
                ))}
                {!items.length && (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center">
                    <p className="text-[11px] font-semibold text-slate-300">Drop orders here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {isFree && (
        <p className="text-center text-[11px] font-semibold text-slate-400 mt-4 lg:hidden">
          Powered by <span className="text-brand-500">WashAI</span>
        </p>
      )}

      <OrderModal open={modal} onClose={() => setModal(false)} editing={editing} />
    </div>
  )
}
