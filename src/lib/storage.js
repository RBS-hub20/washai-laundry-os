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

const daysAhead = (d) => {
  const x = new Date()
  x.setDate(x.getDate() + d)
  return x.toISOString().slice(0, 10)
}
const today = () => new Date().toISOString().slice(0, 10)

/**
 * No demo tenants, orders, or customers are seeded. Accounts come from D1 via
 * /api/auth/login and /api/auth/signup; the shop record is hydrated into this
 * store on sign-in (see signInWithD1 in AppStore).
 *
 * Operational data (orders, customers, riders, inventory) is still per-browser
 * localStorage — those tables have no API endpoints yet.
 */
export function bootstrap() {
  if (!localStorage.getItem(KEYS.shops)) save(KEYS.shops, [])
  if (!localStorage.getItem(KEYS.customers)) save(KEYS.customers, [])
  if (!localStorage.getItem(KEYS.riders)) save(KEYS.riders, [])
  if (!localStorage.getItem(KEYS.inventory)) save(KEYS.inventory, [])
  if (!localStorage.getItem(KEYS.orders)) save(KEYS.orders, [])
  if (!localStorage.getItem(KEYS.payments)) save(KEYS.payments, [])
  if (!localStorage.getItem(KEYS.session))
    save(KEYS.session, { shopId: null, role: 'owner', loggedIn: false })
}

export function resetAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  localStorage.removeItem('washai_identity')
  bootstrap()
}

export { today, daysAhead }
