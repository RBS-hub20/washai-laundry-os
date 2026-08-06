import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { KEYS, FREE_ORDER_LIMIT, SERVICES, ADDONS } from '../lib/constants'
import { load, save, uid, orderNo, bootstrap, resetAll } from '../lib/storage'

const Ctx = createContext(null)
export const useApp = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}

const sameMonth = (iso, ref = new Date()) => {
  const d = new Date(iso)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}
const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString()

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [shops, setShops] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [riders, setRiders] = useState([])
  const [inventory, setInventory] = useState([])
  const [payments, setPayments] = useState([])
  const [session, setSession] = useState({ shopId: 'shop_demo', role: 'owner', loggedIn: false })
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    bootstrap()
    setShops(load(KEYS.shops, []))
    setOrders(load(KEYS.orders, []))
    setCustomers(load(KEYS.customers, []))
    setRiders(load(KEYS.riders, []))
    setInventory(load(KEYS.inventory, []))
    setPayments(load(KEYS.payments, []))
    setSession(load(KEYS.session, { shopId: 'shop_demo', role: 'owner', loggedIn: false }))
    setReady(true)
  }, [])

  // persist
  useEffect(() => { if (ready) save(KEYS.shops, shops) }, [shops, ready])
  useEffect(() => { if (ready) save(KEYS.orders, orders) }, [orders, ready])
  useEffect(() => { if (ready) save(KEYS.customers, customers) }, [customers, ready])
  useEffect(() => { if (ready) save(KEYS.riders, riders) }, [riders, ready])
  useEffect(() => { if (ready) save(KEYS.inventory, inventory) }, [inventory, ready])
  useEffect(() => { if (ready) save(KEYS.payments, payments) }, [payments, ready])
  useEffect(() => { if (ready) save(KEYS.session, session) }, [session, ready])

  const shop = useMemo(
    () => shops.find((s) => s.id === session.shopId) || shops[0] || null,
    [shops, session.shopId]
  )

  /* ------------------------------- toasts ------------------------------- */
  const toast = useCallback((message, type = 'success') => {
    const id = uid('t')
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  /* ------------------------------- scoping ------------------------------ */
  const shopOrders = useMemo(
    () => orders.filter((o) => o.shopId === session.shopId),
    [orders, session.shopId]
  )
  const shopCustomers = useMemo(
    () => customers.filter((c) => c.shopId === session.shopId),
    [customers, session.shopId]
  )
  const shopRiders = useMemo(
    () => riders.filter((r) => r.shopId === session.shopId),
    [riders, session.shopId]
  )
  const shopInventory = useMemo(
    () => inventory.filter((i) => i.shopId === session.shopId),
    [inventory, session.shopId]
  )

  /* --------------------------------- plan -------------------------------- */
  const monthOrderCount = useMemo(
    () => shopOrders.filter((o) => sameMonth(o.createdAt)).length,
    [shopOrders]
  )
  const isFree = shop?.plan === 'FREE'
  const limitReached = isFree && monthOrderCount >= FREE_ORDER_LIMIT

  const ordersUsedFor = useCallback(
    (shopId) => orders.filter((o) => o.shopId === shopId && sameMonth(o.createdAt)).length,
    [orders]
  )

  /* ------------------------------- pricing ------------------------------- */
  const calcTotal = useCallback(
    (kg, serviceId, addonIds = [], pricePerKg = shop?.pricePerKg ?? 45) => {
      const svc = SERVICES.find((s) => s.id === serviceId) || SERVICES[0]
      const addonTotal = (addonIds || []).reduce(
        (sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price || 0),
        0
      )
      return Math.round((Number(kg) || 0) * pricePerKg * svc.multiplier + addonTotal)
    },
    [shop?.pricePerKg]
  )

  /* -------------------------------- orders ------------------------------- */
  const createOrder = useCallback(
    (data) => {
      if (limitReached) {
        setUpgradeOpen(true)
        toast('FREE plan limit reached — upgrade to keep creating orders.', 'error')
        return null
      }
      let customerId = data.customerId
      const cleanPhone = (data.phone || '').trim()

      // upsert customer by name+phone
      const existing = customers.find(
        (c) =>
          c.shopId === session.shopId &&
          (c.id === customerId ||
            (c.phone.replace(/\s/g, '') === cleanPhone.replace(/\s/g, '') && cleanPhone))
      )
      if (existing) {
        customerId = existing.id
      } else {
        const nc = {
          id: uid('cus'),
          shopId: session.shopId,
          name: data.customerName.trim(),
          phone: cleanPhone,
          address: data.address || '',
          createdAt: new Date().toISOString(),
        }
        setCustomers((cs) => [...cs, nc])
        customerId = nc.id
      }

      const seq = orders.filter((o) => o.shopId === session.shopId).length + 1
      const order = {
        id: uid('ord'),
        shopId: session.shopId,
        no: orderNo(seq),
        customerId,
        customerName: data.customerName.trim(),
        phone: cleanPhone,
        address: data.address || '',
        service: data.service,
        kg: Number(data.kg) || 0,
        addons: data.addons || [],
        riderId: data.riderId || null,
        paymentStatus: data.paymentStatus || 'Unpaid',
        stage: data.stage || 'new',
        total: calcTotal(data.kg, data.service, data.addons),
        pickupDate: data.pickupDate || '',
        deliveryDate: data.deliveryDate || '',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setOrders((o) => [order, ...o])
      toast(`Order ${order.no} created`)
      return order
    },
    [limitReached, customers, orders, session.shopId, calcTotal, toast]
  )

  const updateOrder = useCallback(
    (id, patch) => {
      setOrders((os) =>
        os.map((o) => {
          if (o.id !== id) return o
          const next = { ...o, ...patch, updatedAt: new Date().toISOString() }
          if (patch.kg !== undefined || patch.service !== undefined || patch.addons !== undefined) {
            next.total = calcTotal(next.kg, next.service, next.addons)
          }
          return next
        })
      )
    },
    [calcTotal]
  )

  const moveOrder = useCallback(
    (id, stage) => {
      updateOrder(id, { stage })
      const o = orders.find((x) => x.id === id)
      if (o) toast(`${o.no} → ${stage}`)
    },
    [updateOrder, orders, toast]
  )

  const deleteOrder = useCallback(
    (id) => {
      const o = orders.find((x) => x.id === id)
      setOrders((os) => os.filter((x) => x.id !== id))
      toast(`Order ${o?.no || ''} deleted`, 'error')
    },
    [orders, toast]
  )

  /* ------------------------------- customers ----------------------------- */
  const addCustomer = useCallback(
    (data) => {
      const c = {
        id: uid('cus'),
        shopId: session.shopId,
        name: data.name.trim(),
        phone: data.phone.trim(),
        address: data.address || '',
        createdAt: new Date().toISOString(),
      }
      setCustomers((cs) => [...cs, c])
      toast(`Customer ${c.name} added`)
      return c
    },
    [session.shopId, toast]
  )
  const updateCustomer = useCallback((id, patch) => {
    setCustomers((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }, [])
  const deleteCustomer = useCallback(
    (id) => {
      setCustomers((cs) => cs.filter((c) => c.id !== id))
      toast('Customer removed', 'error')
    },
    [toast]
  )

  /* --------------------------------- riders ------------------------------ */
  const addRider = useCallback(
    (data) => {
      const r = {
        id: uid('rid'),
        shopId: session.shopId,
        name: data.name.trim(),
        phone: data.phone.trim(),
        plate: data.plate.trim(),
        status: data.status || 'Available',
        createdAt: new Date().toISOString(),
      }
      setRiders((rs) => [...rs, r])
      toast(`Rider ${r.name} added`)
      return r
    },
    [session.shopId, toast]
  )
  const updateRider = useCallback((id, patch) => {
    setRiders((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }, [])
  const deleteRider = useCallback(
    (id) => {
      setRiders((rs) => rs.filter((r) => r.id !== id))
      toast('Rider removed', 'error')
    },
    [toast]
  )

  /* ------------------------------- inventory ----------------------------- */
  const addItem = useCallback(
    (data) => {
      const it = {
        id: uid('inv'),
        shopId: session.shopId,
        name: data.name.trim(),
        unit: data.unit || 'pcs',
        stock: Number(data.stock) || 0,
        lowAt: Number(data.lowAt) || 0,
        cost: Number(data.cost) || 0,
      }
      setInventory((xs) => [...xs, it])
      toast(`${it.name} added to inventory`)
      return it
    },
    [session.shopId, toast]
  )
  const updateItem = useCallback((id, patch) => {
    setInventory((xs) => xs.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }, [])
  const adjustStock = useCallback((id, delta) => {
    setInventory((xs) =>
      xs.map((i) => (i.id === id ? { ...i, stock: Math.max(0, Number(i.stock) + delta) } : i))
    )
  }, [])
  const deleteItem = useCallback(
    (id) => {
      setInventory((xs) => xs.filter((i) => i.id !== id))
      toast('Item removed', 'error')
    },
    [toast]
  )

  /* ---------------------------------- shop ------------------------------- */
  const updateShop = useCallback(
    (patch) => {
      setShops((ss) => ss.map((s) => (s.id === session.shopId ? { ...s, ...patch } : s)))
      toast('Settings saved')
    },
    [session.shopId, toast]
  )

  const setPlan = useCallback((shopId, plan) => {
    setShops((ss) => ss.map((s) => (s.id === shopId ? { ...s, plan } : s)))
  }, [])

  /* ------------------------------- payments ------------------------------ */
  const submitPayment = useCallback(
    (data) => {
      const p = {
        id: uid('pay'),
        shopId: session.shopId,
        shopName: shop?.name || 'Unknown Shop',
        plan: data.plan,
        cycle: data.cycle,
        amount: data.amount,
        refNo: data.refNo,
        senderName: data.senderName,
        proofName: data.proofName || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      setPayments((ps) => [p, ...ps])
      toast('Payment proof submitted! Waiting for approval.')
      return p
    },
    [session.shopId, shop?.name, toast]
  )

  const approvePayment = useCallback(
    (id) => {
      const p = payments.find((x) => x.id === id)
      if (!p) return
      setPayments((ps) => ps.map((x) => (x.id === id ? { ...x, status: 'approved' } : x)))
      setPlan(p.shopId, p.plan)
      toast(`${p.shopName} upgraded to ${p.plan}`)
    },
    [payments, setPlan, toast]
  )

  const rejectPayment = useCallback(
    (id) => {
      setPayments((ps) => ps.map((x) => (x.id === id ? { ...x, status: 'rejected' } : x)))
      toast('Payment rejected', 'error')
    },
    [toast]
  )

  /* --------------------------------- auth -------------------------------- */
  const login = useCallback(
    (shopId, role = 'owner') => {
      setSession({ shopId, role, loggedIn: true })
      toast('Welcome back to WashAI! 🫧')
    },
    [toast]
  )
  const logout = useCallback(() => setSession((s) => ({ ...s, loggedIn: false })), [])
  const setRole = useCallback((role) => setSession((s) => ({ ...s, role })), [])
  const switchShop = useCallback((shopId) => setSession((s) => ({ ...s, shopId })), [])

  const hardReset = useCallback(() => {
    resetAll()
    window.location.reload()
  }, [])

  /* --------------------------------- stats ------------------------------- */
  const stats = useMemo(() => {
    const todaysOrders = shopOrders.filter((o) => isToday(o.createdAt))
    const revenueToday = todaysOrders.reduce((s, o) => s + o.total, 0)
    const pendingPickups = shopOrders.filter((o) => o.stage === 'pickup' || o.stage === 'new').length
    const monthRevenue = shopOrders
      .filter((o) => sameMonth(o.createdAt))
      .reduce((s, o) => s + o.total, 0)
    const unpaid = shopOrders
      .filter((o) => o.paymentStatus !== 'Paid')
      .reduce((s, o) => s + o.total, 0)
    return {
      todayCount: todaysOrders.length,
      revenueToday,
      pendingPickups,
      totalCustomers: shopCustomers.length,
      monthOrderCount,
      monthRevenue,
      unpaid,
      activeRiders: shopRiders.filter((r) => r.status !== 'Off Duty').length,
      lowStock: shopInventory.filter((i) => Number(i.stock) <= Number(i.lowAt)).length,
    }
  }, [shopOrders, shopCustomers, shopRiders, shopInventory, monthOrderCount])

  const revenueSeries = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString('en-US', { month: 'short' })
      const rev = shopOrders
        .filter((o) => sameMonth(o.createdAt, d))
        .reduce((s, o) => s + o.total, 0)
      const cnt = shopOrders.filter((o) => sameMonth(o.createdAt, d)).length
      months.push({ month: label, revenue: rev, orders: cnt })
    }
    return months
  }, [shopOrders])

  const value = {
    ready,
    // data
    shops, orders, customers, riders, inventory, payments, session, shop,
    shopOrders, shopCustomers, shopRiders, shopInventory,
    // plan
    isFree, limitReached, monthOrderCount, ordersUsedFor, FREE_ORDER_LIMIT,
    upgradeOpen, setUpgradeOpen,
    // ops
    calcTotal, createOrder, updateOrder, moveOrder, deleteOrder,
    addCustomer, updateCustomer, deleteCustomer,
    addRider, updateRider, deleteRider,
    addItem, updateItem, adjustStock, deleteItem,
    updateShop, setPlan,
    submitPayment, approvePayment, rejectPayment,
    login, logout, setRole, switchShop, hardReset,
    // derived
    stats, revenueSeries,
    // ui
    toast, toasts,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
