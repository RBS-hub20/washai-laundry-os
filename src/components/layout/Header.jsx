import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Store, ChevronDown, LogOut, ShieldCheck, User, Menu, X, Zap } from 'lucide-react'
import { useApp } from '../../store/AppStore'
import { PlanBadge } from '../ui/Bits'
import { LogoMark, LogoWordmark } from '../brand/Logo'
import { NAV } from './Sidebar'
import { NavLink } from 'react-router-dom'

export default function Header() {
  const { shop, session, setRole, logout, shops, switchShop, isFree, setUpgradeOpen } = useApp()
  const [roleOpen, setRoleOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const navigate = useNavigate()
  const loc = useLocation()
  const roleRef = useRef(null)
  const shopRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) setRoleOpen(false)
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => setDrawer(false), [loc.pathname])

  const pickRole = (role) => {
    setRole(role)
    setRoleOpen(false)
    navigate(role === 'admin' ? '/admin' : '/')
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
          {/* mobile: menu + logo */}
          <button
            onClick={() => setDrawer(true)}
            className="lg:hidden w-9 h-9 grid place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <LogoMark size={32} />
            <LogoWordmark size="sm" />
          </div>

          {/* shop switcher */}
          <div ref={shopRef} className="relative hidden lg:block">
            <button
              onClick={() => setShopOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-slate-50 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 grid place-items-center">
                <Store size={16} />
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-bold text-ink">{shop?.name}</p>
                <p className="text-[11px] text-slate-400">{shop?.address}</p>
              </div>
              <ChevronDown size={15} className="text-slate-400" />
            </button>
            {shopOpen && (
              <div className="absolute left-0 mt-2 w-72 card p-1.5 shadow-lift z-50">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Switch shop (multi-tenant)
                </p>
                {shops.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      switchShop(s.id)
                      setShopOpen(false)
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition ${
                      s.id === session.shopId ? 'bg-brand-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink truncate">{s.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{s.owner}</p>
                    </div>
                    <PlanBadge plan={s.plan} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {isFree && (
            <button
              onClick={() => setUpgradeOpen(true)}
              className="btn-accent btn-sm hidden sm:inline-flex"
            >
              <Zap size={14} /> Upgrade
            </button>
          )}

          <PlanBadge plan={shop?.plan || 'FREE'} />

          {/* role switcher */}
          <div ref={roleRef} className="relative">
            <button
              onClick={() => setRoleOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 py-2 hover:bg-slate-50 transition"
            >
              <div
                className={`w-7 h-7 rounded-lg grid place-items-center text-white ${
                  session.role === 'admin' ? 'bg-violet-500' : 'bg-brand-500'
                }`}
              >
                {session.role === 'admin' ? <ShieldCheck size={15} /> : <User size={15} />}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:block">
                {session.role === 'admin' ? 'Super Admin' : 'Shop Owner'}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {roleOpen && (
              <div className="absolute right-0 mt-2 w-56 card p-1.5 shadow-lift z-50">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  View as
                </p>
                <button
                  onClick={() => pickRole('owner')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium ${
                    session.role === 'owner' ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50'
                  }`}
                >
                  <User size={16} /> Shop Owner
                </button>
                <button
                  onClick={() => pickRole('admin')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium ${
                    session.role === 'admin' ? 'bg-violet-50 text-violet-700' : 'hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck size={16} /> Super Admin
                </button>
                <div className="h-px bg-slate-100 my-1.5" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col animate-[slideIn_.2s_ease]">
            <div className="px-5 py-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <LogoMark size={40} />
                <LogoWordmark size="md" />
              </div>
              <button
                onClick={() => setDrawer(false)}
                className="w-8 h-8 grid place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
              {session.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  <ShieldCheck size={18} /> Super Admin
                </NavLink>
              )}
            </nav>
          </div>
          <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
        </div>
      )}
    </>
  )
}
