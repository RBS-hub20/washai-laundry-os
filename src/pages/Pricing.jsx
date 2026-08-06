import { useState } from 'react'
import { Check, Sparkles, Zap, Building2, Crown, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppStore'
import GCashModal from '../components/billing/GCashModal'
import Bubbles from '../components/brand/Bubbles'
import { peso, FREE_ORDER_LIMIT } from '../lib/constants'

const TIERS = [
  {
    id: 'FREE',
    name: 'Free',
    tagline: 'Perfect for testing the waters',
    monthly: 0,
    yearly: 0,
    icon: Sparkles,
    accent: 'slate',
    features: [
      { text: `${FREE_ORDER_LIMIT} orders per month`, on: true },
      { text: '1 branch', on: true },
      { text: 'Kanban order board', on: true },
      { text: 'Customer + rider management', on: true },
      { text: '"Powered by WashAI" watermark', on: true, muted: true },
      { text: 'SMS notifications', on: false },
      { text: 'Inventory management', on: false },
    ],
  },
  {
    id: 'BIZ',
    name: 'Biz',
    tagline: 'For the growing neighborhood shop',
    monthly: 499,
    yearly: 4990,
    icon: Zap,
    accent: 'brand',
    popular: true,
    features: [
      { text: 'Unlimited orders', on: true },
      { text: '1 branch', on: true },
      { text: '3 staff accounts', on: true },
      { text: 'No watermark', on: true },
      { text: 'SMS notifications', on: true },
      { text: 'Full inventory management', on: true },
      { text: 'Multi-branch + rider map', on: false },
    ],
  },
  {
    id: 'GROWTH',
    name: 'Growth',
    tagline: 'For multi-branch operators',
    monthly: 1199,
    yearly: 11990,
    icon: Crown,
    accent: 'violet',
    features: [
      { text: 'Everything in Biz', on: true },
      { text: 'Up to 5 branches', on: true },
      { text: 'Unlimited staff accounts', on: true },
      { text: 'Live rider map', on: true },
      { text: 'Advanced reports + exports', on: true },
      { text: 'Priority support', on: true },
      { text: 'Custom branding', on: true },
    ],
  },
]

export default function Pricing() {
  const { shop, monthOrderCount } = useApp()
  const [yearly, setYearly] = useState(false)
  const [gcash, setGcash] = useState(null)

  const current = shop?.plan || 'FREE'

  const accents = {
    slate: {
      ring: 'border-slate-200',
      icon: 'bg-slate-100 text-slate-500',
      btn: 'btn-ghost',
      check: 'bg-slate-400',
    },
    brand: {
      ring: 'border-brand-500 shadow-[0_0_0_4px_rgba(45,139,255,.1)]',
      icon: 'bg-brand-500 text-white',
      btn: 'btn-primary',
      check: 'bg-brand-500',
    },
    violet: {
      ring: 'border-violet-200',
      icon: 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white',
      btn: 'btn bg-violet-600 text-white shadow-lift hover:bg-violet-700',
      check: 'bg-violet-500',
    },
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* hero */}
      <div className="text-center mb-10">
        <div className="inline-block animate-float mb-4">
          <Bubbles size={80} waving />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
          Laundry Shops, <span className="bg-gradient-to-r from-brand-500 to-aqua bg-clip-text text-transparent">Powered by AI</span>
        </h1>
        <p className="text-slate-500 mt-3 max-w-lg mx-auto">
          Start free. Upgrade when your suds start overflowing. Cancel anytime — no lock-in, no card
          needed.
        </p>

        {/* toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100 mt-7">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
              !yearly ? 'bg-white text-ink shadow-soft' : 'text-slate-500'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
              yearly ? 'bg-white text-ink shadow-soft' : 'text-slate-500'
            }`}
          >
            Yearly
            <span className="chip bg-accent text-ink text-[9px]">SAVE 2 MOS</span>
          </button>
        </div>
      </div>

      {/* cards */}
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        {TIERS.map((tier, i) => {
          const a = accents[tier.accent]
          const Icon = tier.icon
          const price = yearly ? tier.yearly : tier.monthly
          const isCurrent = current === tier.id
          const isFreeTier = tier.id === 'FREE'

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative bg-white rounded-3xl border-2 p-6 ${a.ring} ${
                tier.popular ? 'lg:-mt-4 lg:pb-8' : ''
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-brand-500 text-white shadow-lift whitespace-nowrap">
                  <Sparkles size={11} /> MOST POPULAR
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 right-5 chip bg-emerald-500 text-white shadow-lift">
                  CURRENT PLAN
                </span>
              )}

              <div className={`w-12 h-12 rounded-2xl grid place-items-center ${a.icon} mb-4`}>
                <Icon size={22} />
              </div>

              <h3 className="text-xl font-extrabold text-ink">WashAI {tier.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{tier.tagline}</p>

              <div className="mt-5 mb-6">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-extrabold text-ink tabular-nums leading-none">
                    {price === 0 ? '₱0' : peso(price)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 pb-0.5">
                    {price === 0 ? 'forever' : yearly ? '/year' : '/month'}
                  </span>
                </div>
                {!isFreeTier && yearly && (
                  <p className="text-[11px] font-bold text-emerald-600 mt-1.5">
                    Save {peso(tier.monthly * 12 - tier.yearly)} vs monthly
                  </p>
                )}
                {!isFreeTier && !yearly && (
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    or {peso(tier.yearly)}/yr — 2 months free
                  </p>
                )}
              </div>

              <button
                onClick={() => !isCurrent && !isFreeTier && setGcash(tier.id)}
                disabled={isCurrent || isFreeTier}
                className={`${a.btn} w-full py-3 ${isCurrent || isFreeTier ? 'opacity-60 pointer-events-none' : ''}`}
              >
                {isCurrent ? 'Your current plan' : isFreeTier ? 'Free forever' : `Upgrade to ${tier.name}`}
              </button>

              <ul className="space-y-3 mt-6">
                {tier.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5">
                    <span
                      className={`w-4.5 h-4.5 shrink-0 mt-0.5 rounded-full grid place-items-center ${
                        f.on ? a.check : 'bg-slate-100'
                      }`}
                    >
                      {f.on ? (
                        <Check size={11} strokeWidth={3.5} className="text-white" />
                      ) : (
                        <X size={11} strokeWidth={3} className="text-slate-300" />
                      )}
                    </span>
                    <span
                      className={`text-sm leading-snug ${
                        !f.on ? 'text-slate-300 line-through' : f.muted ? 'text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>

      {/* current usage */}
      {current === 'FREE' && (
        <div className="card p-5 mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-ink">
              You've used {monthOrderCount} of {FREE_ORDER_LIMIT} free orders this month
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              Upgrading takes a minute via GCash — Bubbles will walk you through it.
            </p>
          </div>
          <button onClick={() => setGcash('BIZ')} className="btn-accent shrink-0">
            <Zap size={16} /> Upgrade to BIZ
          </button>
        </div>
      )}

      {/* faq */}
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {[
          {
            q: 'How do I pay?',
            a: 'Via GCash. Send the amount, enter your reference number and upload a screenshot. We approve it and your plan activates.',
          },
          {
            q: 'What happens at the free limit?',
            a: `Once you hit ${FREE_ORDER_LIMIT} orders in a month, creating new orders is blocked until you upgrade. Existing orders keep working normally.`,
          },
          {
            q: 'Can I switch plans later?',
            a: 'Anytime. Upgrade for more capacity, or let a plan lapse to fall back to Free. Your data stays put.',
          },
          {
            q: 'Is the watermark removable?',
            a: 'Yes — "Powered by WashAI" disappears the moment you move to Biz or Growth.',
          },
        ].map((f) => (
          <div key={f.q} className="card p-5">
            <p className="font-bold text-ink text-sm flex items-center gap-2">
              <Building2 size={14} className="text-brand-500" /> {f.q}
            </p>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>

      <GCashModal
        open={!!gcash}
        onClose={() => setGcash(null)}
        plan={gcash || 'BIZ'}
        cycle={yearly ? 'yearly' : 'monthly'}
      />
    </div>
  )
}
