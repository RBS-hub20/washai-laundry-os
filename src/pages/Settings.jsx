import { useState, useEffect } from 'react'
import { Settings as Cog, Store, Save, RotateCcw, Zap, Database, Trash2 } from 'lucide-react'
import { useApp } from '../store/AppStore'
import { PageHeader, Field, PlanBadge } from '../components/ui/Bits'
import Modal from '../components/ui/Modal'
import { LogoMark } from '../components/brand/Logo'
import { peso, FREE_ORDER_LIMIT, SERVICES, ADDONS } from '../lib/constants'

export default function Settings() {
  const { shop, updateShop, hardReset, monthOrderCount, setUpgradeOpen, isFree, shopOrders, shopCustomers } =
    useApp()
  const [form, setForm] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (shop)
      setForm({
        name: shop.name,
        owner: shop.owner,
        email: shop.email,
        phone: shop.phone,
        address: shop.address,
        pricePerKg: shop.pricePerKg,
      })
  }, [shop])

  if (!form) return null

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    updateShop({ ...form, pricePerKg: Number(form.pricePerKg) || 45 })
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" subtitle="Shop profile, pricing and data" icon={<Cog size={20} />} />

      {/* shop identity */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-4 mb-6">
          <LogoMark size={56} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-ink text-lg truncate">{shop.name}</h2>
              <PlanBadge plan={shop.plan} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tenant ID: <span className="font-mono">{shop.id}</span>
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Shop Name" required>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </Field>
            <Field label="Owner Name" required>
              <input className="input" value={form.owner} onChange={(e) => set('owner', e.target.value)} required />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </Field>
          </div>
          <Field label="Shop Address">
            <input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} />
          </Field>

          <Field
            label="Price per KG"
            required
            hint="Every order total recalculates from this rate × service multiplier + add-ons"
          >
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₱
              </span>
              <input
                type="number"
                min="1"
                className="input pl-8"
                value={form.pricePerKg}
                onChange={(e) => set('pricePerKg', e.target.value)}
                required
              />
            </div>
          </Field>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Price preview at {peso(Number(form.pricePerKg) || 0)}/kg
            </p>
            <div className="grid sm:grid-cols-3 gap-2 mb-3">
              {SERVICES.map((s) => (
                <div key={s.id} className="rounded-xl bg-white p-3 border border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500">{s.label}</p>
                  <p className="text-sm font-extrabold text-ink mt-0.5 tabular-nums">
                    {peso(Math.round((Number(form.pricePerKg) || 0) * s.multiplier))}
                    <span className="text-[10px] font-semibold text-slate-400">/kg</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Add-ons: {ADDONS.map((a) => `${a.label} +₱${a.price}`).join(' · ')}
            </p>
          </div>

          <button type="submit" className="btn-primary">
            <Save size={16} /> Save Changes
          </button>
        </form>
      </div>

      {/* plan */}
      <div className="card p-6 mb-5">
        <h3 className="font-bold text-ink mb-1">Subscription</h3>
        <p className="text-sm text-slate-500 mb-4">
          You're on the <span className="font-bold">{shop.plan}</span> plan.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">
              {isFree
                ? `${monthOrderCount} / ${FREE_ORDER_LIMIT} orders used this month`
                : 'Unlimited orders ✨'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isFree ? 'Resets on the 1st of each month' : 'Thanks for supporting WashAI!'}
            </p>
          </div>
          {isFree && (
            <button onClick={() => setUpgradeOpen(true)} className="btn-accent btn-sm shrink-0">
              <Zap size={14} /> Upgrade
            </button>
          )}
        </div>
      </div>

      {/* data */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-1">
          <Database size={16} className="text-slate-400" />
          <h3 className="font-bold text-ink">Local Data</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          WashAI stores everything in your browser's localStorage — no backend yet.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            ['Orders', shopOrders.length],
            ['Customers', shopCustomers.length],
            ['Storage keys', 7],
          ].map(([label, n]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
              <p className="text-xl font-extrabold text-ink tabular-nums leading-none">{n}</p>
              <p className="text-[10px] font-semibold text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setConfirmReset(true)} className="btn-danger">
          <RotateCcw size={15} /> Reset all demo data
        </button>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all data?"
        subtitle="This clears localStorage and reseeds the demo"
        icon={<Trash2 size={19} />}
        size="sm"
      >
        <p className="text-sm text-slate-600 leading-relaxed">
          Every order, customer, rider and inventory item you've created will be wiped and replaced
          with the original demo seed. This can't be undone.
        </p>
        <div className="flex gap-2 mt-5">
          <button onClick={() => setConfirmReset(false)} className="btn-ghost flex-1">
            Keep my data
          </button>
          <button onClick={hardReset} className="btn bg-red-500 text-white hover:bg-red-600 flex-1">
            Yes, reset everything
          </button>
        </div>
      </Modal>
    </div>
  )
}
