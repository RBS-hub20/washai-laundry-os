import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Store, ShieldCheck, Truck, Check } from 'lucide-react'
import { useApp } from '../store/AppStore'
import { LogoMark, LogoWordmark } from '../components/brand/Logo'
import Bubbles from '../components/brand/Bubbles'
import { PlanBadge } from '../components/ui/Bits'

export default function Login() {
  const { shops, login } = useApp()
  const [email, setEmail] = useState('demo@washai.ph')
  const [password, setPassword] = useState('washai123')
  const [picked, setPicked] = useState('shop_demo')
  const [role, setRole] = useState('owner')

  const submit = (e) => {
    e.preventDefault()
    login(picked, role)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-canvas">
      {/* left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-600 via-brand-500 to-aqua overflow-hidden">
        <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute right-0 top-1/3 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-3">
          <LogoMark size={52} />
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Wash<span className="text-white/80">Ai</span>
            </span>
            <p className="text-[10px] font-semibold tracking-[.14em] uppercase text-white/70">
              Smart Laundry Management
            </p>
          </div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
              Laundry Shops,
              <br />
              Powered by AI.
            </h1>
            <p className="text-white/80 mt-4 max-w-sm leading-relaxed">
              Orders, riders, inventory, and customer tracking in one clean dashboard — with Bubbles,
              your AI assistant, always a tap away.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                'Drag-and-drop order board',
                'Auto-computed pricing per KG',
                'Public tracking link for customers',
                'Low-stock alerts on supplies',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-white/20 grid place-items-center shrink-0">
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="relative flex items-end justify-between">
          <p className="text-[11px] font-semibold text-white/60">
            © {new Date().getFullYear()} WashAI Technologies
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="animate-float"
          >
            <Bubbles size={110} waving />
          </motion.div>
        </div>
      </div>

      {/* right — form */}
      <div className="flex flex-col justify-center px-5 sm:px-10 lg:px-16 py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <LogoMark size={48} />
            <div>
              <LogoWordmark size="lg" />
              <p className="text-[9px] font-semibold tracking-[.14em] uppercase text-slate-400">
                Laundry Shops, Powered by AI
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-ink tracking-tight">Welcome back 👋</h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Sign in to your shop dashboard. This is a demo — any password works.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="input pl-10 py-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="input pl-10 py-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Sign in as</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 border-2 transition ${
                    role === 'owner'
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Store size={17} />
                  <span className="text-xs font-bold">Shop Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 border-2 transition ${
                    role === 'admin'
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck size={17} />
                  <span className="text-xs font-bold">Super Admin</span>
                </button>
              </div>
            </div>

            <div>
              <label className="label">Choose demo shop (multi-tenant)</label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {shops.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPicked(s.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 border-2 transition text-left ${
                      picked === s.id
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white text-brand-600 grid place-items-center shrink-0 border border-slate-100">
                      <Store size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink truncate">{s.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{s.owner}</p>
                    </div>
                    <PlanBadge plan={s.plan} />
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 text-base">
              Sign in to WashAI <ArrowRight size={17} />
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Link to="/track" className="btn-ghost w-full py-3">
            <Truck size={16} /> I'm a customer — track my laundry
          </Link>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            By continuing you agree to WashAI's Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
