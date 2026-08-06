import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Check, Sparkles } from 'lucide-react'
import Modal from '../ui/Modal'
import GCashModal from './GCashModal'
import Bubbles from '../brand/Bubbles'
import { useApp } from '../../store/AppStore'
import { FREE_ORDER_LIMIT, peso, PLANS } from '../../lib/constants'

const BIZ_PERKS = [
  'Unlimited orders every month',
  '3 staff accounts',
  'No "Powered by WashAI" watermark',
  'SMS notifications to customers',
  'Full inventory management',
]

export default function UpgradeModal() {
  const { upgradeOpen, setUpgradeOpen, monthOrderCount, shop } = useApp()
  const [gcash, setGcash] = useState(false)
  const navigate = useNavigate()

  const atLimit = monthOrderCount >= FREE_ORDER_LIMIT

  return (
    <>
      <Modal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        title={atLimit ? "You've hit the FREE limit" : 'Unlock WashAI BIZ'}
        subtitle={
          atLimit
            ? `${monthOrderCount} of ${FREE_ORDER_LIMIT} monthly orders used`
            : 'Grow without limits'
        }
        icon={<Zap size={19} />}
        size="sm"
      >
        <div className="text-center mb-5">
          <div className="animate-float inline-block">
            <Bubbles size={92} waving />
          </div>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-xs mx-auto">
            {atLimit ? (
              <>
                <span className="font-bold text-ink">{shop?.name}</span> has used all{' '}
                {FREE_ORDER_LIMIT} free orders this month. Upgrade to keep taking laundry in — I'd hate
                for you to turn a customer away! 🫧
              </>
            ) : (
              <>Bubbles here — BIZ removes the order cap and drops the watermark. It's ₱499 a month. 🫧</>
            )}
          </p>
        </div>

        <div className="rounded-2xl border-2 border-brand-500 p-5 relative bg-gradient-to-b from-brand-50/60 to-white">
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 chip bg-brand-500 text-white shadow-lift">
            <Sparkles size={11} /> MOST POPULAR
          </span>
          <div className="text-center pt-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">WashAI Biz</p>
            <p className="text-4xl font-extrabold text-ink mt-1.5">
              {peso(PLANS.BIZ.price)}
              <span className="text-sm font-semibold text-slate-400">/mo</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              or {peso(PLANS.BIZ.yearly)}/yr — save {peso(PLANS.BIZ.price * 12 - PLANS.BIZ.yearly)}
            </p>
          </div>
          <ul className="space-y-2.5 mt-5">
            {BIZ_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="w-4.5 h-4.5 mt-0.5 shrink-0 rounded-full bg-brand-500 text-white grid place-items-center">
                  <Check size={11} strokeWidth={3.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => {
            setUpgradeOpen(false)
            setGcash(true)
          }}
          className="btn-accent w-full mt-5 py-3"
        >
          <Zap size={16} /> Upgrade with GCash
        </button>
        <button
          onClick={() => {
            setUpgradeOpen(false)
            navigate('/pricing')
          }}
          className="btn-ghost w-full mt-2"
        >
          Compare all plans
        </button>
      </Modal>

      <GCashModal open={gcash} onClose={() => setGcash(false)} plan="BIZ" cycle="monthly" />
    </>
  )
}
