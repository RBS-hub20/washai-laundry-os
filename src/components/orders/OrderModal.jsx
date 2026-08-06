import { useState, useEffect, useMemo, useRef } from 'react'
import { ClipboardList, Trash2, Calculator } from 'lucide-react'
import Modal from '../ui/Modal'
import { Field } from '../ui/Bits'
import { useApp } from '../../store/AppStore'
import { SERVICES, ADDONS, PAYMENT_STATUS, STAGES, peso } from '../../lib/constants'
import { today, daysAhead } from '../../lib/storage'

const blank = () => ({
  customerId: null,
  customerName: '',
  phone: '',
  address: '',
  service: 'wdf',
  kg: '',
  addons: [],
  riderId: '',
  paymentStatus: 'Unpaid',
  stage: 'new',
  pickupDate: today(),
  deliveryDate: daysAhead(2),
  notes: '',
})

export default function OrderModal({ open, onClose, editing }) {
  const { shopCustomers, shopRiders, calcTotal, createOrder, updateOrder, deleteOrder, shop } = useApp()
  const [form, setForm] = useState(blank())
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setConfirmDel(false)
    setSuggestOpen(false)
    setForm(
      editing
        ? {
            customerId: editing.customerId,
            customerName: editing.customerName,
            phone: editing.phone,
            address: editing.address,
            service: editing.service,
            kg: String(editing.kg),
            addons: editing.addons || [],
            riderId: editing.riderId || '',
            paymentStatus: editing.paymentStatus,
            stage: editing.stage,
            pickupDate: editing.pickupDate || today(),
            deliveryDate: editing.deliveryDate || daysAhead(2),
            notes: editing.notes || '',
          }
        : blank()
    )
  }, [open, editing])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const suggestions = useMemo(() => {
    const q = form.customerName.trim().toLowerCase()
    if (!q) return []
    return shopCustomers.filter((c) => c.name.toLowerCase().includes(q) && c.name.toLowerCase() !== q).slice(0, 5)
  }, [form.customerName, shopCustomers])

  const pickCustomer = (c) => {
    setForm((f) => ({ ...f, customerId: c.id, customerName: c.name, phone: c.phone, address: c.address }))
    setSuggestOpen(false)
  }

  const toggleAddon = (id) =>
    setForm((f) => ({
      ...f,
      addons: f.addons.includes(id) ? f.addons.filter((a) => a !== id) : [...f.addons, id],
    }))

  const svc = SERVICES.find((s) => s.id === form.service)
  const base = Math.round((Number(form.kg) || 0) * (shop?.pricePerKg ?? 45) * (svc?.multiplier ?? 1))
  const addonTotal = form.addons.reduce((s, id) => s + (ADDONS.find((a) => a.id === id)?.price || 0), 0)
  const total = calcTotal(form.kg, form.service, form.addons)

  const submit = (e) => {
    e.preventDefault()
    if (!form.customerName.trim() || !form.kg) return
    if (editing) {
      updateOrder(editing.id, { ...form, kg: Number(form.kg), riderId: form.riderId || null })
    } else {
      const created = createOrder(form)
      if (!created) return // blocked by plan limit
    }
    onClose()
  }

  const remove = () => {
    deleteOrder(editing.id)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? `Edit ${editing.no}` : 'New Order'}
      subtitle={editing ? 'Update details or move the stage' : `Rate: ${peso(shop?.pricePerKg ?? 45)}/kg`}
      icon={<ClipboardList size={19} />}
      size="lg"
    >
      <form onSubmit={submit} className="space-y-5" id="order-form">
        {/* customer */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <Field label="Customer Name" required hint="Type to autocomplete existing customers">
              <input
                ref={nameRef}
                className="input"
                value={form.customerName}
                onChange={(e) => {
                  set('customerName', e.target.value)
                  set('customerId', null)
                  setSuggestOpen(true)
                }}
                onFocus={() => setSuggestOpen(true)}
                placeholder="Juan Dela Cruz"
                autoComplete="off"
                required
              />
            </Field>
            {suggestOpen && suggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 top-[68px] card p-1.5 shadow-lift max-h-52 overflow-y-auto">
                {suggestions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickCustomer(c)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-brand-50 transition"
                  >
                    <p className="text-sm font-semibold text-ink">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.phone}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Field label="Phone Number" required>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="0917 123 4567"
              required
            />
          </Field>
        </div>

        <Field label="Address">
          <input
            className="input"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="House no., street, barangay"
          />
        </Field>

        {/* service + weight */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Service Type" required>
            <div className="grid grid-cols-3 gap-1.5">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set('service', s.id)}
                  className={`rounded-xl px-2 py-2.5 text-[11px] font-bold border-2 transition ${
                    form.service === s.id
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {s.label}
                  <span className="block text-[9px] font-semibold opacity-60">×{s.multiplier}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Weight (KG)" required>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                className="input pr-10"
                value={form.kg}
                onChange={(e) => set('kg', e.target.value)}
                placeholder="6.5"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                kg
              </span>
            </div>
          </Field>
        </div>

        {/* add-ons */}
        <Field label="Add-ons">
          <div className="grid sm:grid-cols-3 gap-2">
            {ADDONS.map((a) => {
              const on = form.addons.includes(a.id)
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAddon(a.id)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 border-2 transition text-left ${
                    on ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-bold ${on ? 'text-brand-700' : 'text-slate-600'}`}>
                    {a.label}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold shrink-0 ml-2 ${
                      on ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  >
                    +₱{a.price}
                  </span>
                </button>
              )
            })}
          </div>
        </Field>

        {/* total */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-4 text-white shadow-lift">
          <div className="flex items-center gap-2 mb-2.5">
            <Calculator size={14} className="text-brand-100" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-100">
              Auto-computed total
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="text-[11px] text-brand-100 space-y-0.5">
              <p>
                {form.kg || 0}kg × {peso(shop?.pricePerKg ?? 45)} × {svc?.multiplier} = {peso(base)}
              </p>
              <p>Add-ons: {peso(addonTotal)}</p>
            </div>
            <p className="text-3xl font-extrabold tabular-nums leading-none">{peso(total)}</p>
          </div>
        </div>

        {/* logistics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Assign Rider">
            <select className="input" value={form.riderId} onChange={(e) => set('riderId', e.target.value)}>
              <option value="">— Unassigned —</option>
              {shopRiders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.status})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Payment Status">
            <select
              className="input"
              value={form.paymentStatus}
              onChange={(e) => set('paymentStatus', e.target.value)}
            >
              {PAYMENT_STATUS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Stage">
            <select className="input" value={form.stage} onChange={(e) => set('stage', e.target.value)}>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Pickup Date">
            <input
              type="date"
              className="input"
              value={form.pickupDate}
              onChange={(e) => set('pickupDate', e.target.value)}
            />
          </Field>
          <Field label="Delivery Date">
            <input
              type="date"
              className="input"
              value={form.deliveryDate}
              onChange={(e) => set('deliveryDate', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Notes">
          <textarea
            className="input resize-none"
            rows={2}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Separate whites, no bleach, etc."
          />
        </Field>

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
          {editing && (
            <button
              type="button"
              onClick={() => (confirmDel ? remove() : setConfirmDel(true))}
              className="btn-danger sm:mr-auto"
            >
              <Trash2 size={15} /> {confirmDel ? 'Tap again to confirm' : 'Delete'}
            </button>
          )}
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {editing ? 'Save Changes' : 'Create Order'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
