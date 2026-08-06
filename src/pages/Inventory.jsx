import { useState } from 'react'
import { Package, Plus, Minus, AlertTriangle, Trash2, PackageCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppStore'
import { PageHeader, Field, StatCard, Empty } from '../components/ui/Bits'
import Modal from '../components/ui/Modal'
import { peso } from '../lib/constants'

export default function Inventory() {
  const { shopInventory, addItem, updateItem, adjustStock, deleteItem } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', unit: 'kg', stock: '', lowAt: '', cost: '' })

  const low = shopInventory.filter((i) => Number(i.stock) <= Number(i.lowAt))
  const totalValue = shopInventory.reduce((s, i) => s + Number(i.stock) * Number(i.cost), 0)

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addItem(form)
    setForm({ name: '', unit: 'kg', stock: '', lowAt: '', cost: '' })
    setModal(false)
  }

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Track detergent, fabcon, plastic and other supplies"
        icon={<Package size={20} />}
        actions={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Plus size={16} /> Add Item
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<Package size={19} />} label="Total Items" value={shopInventory.length} tone="brand" />
        <StatCard
          icon={<AlertTriangle size={19} />}
          label="Low Stock"
          value={low.length}
          sub={low.length ? 'Needs restocking' : 'All healthy'}
          tone={low.length ? 'rose' : 'emerald'}
          delay={0.05}
        />
        <StatCard
          icon={<PackageCheck size={19} />}
          label="Stock Value"
          value={peso(totalValue)}
          tone="violet"
          delay={0.1}
        />
      </div>

      {low.length > 0 && (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4 mb-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">
              {low.length} item{low.length === 1 ? '' : 's'} running low
            </p>
            <p className="text-xs text-red-600 mt-0.5">{low.map((i) => i.name).join(', ')}</p>
          </div>
        </div>
      )}

      {shopInventory.length ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {shopInventory.map((item, idx) => {
            const isLow = Number(item.stock) <= Number(item.lowAt)
            const pct = Math.min(100, (Number(item.stock) / Math.max(1, Number(item.lowAt) * 3)) * 100)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`card p-5 transition-all ${
                  isLow ? 'border-red-200 bg-red-50/40 shadow-[0_0_0_3px_rgba(239,68,68,.06)]' : 'hover:shadow-lift'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl grid place-items-center shrink-0 ${
                      isLow ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-600'
                    }`}
                  >
                    <Package size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {peso(item.cost)} per {item.unit}
                    </p>
                  </div>
                  {isLow && (
                    <span className="chip bg-red-100 text-red-600 text-[9px] shrink-0">
                      <AlertTriangle size={10} /> LOW
                    </span>
                  )}
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="w-7 h-7 grid place-items-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition shrink-0"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-4 mb-2">
                  <div>
                    <p className={`text-3xl font-extrabold tabular-nums leading-none ${isLow ? 'text-red-600' : 'text-ink'}`}>
                      {item.stock}
                      <span className="text-sm font-bold text-slate-400 ml-1">{item.unit}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Alert at {item.lowAt} {item.unit}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => adjustStock(item.id, -1)}
                      className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 grid place-items-center hover:bg-slate-200 transition active:scale-90"
                      aria-label="Decrease"
                    >
                      <Minus size={16} />
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 1)}
                      className="w-9 h-9 rounded-xl bg-brand-500 text-white grid place-items-center hover:bg-brand-600 transition active:scale-90 shadow-lift"
                      aria-label="Increase"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-brand-500'}`}
                  />
                </div>

                <div className="flex gap-2 mt-3.5">
                  <input
                    type="number"
                    min="0"
                    value={item.stock}
                    onChange={(e) => updateItem(item.id, { stock: Number(e.target.value) })}
                    className="input py-2 text-xs"
                    aria-label="Set stock"
                  />
                  <button
                    onClick={() => updateItem(item.id, { stock: Number(item.lowAt) * 4 })}
                    className="btn-ghost btn-sm shrink-0 whitespace-nowrap"
                  >
                    Restock
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="card">
          <Empty
            icon={<Package size={26} />}
            title="No inventory items"
            hint="Add detergent, fabric conditioner, plastic and more to track your supplies."
            action={
              <button onClick={() => setModal(true)} className="btn-primary">
                <Plus size={16} /> Add Item
              </button>
            }
          />
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Add Inventory Item"
        subtitle="Set a low-stock threshold to get alerts"
        icon={<Package size={19} />}
        size="sm"
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Item Name" required>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Detergent Powder"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Unit">
              <select
                className="input"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="pcs">pcs</option>
                <option value="box">box</option>
              </select>
            </Field>
            <Field label="Cost per unit">
              <input
                type="number"
                min="0"
                className="input"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                placeholder="120"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Current Stock" required>
              <input
                type="number"
                min="0"
                className="input"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="24"
                required
              />
            </Field>
            <Field label="Low-stock Alert At" required>
              <input
                type="number"
                min="0"
                className="input"
                value={form.lowAt}
                onChange={(e) => setForm({ ...form, lowAt: e.target.value })}
                placeholder="10"
                required
              />
            </Field>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
