import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Store, ChevronDown, LogOut, ShieldCheck, User, Menu, X, Zap } from 'lucide-react'
import { useApp } from '../../store/AppStore'
import { PlanBadge } from '../ui/Bits'
import { LogoMark, LogoWordmark } from '../brand/Logo'
import { NAV } from './Sidebar'
import { NavLink } from 'react-router-dom'
import { getIdentity } from '../../api'

export default function Header() {
  const { shop, session, setRole, logout, isFree, setUpgradeOpen } = useApp()
  const identity = getIdentity()
  const isSuperAdmin = identity?.role === 'super_admin'
  const [roleOpen, setRoleOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const navigate = useNavigate()
  const loc = useLocation()
  const roleRef = useRef(null)
  const shopRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) setRoleOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => setDrawer(false), [loc.pathname])

  const pickRole = (role) => {
    setRole(role)
    setRoleOpen(false)
    navigate(role === 'admin' ? '/admin' : '/dashboard')
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

          {/* current tenant */}
          <div ref={shopRef} className="relative hidden lg:flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">
              {session.role === 'admin' && !shop ? <ShieldCheck size={16} /> : <Store size={16} />}
            </div>
            <div className="text-left leading-tight min-w-0">
              <p className="text-sm font-bold text-ink truncate">
                {shop?.name || 'WashAI Platform'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {shop?.address || shop?.email || 'Super admin console'}
              </p>
            </div>
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

          {shop && <PlanBadge plan={shop.plan || 'FREE'} />}

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
              <div className="absolute right-0 mt-2 w-60 card p-1.5 shadow-lift z-50">
                <div className="px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Signed in as
                  </p>
                  <p className="text-xs font-semibold text-ink truncate mt-0.5">
                    {identity?.email || 'Unknown account'}
                  </p>
                </div>

                {/* Only a real super_admin in D1 can switch views. */}
                {isSuperAdmin && (
                  <>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={() => pickRole('owner')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium ${
                        session.role === 'owner' ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50'
                      }`}
                    >
                      <User size={16} /> Shop Owner view
                    </button>
                    <button
                      onClick={() => pickRole('admin')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium ${
                        session.role === 'admin' ? 'bg-violet-50 text-violet-700' : 'hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck size={16} /> Super Admin view
                    </button>
                  </>
                )}

                <div className="h-px bg-slate-100 my-1.5" />
                <button
                  onClick={() => {
                    logout()
                    navigate('/login', { replace: true })
                  }}
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
