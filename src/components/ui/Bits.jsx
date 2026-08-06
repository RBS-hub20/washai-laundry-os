import { motion } from 'framer-motion'

export function PageHeader({ title, subtitle, actions, icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon && (
          <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white grid place-items-center shadow-lift shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink truncate">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

export function StatCard({ icon, label, value, sub, tone = 'brand', delay = 0 }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    aqua: 'bg-cyan-50 text-cyan-600',
    rose: 'bg-rose-50 text-rose-600',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="card p-5 hover:shadow-lift transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="text-[26px] leading-tight font-extrabold text-ink mt-2 tabular-nums">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-2xl grid place-items-center shrink-0 ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export function Empty({ icon, title, hint, action }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-400 grid place-items-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-ink">{title}</h3>
      {hint && <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Field({ label, children, hint, required }) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export function PlanBadge({ plan, className = '' }) {
  const map = {
    FREE: 'bg-slate-100 text-slate-600 border-slate-200',
    BIZ: 'bg-gradient-to-r from-brand-500 to-brand-600 text-white border-transparent shadow-lift',
    GROWTH: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent shadow-lift',
  }
  return (
    <span className={`chip border ${map[plan] || map.FREE} ${className}`}>
      {plan === 'FREE' ? 'FREE' : plan}
    </span>
  )
}

export function ProgressBar({ value, max, danger }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-2 rounded-full bg-white/30 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`h-full rounded-full ${danger ? 'bg-accent' : 'bg-white'}`}
      />
    </div>
  )
}
