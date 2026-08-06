import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Package, Check, Truck, Phone, ArrowLeft, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppStore'
import { LogoMark, LogoWordmark } from '../components/brand/Logo'
import Bubbles from '../components/brand/Bubbles'
import { STAGES, SERVICES, peso } from '../lib/constants'

const STEPS = [
  { id: 'new', label: 'Placed' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'washing', label: 'Washing' },
  { id: 'ready', label: 'Ready' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'completed', label: 'Completed' },
]

function Stepper({ stage }) {
  const idx = STEPS.findIndex((s) => s.id === stage)
  return (
    <div className="relative">
      {/* desktop horizontal */}
      <div className="hidden sm:flex items-start justify-between relative">
        <div className="absolute left-0 right-0 top-[15px] h-1 bg-slate-100 rounded-full" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(idx / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute left-0 top-[15px] h-1 bg-gradient-to-r from-brand-500 to-aqua rounded-full"
        />
        {STEPS.map((s, i) => {
          const done = i < idx
          const active = i === idx
          return (
            <div key={s.id} className="relative flex flex-col items-center flex-1 z-10">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`w-8 h-8 rounded-full grid place-items-center border-[3px] transition-colors ${
                  done
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : active
                    ? 'bg-white border-brand-500 text-brand-500 shadow-glow'
                    : 'bg-white border-slate-200 text-slate-300'
                }`}
              >
                {done ? (
                  <Check size={15} strokeWidth={3.5} />
                ) : active ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                )}
              </motion.div>
              <p
                className={`text-[10px] font-bold mt-2 text-center ${
                  i <= idx ? 'text-brand-600' : 'text-slate-300'
                }`}
              >
                {s.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* mobile vertical */}
      <div className="sm:hidden space-y-0">
        {STEPS.map((s, i) => {
          const done = i < idx
          const active = i === idx
          return (
            <div key={s.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full grid place-items-center border-[3px] shrink-0 ${
                    done
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : active
                      ? 'bg-white border-brand-500 text-brand-500'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {done ? (
                    <Check size={13} strokeWidth={3.5} />
                  ) : active ? (
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  ) : null}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-1 h-7 rounded-full ${i < idx ? 'bg-brand-500' : 'bg-slate-100'}`} />
                )}
              </div>
              <p
                className={`text-sm font-bold pt-0.5 ${
                  i <= idx ? 'text-brand-600' : 'text-slate-300'
                }`}
              >
                {s.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Track({ standalone = false }) {
  const { orders, shops, riders } = useApp()
  const [phone, setPhone] = useState('')
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState([])

  const search = (e) => {
    e?.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (!digits) return
    const found = orders
      .filter((o) => o.phone.replace(/\D/g, '').includes(digits) && digits.length >= 4)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setResults(found)
    setSearched(true)
  }

  const body = (
    <div className="max-w-3xl mx-auto">
      {/* search */}
      <div className="card p-6 sm:p-8 text-center mb-6">
        <div className="inline-block animate-float mb-3">
          <Bubbles size={72} waving />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Track your laundry 🧺</h1>
        <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
          Enter the mobile number you gave the shop and I'll show you exactly where your load is.
        </p>

        <form onSubmit={search} className="flex gap-2 mt-6 max-w-md mx-auto">
          <div className="relative flex-1">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0917 123 4567"
              className="input pl-10 py-3"
              inputMode="tel"
            />
          </div>
          <button type="submit" className="btn-primary px-5 py-3">
            <Search size={16} /> Track
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5 justify-center mt-4">
          <span className="text-[11px] text-slate-400 font-semibold">Try:</span>
          {['0917 231 8890', '0928 774 1120', '0919 550 3311'].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPhone(p)
                setTimeout(() => {
                  const digits = p.replace(/\D/g, '')
                  setResults(
                    orders
                      .filter((o) => o.phone.replace(/\D/g, '').includes(digits))
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  )
                  setSearched(true)
                }, 0)
              }}
              className="text-[11px] font-bold px-2 py-1 rounded-md bg-brand-50 text-brand-600 hover:bg-brand-100 transition tabular-nums"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* results */}
      {searched && (
        <>
          {results.length ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-500 px-1">
                Found {results.length} order{results.length === 1 ? '' : 's'} for {phone}
              </p>
              {results.map((o, i) => {
                const shop = shops.find((s) => s.id === o.shopId)
                const svc = SERVICES.find((s) => s.id === o.service)
                const rider = riders.find((r) => r.id === o.riderId)
                const stage = STAGES.find((s) => s.id === o.stage)
                return (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white grid place-items-center shrink-0 shadow-lift">
                        <Package size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-extrabold text-ink">{o.no}</p>
                          <span className={`chip bg-slate-100 text-slate-600 text-[10px]`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stage?.dot}`} />
                            {stage?.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {shop?.name} · {svc?.label} · {o.kg}kg
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-extrabold text-ink tabular-nums leading-none">
                          {peso(o.total)}
                        </p>
                        <p
                          className={`text-[10px] font-bold mt-1 ${
                            o.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {o.paymentStatus}
                        </p>
                      </div>
                    </div>

                    <Stepper stage={o.stage} />

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Pickup
                        </p>
                        <p className="text-sm font-semibold text-ink mt-0.5">
                          {o.pickupDate
                            ? new Date(o.pickupDate).toLocaleDateString('en-PH', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Delivery
                        </p>
                        <p className="text-sm font-semibold text-ink mt-0.5">
                          {o.deliveryDate
                            ? new Date(o.deliveryDate).toLocaleDateString('en-PH', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Rider
                        </p>
                        <p className="text-sm font-semibold text-ink mt-0.5 flex items-center gap-1.5">
                          {rider ? (
                            <>
                              <Truck size={13} className="text-brand-500" /> {rider.name}
                            </>
                          ) : (
                            <span className="text-slate-300">Unassigned</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 grid place-items-center mx-auto mb-4">
                <Search size={26} />
              </div>
              <h3 className="font-bold text-ink">No orders found</h3>
              <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
                We couldn't find laundry under <span className="font-semibold">{phone}</span>. Double-check
                the number, or ask the shop to confirm what they saved.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )

  if (!standalone) return body

  return (
    <div className="min-h-screen bg-canvas">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <LogoMark size={38} />
          <div>
            <LogoWordmark size="sm" />
            <p className="text-[9px] font-semibold tracking-[.12em] uppercase text-slate-400">
              Order Tracking
            </p>
          </div>
          <Link to="/" className="btn-ghost btn-sm ml-auto">
            <ArrowLeft size={14} /> Shop login
          </Link>
        </div>
      </header>
      <main className="px-4 py-8">{body}</main>
      <footer className="text-center py-6 text-[11px] font-semibold text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={11} className="text-brand-400" />
          Powered by <span className="text-brand-500">WashAI</span>
        </span>
      </footer>
    </div>
  )
}
