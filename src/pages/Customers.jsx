import { useState, useMemo } from 'react'
import { Users, Search, Plus, Phone, MapPin, Trash2, ArrowUpDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppStore'
import { PageHeader, Field, Empty } from '../components/ui/Bits'
import Modal from '../components/ui/Modal'
import { peso } from '../lib/constants'

export default function Customers() {
  const { shopCustomers, shopOrders, addCustomer, deleteCustomer } = useApp()
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(false)
  const [sort, setSort] = useState('spent')
  const [form, setForm] = useState({ name: '', phone: '', address: '' })

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    let list = shopCustomers.map((c) => {
      const orders = shopOrders.filter((o) => o.customerId === c.id)
      return {
        ...c,
        orderCount: orders.length,
        totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
        lastOrder: orders.length
          ? orders.reduce((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? a : b)).createdAt
          : null,
      }
    })
    if (s) list = list.filter((c) => c.name.toLowerCase().includes(s) || c.phone.includes(s))
    const cmp = {
      spent: (a, b) => b.totalSpent - a.totalSpent,
      orders: (a, b) => b.orderCount - a.orderCount,
      name: (a, b) => a.name.localeCompare(b.name),
    }
    return list.sort(cmp[sort])
  }, [shopCustomers, shopOrders, q, sort])

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    addCustomer(form)
    setForm({ name: '', phone: '', address: '' })
    setModal(false)
  }

  const totalRevenue = rows.reduce((s, c) => s + c.totalSpent, 0)

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${shopCustomers.length} customers · ${peso(totalRevenue)} lifetime value`}
        icon={<Users size={20} />}
        actions={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Plus size={16} /> Add Customer
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or phone number…"
              className="input pl-9"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input sm:w-52">
            <option value="spent">Sort: Total Spent</option>
            <option value="orders">Sort: Total Orders</option>
            <option value="name">Sort: Name (A–Z)</option>
          </select>
        </div>

        {rows.length ? (
          <>
            {/* desktop table */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full">
                <thead className="bg-slate-50/70">
                  <tr>
                    <th className="th">Customer</th>
                    <th className="th">Phone</th>
                    <th className="th">Address</th>
                    <th className="th text-right">Orders</th>
                    <th className="th text-right">Total Spent</th>
                    <th className="th" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="td">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center text-[11px] font-extrabold shrink-0">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-ink truncate">{c.name}</p>
                            {c.lastOrder && (
                              <p className="text-[11px] text-slate-400">
                                Last: {new Date(c.lastOrder).toLocaleDateString('en-PH')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="td tabular-nums">{c.phone}</td>
                      <td className="td text-slate-500 max-w-[220px] truncate">{c.address || '—'}</td>
                      <td className="td text-right">
                        <span className="chip bg-brand-50 text-brand-600 tabular-nums">{c.orderCount}</span>
                      </td>
                      <td className="td text-right font-extrabold text-ink tabular-nums">
                        {peso(c.totalSpent)}
                      </td>
                      <td className="td text-right">
                        <button
                          onClick={() => deleteCustomer(c.id)}
                          className="w-8 h-8 grid place-items-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile cards */}
            <div className="sm:hidden divide-y divide-slate-50">
              {rows.map((c) => (
                <div key={c.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center text-xs font-extrabold shrink-0">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink truncate">{c.name}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone size={10} /> {c.phone}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-ink tabular-nums">{peso(c.totalSpent)}</p>
                      <p className="text-[10px] text-slate-400">{c.orderCount} orders</p>
                    </div>
                  </div>
                  {c.address && (
                    <p className="text-[11px] text-slate-400 mt-2 flex items-start gap-1">
                      <MapPin size={10} className="mt-0.5 shrink-0" /> {c.address}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <Empty
            icon={<Users size={26} />}
            title={q ? 'No customers match that search' : 'No customers yet'}
            hint={
              q
                ? 'Try a different name or number.'
                : 'Customers are created automatically when you take an order — or add one manually.'
            }
            action={
              !q && (
                <button onClick={() => setModal(true)} className="btn-primary">
                  <Plus size={16} /> Add Customer
                </button>
              )
            }
          />
        )}
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Add Customer"
        subtitle="Save a regular so they autocomplete next time"
        icon={<Users size={19} />}
        size="sm"
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Full Name" required>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Juan Dela Cruz"
              required
            />
          </Field>
          <Field label="Phone Number" required>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0917 123 4567"
              required
            />
          </Field>
          <Field label="Address">
            <input
              className="input"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House no., street, barangay"
            />
          </Field>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
