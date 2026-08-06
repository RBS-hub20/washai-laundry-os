import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Users, Bike, Package,
  CreditCard, Settings, Truck, ShieldCheck, Sparkles,
} from 'lucide-react'
import { LogoMark, LogoWordmark } from '../brand/Logo'
import { useApp } from '../../store/AppStore'
import { FREE_ORDER_LIMIT } from '../../lib/constants'
import { ProgressBar } from '../ui/Bits'

export const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/riders', label: 'Riders', icon: Bike },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/pricing', label: 'Pricing', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/track', label: 'Track Order', icon: Truck },
]

export default function Sidebar() {
  const { session, isFree, monthOrderCount, setUpgradeOpen } = useApp()

  return (
    <aside className="hidden lg:flex w-[264px] shrink-0 flex-col bg-white border-r border-slate-100 h-screen sticky top-0">
      {/* logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-100">
        <LogoMark size={44} />
        <div className="min-w-0">
          <LogoWordmark size="md" />
          <p className="text-[9.5px] font-semibold tracking-[.12em] uppercase text-slate-400 mt-0.5">
            Powered by AI
          </p>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Menu</p>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{label}</span>
            {to === '/track' && (
              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                PUBLIC
              </span>
            )}
          </NavLink>
        ))}

        {session.role === 'admin' && (
          <>
            <p className="px-3 pt-5 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Platform
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <ShieldCheck size={18} className="shrink-0" />
              <span>Super Admin</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* usage / upgrade */}
      {isFree ? (
        <div className="m-3 p-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lift">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={15} className="text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider">Free Plan</span>
          </div>
          <p className="text-sm font-semibold mb-2 tabular-nums">
            {monthOrderCount}/{FREE_ORDER_LIMIT} orders used
          </p>
          <ProgressBar
            value={monthOrderCount}
            max={FREE_ORDER_LIMIT}
            danger={monthOrderCount >= FREE_ORDER_LIMIT * 0.8}
          />
          <button
            onClick={() => setUpgradeOpen(true)}
            className="btn-accent btn-sm w-full mt-3"
          >
            Upgrade to BIZ
          </button>
        </div>
      ) : (
        <div className="m-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-bold text-emerald-600 mb-1">✨ Unlimited orders</p>
          <p className="text-[11px] text-slate-500">You're on a paid WashAI plan. Wash on!</p>
        </div>
      )}
    </aside>
  )
}

export function MobileNav() {
  const items = NAV.slice(0, 5)
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-100 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-brand-600' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid place-items-center w-9 h-7 rounded-xl transition-colors ${
                    isActive ? 'bg-brand-50' : ''
                  }`}
                >
                  <Icon size={19} />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
