import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Truck, Wallet, Users, Package, Bike, ClipboardList,
  Check, Sparkles, Play, Menu, X, ArrowRight, Star, Quote,
} from 'lucide-react'
import { LogoMark, LogoWordmark } from '../components/brand/Logo'
import BubblesChat from '../components/bubbles/BubblesChat'
import Modal from '../components/ui/Modal'
import { useApp } from '../store/AppStore'
import { peso, FREE_ORDER_LIMIT } from '../lib/constants'

/* ------------------------------- navbar -------------------------------- */

function Navbar({ loggedIn }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <LogoMark size={40} />
          <LogoWordmark size="md" />
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          <a
            href="#features"
            className="px-3.5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="px-3.5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition"
          >
            Pricing
          </a>
        </nav>

        <div className="flex-1" />

        <div className="hidden sm:flex items-center gap-2">
          <Link
            to={loggedIn ? '/dashboard' : '/login'}
            className="px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition"
          >
            {loggedIn ? 'Dashboard' : 'Login'}
          </Link>
          <Link to="/login" className="btn-pill-accent">
            {loggedIn ? 'Go to Dashboard' : 'Try for FREE'}
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden w-9 h-9 grid place-items-center rounded-full text-slate-600 hover:bg-slate-100 transition"
          aria-label="Menu"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-slate-100 px-4 py-3 space-y-1.5">
          <a
            href="#features"
            onClick={() => setOpen(false)}
            className="block px-3.5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-brand-50"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={() => setOpen(false)}
            className="block px-3.5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-brand-50"
          >
            Pricing
          </a>
          <Link
            to={loggedIn ? '/dashboard' : '/login'}
            className="block px-3.5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {loggedIn ? 'Dashboard' : 'Login'}
          </Link>
          <Link to="/login" className="btn-pill-accent w-full">
            {loggedIn ? 'Go to Dashboard' : 'Try for FREE'}
          </Link>
        </div>
      )}
    </header>
  )
}

/* ----------------------------- hero mock ------------------------------- */

const MOCK_ORDERS = [
  { name: 'Joy Fernandez', no: 'WA-0012', kg: '10 kg', total: 450, status: 'Pending', tone: 'accent' },
  { name: 'Andrea Lim', no: 'WA-0011', kg: '8 kg', total: 620, status: 'In Progress', tone: 'soft' },
  { name: 'Mark Cruz', no: 'WA-0010', kg: '6 kg', total: 300, status: 'Ready', tone: 'solid' },
]

const BADGE = {
  accent: 'bg-accent text-ink',
  soft: 'bg-brand-50 text-brand-600',
  solid: 'bg-brand-500 text-white',
}

function HeroMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-brand-500" />
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Orders Board
        </p>
        <span className="ml-auto text-[10px] font-extrabold px-2 py-1 rounded-full bg-slate-100 text-slate-500">
          3 active
        </span>
      </div>

      <div className="space-y-2.5">
        {MOCK_ORDERS.map((o, i) => (
          <motion.div
            key={o.no}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center text-[11px] font-extrabold shrink-0">
                {o.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink truncate leading-tight">{o.name}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {o.no} · Wash Dry Fold
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold shrink-0 ${
                  BADGE[o.tone]
                }`}
              >
                {o.status}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-2.5 pl-[46px]">
              <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-2.5 py-1 text-[10px] font-bold">
                {o.kg}
              </span>
              <span className="text-base font-extrabold text-ink tabular-nums">{peso(o.total)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        <Sparkles size={13} className="text-brand-500 shrink-0" />
        <p className="text-[11px] font-semibold text-slate-500">
          Drag-and-drop mo lang, updated na ang customer.
        </p>
      </div>
    </motion.div>
  )
}

/* ------------------------------- sections ------------------------------ */

const KPIS = [
  { icon: ShoppingBag, label: "Today's Orders", value: '3', sub: '7 this month' },
  { icon: Truck, label: 'Pending Pickups', value: '2', sub: '2 riders active' },
  { icon: Wallet, label: 'Revenue Today', value: peso(987), sub: `${peso(2377)} this month` },
  { icon: Users, label: 'Total Customers', value: '5', sub: `${peso(1722)} unpaid` },
]

const FEATURES = [
  {
    icon: ClipboardList,
    label: 'Orders',
    title: 'Kanban Board',
    body: 'New → Pickup → Washing → Ready → Delivery. I-drag mo lang ang card, saved agad at nakikita na ng customer sa tracking link nila.',
  },
  {
    icon: Bike,
    label: 'Riders',
    title: 'Rider Assignment',
    body: 'Sino ang naka-assign, sino ang libre, ilan ang tapos. Bawat order may pangalan ng rider — walang tanungan pa kung nasaan.',
  },
  {
    icon: Package,
    label: 'Inventory',
    title: 'Low-Stock Alerts',
    body: 'Detergent, fabcon, plastic. Pag lumagpas sa threshold mo, pumupula agad ang card bago ka pa maubusan sa gitna ng araw.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Marla Reyes',
    shop: 'Sudsy Corner · Cebu City',
    quote:
      'Dati notebook at calculator. Ngayon nakikita ko agad kung magkano na ang kita ko today, kahit nasa labas ako ng shop.',
  },
  {
    name: 'Jun Tolentino',
    shop: 'WaveWash Express · Quezon City',
    quote:
      'Tatlong branches ko, isang dashboard. Ang laking ginhawa sa tuwing may naghahanap ng order nila — sa track link ko na sila pinapadala.',
  },
  {
    name: 'Cathy Uy',
    shop: 'Lavanderia 24/7 · Baguio',
    quote:
      'Ang add-ons at per-kilo, auto-compute na. Wala nang mali sa singil, wala nang pabalik-balik sa customer.',
  },
]

const TIERS = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    suffix: 'forever',
    tagline: 'Pang-subok muna',
    features: [
      `${FREE_ORDER_LIMIT} orders kada buwan`,
      '1 branch',
      'Kanban order board',
      'Customer + rider management',
    ],
    cta: 'Magsimula ng Libre',
  },
  {
    id: 'BIZ',
    name: 'Biz',
    price: 499,
    suffix: '/buwan',
    tagline: 'Para sa lumalaking shop',
    popular: true,
    features: [
      'Unlimited orders',
      '3 staff accounts',
      'Walang watermark',
      'SMS notifications',
      'Full inventory management',
    ],
    cta: 'Mag-upgrade sa BIZ',
  },
  {
    id: 'GROWTH',
    name: 'Growth',
    price: 1199,
    suffix: '/buwan',
    tagline: 'Para sa maraming branch',
    features: [
      'Lahat ng nasa Biz',
      'Hanggang 5 branches',
      'Unlimited staff',
      'Live rider map',
      'Advanced reports',
    ],
    cta: 'Kunin ang Growth',
  },
]

/* -------------------------------- page --------------------------------- */

export default function Landing() {
  const { session } = useApp()
  const [demo, setDemo] = useState(false)
  const loggedIn = session?.loggedIn

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth')
    return () => document.documentElement.classList.remove('scroll-smooth')
  }, [])

  return (
    <div className="min-h-screen bg-canvas font-inter text-ink">
      <Navbar loggedIn={loggedIn} />

      {/* ---------------------------- HERO ---------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-600"
            >
              <Sparkles size={12} /> Laundry Shops, Powered by AI
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.08] mt-5"
            >
              Tigil na sa notebook,{' '}
              <span className="text-brand-500">mag-WashAI na.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-slate-500 mt-5 max-w-lg leading-relaxed"
            >
              Ang Laundry OS na gamit mo na sa loob, ipakita natin sa labas. Same dashboard, pero
              pang-benta na.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 mt-8"
            >
              <Link to="/login" className="btn-pill-primary px-6 py-3 text-base">
                Magsimula ng Libre <ArrowRight size={17} />
              </Link>
              <button onClick={() => setDemo(true)} className="btn-pill-outline px-6 py-3 text-base">
                <Play size={16} /> Panoorin Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-7"
            >
              {['Libre ang unang 50 orders', 'Walang credit card', 'GCash lang pag-upgrade'].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">
                    <span className="w-4 h-4 rounded-full bg-brand-500 grid place-items-center shrink-0">
                      <Check size={10} strokeWidth={4} className="text-white" />
                    </span>
                    {t}
                  </span>
                )
              )}
            </motion.div>
          </div>

          <HeroMock />
        </div>
      </section>

      {/* ------------------------- KPI STRIP -------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">
          Ito ang makikita mo sa dashboard mo araw-araw
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map(({ icon: Icon, label, value, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="text-[26px] leading-tight font-extrabold text-ink mt-2 tabular-nums">
                    {value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{sub}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl grid place-items-center shrink-0 bg-brand-50 text-brand-600">
                  <Icon size={19} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* -------------------------- FEATURES -------------------------- */}
      <section id="features" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-600">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">
            Lahat ng kailangan ng shop mo
          </h2>
          <p className="text-slate-500 mt-3">
            Walang setup, walang training. Buksan mo lang, gamitin mo agad.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, label, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="text-xl leading-tight font-extrabold text-ink mt-2">{title}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl grid place-items-center shrink-0 bg-brand-50 text-brand-600">
                  <Icon size={19} />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------ TESTIMONIALS ------------------------ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-600">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">
            Ginagamit na ng mga laundry shop
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
            >
              <Quote size={20} className="text-brand-500" />
              <p className="text-sm text-slate-600 leading-relaxed mt-3">"{t.quote}"</p>

              <div className="flex items-center gap-0.5 mt-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={13} className="text-accent fill-accent" />
                ))}
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center text-[11px] font-extrabold shrink-0">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{t.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{t.shop}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --------------------------- PRICING -------------------------- */}
      <section id="pricing" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-600">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">
            Simulan mo sa libre
          </h2>
          <p className="text-slate-500 mt-3">
            Mag-upgrade kapag dumami na ang labada. Walang lock-in, GCash lang ang bayad.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 items-start">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08 }}
              className={`relative bg-white rounded-2xl shadow-sm p-6 ${
                tier.popular ? 'border-2 border-accent md:-mt-3 md:pb-8' : 'border border-slate-100'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-accent text-ink px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap shadow-[0_10px_24px_-8px_rgba(255,214,10,.7)]">
                  <Sparkles size={11} /> Most Popular
                </span>
              )}

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                WashAI {tier.name}
              </p>
              <div className="flex items-end gap-1.5 mt-2">
                <span className="text-[34px] leading-none font-extrabold text-ink tabular-nums">
                  {tier.price === 0 ? '₱0' : peso(tier.price)}
                </span>
                <span className="text-sm font-semibold text-slate-400 pb-0.5">{tier.suffix}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">{tier.tagline}</p>

              <Link
                to="/login"
                className={`w-full mt-5 ${tier.popular ? 'btn-pill-accent' : 'btn-pill-outline'}`}
              >
                {tier.cta}
              </Link>

              <ul className="space-y-2.5 mt-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-4.5 h-4.5 mt-0.5 shrink-0 rounded-full bg-brand-500 grid place-items-center">
                      <Check size={11} strokeWidth={3.5} className="text-white" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --------------------------- CTA BAND ------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12 text-center">
          <LogoMark size={60} className="mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-5">
            Handa ka na bang tumigil sa notebook?
          </h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">
            Libre ang unang {FREE_ORDER_LIMIT} orders kada buwan. Walang card, walang bayad ngayon.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <Link to="/login" className="btn-pill-accent px-6 py-3 text-base">
              Try for FREE <ArrowRight size={17} />
            </Link>
            <Link to="/track" className="btn-pill-outline px-6 py-3 text-base">
              <Truck size={16} /> I-track ang labada
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------- FOOTER --------------------------- */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark size={34} />
            <LogoWordmark size="sm" />
          </div>
          <nav className="flex items-center gap-5 sm:ml-6">
            <a href="#features" className="text-xs font-semibold text-slate-500 hover:text-brand-600">
              Features
            </a>
            <a href="#pricing" className="text-xs font-semibold text-slate-500 hover:text-brand-600">
              Pricing
            </a>
            <Link to="/track" className="text-xs font-semibold text-slate-500 hover:text-brand-600">
              Track Order
            </Link>
            <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-brand-600">
              Login
            </Link>
          </nav>
          <p className="sm:ml-auto text-[11px] font-semibold text-slate-400">
            © {new Date().getFullYear()} WashAI Technologies
          </p>
        </div>
      </footer>

      {/* ---------------------------- DEMO ---------------------------- */}
      <Modal
        open={demo}
        onClose={() => setDemo(false)}
        title="Ganito gumana ang WashAI"
        subtitle="Apat na hakbang, tapos na ang araw mo"
        icon={<Play size={19} />}
        size="sm"
      >
        <ol className="space-y-3">
          {[
            ['Gumawa ng order', 'Pangalan, kilo, add-ons. Auto-compute na ang total mo.'],
            ['I-drag sa board', 'New → Washing → Ready. Isang hila lang, updated na ang status.'],
            ['I-assign ang rider', 'Sino ang kukuha, sino ang maghahatid — nakalagay sa card.'],
            ['I-share ang track link', 'Ilalagay ng customer ang number nila, sila na ang titingin.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-white grid place-items-center text-xs font-extrabold shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link to="/login" className="btn-pill-primary w-full mt-6 py-3">
          Subukan ko na <ArrowRight size={16} />
        </Link>
      </Modal>

      {/* Bubbles — same blue circle, bottom-right */}
      <BubblesChat offset="bare" />
    </div>
  )
}
