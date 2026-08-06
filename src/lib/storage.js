import { KEYS } from './constants'

export const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('WashAI: failed to persist', key, e)
  }
}

export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

const pad = (n) => String(n).padStart(4, '0')
export const orderNo = (n) => `WA-${pad(n)}`

const daysAgo = (d) => {
  const x = new Date()
  x.setDate(x.getDate() - d)
  return x.toISOString()
}
const daysAhead = (d) => {
  const x = new Date()
  x.setDate(x.getDate() + d)
  return x.toISOString().slice(0, 10)
}
const today = () => new Date().toISOString().slice(0, 10)

/* ------------------------------ seed data ------------------------------ */

const SEED_SHOPS = [
  {
    id: 'shop_demo',
    name: 'Bubble Fresh Laundry',
    owner: 'Ren Sombilon',
    email: 'demo@washai.ph',
    phone: '0917 555 0101',
    address: '12 Mabini St, Davao City',
    plan: 'FREE',
    pricePerKg: 45,
    branches: 1,
    createdAt: daysAgo(64),
  },
  {
    id: 'shop_sudsy',
    name: 'Sudsy Corner',
    owner: 'Marla Reyes',
    email: 'marla@sudsy.ph',
    phone: '0918 222 3344',
    address: '8 Rizal Ave, Cebu City',
    plan: 'BIZ',
    pricePerKg: 55,
    branches: 1,
    createdAt: daysAgo(190),
  },
  {
    id: 'shop_wave',
    name: 'WaveWash Express',
    owner: 'Jun Tolentino',
    email: 'jun@wavewash.ph',
    phone: '0920 811 7788',
    address: '221 Katipunan, Quezon City',
    plan: 'GROWTH',
    pricePerKg: 60,
    branches: 3,
    createdAt: daysAgo(310),
  },
  {
    id: 'shop_lav',
    name: 'Lavanderia 24/7',
    owner: 'Cathy Uy',
    email: 'cathy@lav247.ph',
    phone: '0927 400 1290',
    address: '5 Session Rd, Baguio',
    plan: 'FREE',
    pricePerKg: 40,
    branches: 1,
    createdAt: daysAgo(21),
  },
]

const SEED_CUSTOMERS = [
  { id: 'cus_1', shopId: 'shop_demo', name: 'Andrea Lim', phone: '0917 231 8890', address: '14 Jacinto Ext, Davao City', createdAt: daysAgo(60) },
  { id: 'cus_2', shopId: 'shop_demo', name: 'Marco Villanueva', phone: '0928 774 1120', address: '77 Bajada Rd, Davao City', createdAt: daysAgo(48) },
  { id: 'cus_3', shopId: 'shop_demo', name: 'Joy Fernandez', phone: '0919 550 3311', address: '3 Ecoland Dr, Davao City', createdAt: daysAgo(33) },
  { id: 'cus_4', shopId: 'shop_demo', name: 'Paolo Cruz', phone: '0936 118 9042', address: '210 Matina Aplaya, Davao City', createdAt: daysAgo(19) },
  { id: 'cus_5', shopId: 'shop_demo', name: 'Rina Santos', phone: '0945 620 7781', address: '9 Lanang Blvd, Davao City', createdAt: daysAgo(8) },
]

const SEED_RIDERS = [
  { id: 'rid_1', shopId: 'shop_demo', name: 'Kier Domingo', phone: '0916 442 1180', plate: 'ABC 1234', status: 'Available', createdAt: daysAgo(70) },
  { id: 'rid_2', shopId: 'shop_demo', name: 'Nico Bautista', phone: '0921 300 5567', plate: 'XYZ 7788', status: 'On Delivery', createdAt: daysAgo(70) },
]

const SEED_INVENTORY = [
  { id: 'inv_1', shopId: 'shop_demo', name: 'Detergent Powder', unit: 'kg', stock: 24, lowAt: 10, cost: 120 },
  { id: 'inv_2', shopId: 'shop_demo', name: 'Fabric Conditioner', unit: 'L', stock: 6, lowAt: 8, cost: 95 },
  { id: 'inv_3', shopId: 'shop_demo', name: 'Plastic Packaging', unit: 'pcs', stock: 140, lowAt: 50, cost: 2 },
  { id: 'inv_4', shopId: 'shop_demo', name: 'Bleach', unit: 'L', stock: 3, lowAt: 5, cost: 80 },
  { id: 'inv_5', shopId: 'shop_demo', name: 'Hangers', unit: 'pcs', stock: 65, lowAt: 30, cost: 6 },
]

