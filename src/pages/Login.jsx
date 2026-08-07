import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Truck, Check, Store, AlertCircle } from 'lucide-react'
import { useApp } from '../store/AppStore'
import { LogoMark, LogoWordmark } from '../components/brand/Logo'
import Bubbles from '../components/brand/Bubbles'
import { api, setIdentity } from '../api'

const PERKS = [
  'Drag-and-drop order board',
  'Auto-computed pricing per KG',
  'Public tracking link for customers',
  'Low-stock alerts on supplies',
]

export default function Login() {
  const { signInWithD1 } = useApp()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const isSignup = mode === 'signup'

  const swap = (next) => {
    setMode(next)
    setError(null)
    setPassword('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)

    try {
      const res = isSignup
        ? await api.signup({ email, password, shopName })
        : await api.login({ email, password })

      const { user, shop } = res
      setIdentity({ id: user.id, email: user.email, role: user.role, shop_id: user.shop_id })
      signInWithD1(user, shop)

      // Route on the role stored in D1. renzsom2022@gmail.com is seeded as
      // super_admin, so that account lands on /admin; everyone else on /dashboard.
      navigate(user.role === 'super_admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-canvas">
      {/* left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-600 via-brand-500 to-aqua overflow-hidden">
        <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute right-0 top-1/3 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-white/10" />

        <Link to="/" className="relative flex items-center gap-3">
          <LogoMark size={52} />
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Wash<span className="text-white/80">Ai</span>
            </span>
            <p className="text-[10px] font-semibold tracking-[.14em] uppercase text-white/70">
              Smart Laundry Management
            </p>
          </div>
        </Link>

        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
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
              {PERKS.map((f) => (
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
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-8">
            <LogoMark size={48} />
            <div>
              <LogoWordmark size="lg" />
              <p className="text-[9px] font-semibold tracking-[.14em] uppercase text-slate-400">
                Laundry Shops, Powered by AI
              </p>
            </div>
          </Link>

          <h2 className="text-2xl font-extrabold text-ink tracking-tight">
            {isSignup ? 'Create your shop account' : 'Welcome back 👋'}
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            {isSignup
              ? 'Set up your laundry shop on WashAI. Free for your first 50 orders.'
              : 'Sign in to your WashAI shop dashboard.'}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {isSignup && (
              <div>
                <label className="label" htmlFor="shopName">
                  Shop Name
                </label>
                <div className="relative">
                  <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="shopName"
                    className="input pl-10 py-3"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Your laundry shop name"
                    required
                    autoComplete="organization"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  className="input pl-10 py-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourshop.ph"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  className="input pl-10 py-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
                  required
                  minLength={isSignup ? 6 : undefined}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3"
              >
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full py-3.5 text-base">
              {busy
                ? isSignup
                  ? 'Creating account…'
                  : 'Signing in…'
                : isSignup
                ? 'Create account'
                : 'Sign in to WashAI'}
              {!busy && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            {isSignup ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => swap(isSignup ? 'login' : 'signup')}
              className="font-bold text-brand-600 hover:text-brand-700"
            >
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </p>

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
