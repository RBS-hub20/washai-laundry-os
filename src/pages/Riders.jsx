import { useState } from 'react'
import { Bike, Plus, Phone, Trash2, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppStore'
import { PageHeader, Field, Empty } from '../components/ui/Bits'
import Modal from '../components/ui/Modal'

const STATUSES = [
  { id: 'Available', tone: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { id: 'On Delivery', tone: 'bg-brand-50 text-brand-600 border-brand-200', dot: 'bg-brand-500' },
  { id: 'Off Duty', tone: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
]

export default function Riders() {
  const { shopRiders, shopOrders, addRider, updateRider, deleteRider } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', plate: '', status: 'Available' })

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.plate.trim()) return
    addRider(form)
    setForm({ name: '', phone: '', plate: '', status: 'Available' })
    setModal(false)
  }

  const activeFor = (id) =>
    shopOrders.filter((o) => o.riderId === id && o.stage !== 'completed').length
  const doneFor = (id) => shopOrders.filter((o) => o.riderId === id && o.stage === 'completed').length

  return (
    <div>
      <PageHeader
        title="Riders"
        subtitle={`${shopRiders.length} rider${shopRiders.length === 1 ? '' : 's'} on your team`}
        icon={<Bike size={20} />}
        actions={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Plus size={16} /> Add Rider
          </button>
        }
      />

      {shopRiders.length ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {shopRiders.map((r, i) => {
            const st = STATUSES.find((s) => s.id === r.status) || STATUSES[0]
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 hover:shadow-lift transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center shrink-0 shadow-lift">
                    <Bike size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink truncate">{r.name}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {r.phone}
                    </p>
                    <span className="chip bg-slate-100 text-slate-600 mt-2 font-mono text-[10px]">
                      {r.plate}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteRider(r.id)}
                    className="w-8 h-8 grid place-items-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition shrink-0"
                    aria-label={`Remove ${r.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                    <p className="text-lg font-extrabold text-ink tabular-nums leading-none">
                      {activeFor(r.id)}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">Active</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                    <p className="text-lg font-extrabold text-ink tabular-nums leading-none">
                      {doneFor(r.id)}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">Completed</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="label">Status</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {STATUSES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => updateRider(r.id, { status: s.id })}
                        className={`rounded-lg px-1.5 py-2 text-[10px] font-bold border-2 transition ${
                          r.status === s.id
                            ? s.tone
                            : 'border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {s.id}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="card">
          <Empty
            icon={<Bike size={26} />}
            title="No riders yet"
            hint="Add your delivery riders so you can assign them to pickups and deliveries."
            action={
              <button onClick={() => setModal(true)} className="btn-primary">
                <Plus size={16} /> Add Rider
              </button>
            }
          />
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Add Rider"
        subtitle="They'll show up in the order assignment dropdown"
        icon={<Bike size={19} />}
        size="sm"
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Rider Name" required>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Kier Domingo"
              required
            />
          </Field>
          <Field label="Phone Number" required>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0916 123 4567"
              required
            />
          </Field>
          <Field label="Plate Number" required>
            <input
              className="input uppercase font-mono"
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })}
              placeholder="ABC 1234"
              required
            />
          </Field>
          <Field label="Initial Status">
            <div className="grid grid-cols-3 gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setForm({ ...form, status: s.id })}
                  className={`rounded-xl px-2 py-2.5 text-[11px] font-bold border-2 transition ${
                    form.status === s.id ? s.tone : 'border-slate-200 text-slate-400'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </Field>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Rider
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