function seedOrders() {
  const rows = [
    { c: 'cus_1', kg: 6.5, svc: 'wdf', stage: 'completed', addons: ['fabcon'], rider: 'rid_1', pay: 'Paid', ago: 26 },
    { c: 'cus_2', kg: 4, svc: 'press', stage: 'completed', addons: [], rider: 'rid_2', pay: 'Paid', ago: 22 },
    { c: 'cus_3', kg: 9, svc: 'wdf', stage: 'completed', addons: ['fabcon', 'fold'], rider: 'rid_1', pay: 'Paid', ago: 17 },
    { c: 'cus_4', kg: 3.5, svc: 'dryclean', stage: 'completed', addons: [], rider: null, pay: 'Paid', ago: 12 },
    { c: 'cus_5', kg: 7, svc: 'wdf', stage: 'completed', addons: ['rush'], rider: 'rid_2', pay: 'Paid', ago: 8 },
    { c: 'cus_1', kg: 5, svc: 'wdf', stage: 'delivery', addons: ['fabcon'], rider: 'rid_2', pay: 'Paid', ago: 2 },
    { c: 'cus_3', kg: 11, svc: 'wdf', stage: 'ready', addons: ['fold'], rider: 'rid_1', pay: 'Partial', ago: 2 },
    { c: 'cus_2', kg: 2.5, svc: 'dryclean', stage: 'ready', addons: [], rider: null, pay: 'Unpaid', ago: 1 },
    { c: 'cus_5', kg: 8, svc: 'wdf', stage: 'washing', addons: ['rush', 'fabcon'], rider: 'rid_1', pay: 'Paid', ago: 1 },
    { c: 'cus_4', kg: 6, svc: 'press', stage: 'washing', addons: [], rider: null, pay: 'Unpaid', ago: 0 },
    { c: 'cus_1', kg: 4.5, svc: 'wdf', stage: 'pickup', addons: ['fabcon'], rider: 'rid_2', pay: 'Unpaid', ago: 0 },
    { c: 'cus_3', kg: 10, svc: 'wdf', stage: 'new', addons: [], rider: null, pay: 'Unpaid', ago: 0 },
  ]
  const shop = SEED_SHOPS[0]
  return rows.map((r, i) => {
    const cust = SEED_CUSTOMERS.find((c) => c.id === r.c)
    const svc = { wdf: 1, press: 1.2, dryclean: 2 }[r.svc]
    const addonPrices = { fabcon: 10, rush: 50, fold: 15 }
    const addonTotal = r.addons.reduce((s, a) => s + addonPrices[a], 0)
    const total = Math.round(r.kg * shop.pricePerKg * svc + addonTotal)
    return {
      id: `ord_seed_${i + 1}`,
      shopId: shop.id,
      no: orderNo(i + 1),
      customerId: cust.id,
      customerName: cust.name,
      phone: cust.phone,
      address: cust.address,
      service: r.svc,
      kg: r.kg,
      addons: r.addons,
      riderId: r.rider,
      paymentStatus: r.pay,
      stage: r.stage,
      total,
      pickupDate: daysAhead(-r.ago),
      deliveryDate: daysAhead(Math.max(0, 2 - r.ago)),
      notes: '',
      createdAt: daysAgo(r.ago),
      updatedAt: daysAgo(r.ago),
    }
  })
}

const SEED_PAYMENTS = [
  {
    id: 'pay_1',
    shopId: 'shop_lav',
    shopName: 'Lavanderia 24/7',
    plan: 'BIZ',
    cycle: 'monthly',
    amount: 499,
    refNo: 'GC-8842-1190',
    senderName: 'Cathy Uy',
    status: 'pending',
    createdAt: daysAgo(1),
  },
  {
    id: 'pay_2',
    shopId: 'shop_sudsy',
    shopName: 'Sudsy Corner',
    plan: 'GROWTH',
    cycle: 'yearly',
    amount: 11990,
    refNo: 'GC-2210-7734',
    senderName: 'Marla Reyes',
    status: 'pending',
    createdAt: daysAgo(3),
  },
]

/* ------------------------------ bootstrap ------------------------------ */

export function bootstrap() {
  if (!localStorage.getItem(KEYS.shops)) save(KEYS.shops, SEED_SHOPS)
  if (!localStorage.getItem(KEYS.customers)) save(KEYS.customers, SEED_CUSTOMERS)
  if (!localStorage.getItem(KEYS.riders)) save(KEYS.riders, SEED_RIDERS)
  if (!localStorage.getItem(KEYS.inventory)) save(KEYS.inventory, SEED_INVENTORY)
  if (!localStorage.getItem(KEYS.orders)) save(KEYS.orders, seedOrders())
  if (!localStorage.getItem(KEYS.payments)) save(KEYS.payments, SEED_PAYMENTS)
  if (!localStorage.getItem(KEYS.session))
    save(KEYS.session, { shopId: 'shop_demo', role: 'owner', loggedIn: false })
}

export function resetAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  bootstrap()
}

export { today, daysAhead }
