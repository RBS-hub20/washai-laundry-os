export const KEYS = {
  shops: 'washai_shops',
  orders: 'washai_orders',
  customers: 'washai_customers',
  riders: 'washai_riders',
  inventory: 'washai_inventory',
  session: 'washai_session',
  payments: 'washai_payments',
}

export const FREE_ORDER_LIMIT = 50

export const PLANS = {
  FREE: { id: 'FREE', name: 'Free', price: 0, yearly: 0, branches: 1, staff: 1 },
  BIZ: { id: 'BIZ', name: 'Biz', price: 499, yearly: 4990, branches: 1, staff: 3 },
  GROWTH: { id: 'GROWTH', name: 'Growth', price: 1199, yearly: 11990, branches: 5, staff: Infinity },
}

export const STAGES = [
  { id: 'new', label: 'New', color: 'slate', dot: 'bg-slate-400' },
  { id: 'pickup', label: 'For Pickup', color: 'amber', dot: 'bg-amber-400' },
  { id: 'washing', label: 'Washing', color: 'blue', dot: 'bg-brand-500' },
  { id: 'ready', label: 'Ready', color: 'violet', dot: 'bg-violet-500' },
  { id: 'delivery', label: 'Out for Delivery', color: 'cyan', dot: 'bg-aqua' },
  { id: 'completed', label: 'Completed', color: 'emerald', dot: 'bg-emerald-500' },
]

export const STAGE_STYLES = {
  new: 'bg-slate-100 text-slate-700',
  pickup: 'bg-amber-100 text-amber-700',
  washing: 'bg-brand-100 text-brand-700',
  ready: 'bg-violet-100 text-violet-700',
  delivery: 'bg-cyan-100 text-cyan-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

export const SERVICES = [
  { id: 'wdf', label: 'Wash Dry Fold', multiplier: 1 },
  { id: 'press', label: 'Press', multiplier: 1.2 },
  { id: 'dryclean', label: 'Dry Clean', multiplier: 2 },
]

export const ADDONS = [
  { id: 'fabcon', label: 'Fabric Conditioner', price: 10 },
  { id: 'rush', label: 'Rush Service', price: 50 },
  { id: 'fold', label: 'Special Fold', price: 15 },
]

export const PAYMENT_STATUS = ['Unpaid', 'Partial', 'Paid']

export const peso = (n) =>
  '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
