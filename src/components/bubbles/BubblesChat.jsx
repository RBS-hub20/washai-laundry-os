import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Bubbles, { BubblesHead } from '../brand/Bubbles'
import { useApp } from '../../store/AppStore'
import { ask, QUICK_ACTIONS } from './brain'

/** Renders **bold** and line breaks. */
function RichText({ text }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <span key={i} className="block min-h-[2px]">
          {line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**'))
              return (
                <strong key={j} className="font-bold">
                  {part.slice(2, -2)}
                </strong>
              )
            if (part.startsWith('`') && part.endsWith('`'))
              return (
                <code key={j} className="px-1 py-0.5 rounded bg-brand-50 text-brand-700 text-[11px] font-mono">
                  {part.slice(1, -1)}
                </code>
              )
            return part
          })}
        </span>
      ))}
    </>
  )
}

function Typing() {
  return (
    <div className="flex items-center gap-1 px-4 py-3.5 bg-white rounded-2xl rounded-bl-md shadow-soft border border-slate-100 w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-brand-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

/**
 * `offset` shifts the launcher/panel up on mobile to clear the app's bottom nav.
 * Default matches the dashboard shell; pass "bare" on pages without a bottom nav.
 */
export default function BubblesChat({ offset = 'shell' }) {
  const bare = offset === 'bare'
  const launcherPos = bare ? 'bottom-6' : 'bottom-[86px] lg:bottom-6'
  const panelPos = bare
    ? 'bottom-[96px] max-h-[calc(100vh-140px)]'
    : 'bottom-[160px] lg:bottom-[96px] max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-140px)]'
  const app = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [unread, setUnread] = useState(true)
  const [messages, setMessages] = useState([
    {
      id: 'm0',
      from: 'bot',
      text:
        "Hi! I'm **Bubbles**, your WashAI assistant! 🫧\n\nI know this whole app inside out — orders, riders, inventory, plans, tracking. Ask me anything, or tap a button below to get started.",
      actions: [],
    },
  ])
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const ctx = {
    shopName: app.shop?.name || 'your shop',
    plan: app.shop?.plan || 'FREE',
    pricePerKg: app.shop?.pricePerKg ?? 45,
    used: app.monthOrderCount,
    monthRevenue: app.stats.monthRevenue,
    todayCount: app.stats.todayCount,
    pendingPickups: app.stats.pendingPickups,
    totalCustomers: app.stats.totalCustomers,
    lowStock: app.stats.lowStock,
  }

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  useEffect(() => {
    if (open) {
      setUnread(false)
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [open])

  const send = (raw) => {
    const text = (raw ?? input).trim()
    if (!text || typing) return
    setInput('')
    setMessages((m) => [...m, { id: `u${Date.now()}`, from: 'user', text }])
    setTyping(true)
    const answer = ask(text, ctx)
    const delay = Math.min(1400, 500 + answer.text.length * 1.6)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: `b${Date.now()}`, from: 'bot', ...answer }])
    }, delay)
  }

  const runAction = (a) => {
    if (a.prompt) return send(a.prompt)
    if (a.action === 'upgrade') {
      app.setUpgradeOpen(true)
      setOpen(false)
      return
    }
    if (a.to) {
      navigate(a.to)
      setOpen(false)
    }
  }

  return (
    <>
      {/* launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`fixed right-4 sm:right-6 ${launcherPos} z-[60] w-16 h-16 rounded-full
                   bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow grid place-items-center
                   ring-4 ring-white`}
        aria-label="Chat with Bubbles"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} className="text-white" />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
              <BubblesHead size={44} />
            </motion.span>
          )}
        </AnimatePresence>

        {!open && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping bg-brand-400/25" />
            {unread && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-ink text-[10px] font-extrabold grid place-items-center ring-2 ring-white">
                1
              </span>
            )}
            {/* floating bubbles */}
            <span className="pointer-events-none absolute -top-1 left-2 w-2 h-2 rounded-full bg-white/70 animate-bubbleUp" />
            <span className="pointer-events-none absolute -top-1 right-3 w-1.5 h-1.5 rounded-full bg-white/60 animate-bubbleUp [animation-delay:1.2s]" />
          </>
        )}
      </motion.button>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className={`fixed z-[59] right-3 sm:right-6 ${panelPos}
                       w-[calc(100vw-1.5rem)] sm:w-[400px] h-[540px]
                       bg-canvas rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden`}
          >
            {/* header */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-4 py-3.5 flex items-center gap-3 shrink-0">
              <div className="relative">
                <Bubbles size={44} waving />
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-brand-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-white leading-tight flex items-center gap-1.5">
                  Bubbles <Sparkles size={13} className="text-accent" />
                </p>
                <p className="text-[11px] text-brand-100">AI Laundry Assistant · Online</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 grid place-items-center rounded-lg text-white/80 hover:bg-white/15"
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : ''}`}
                >
                  {m.from === 'bot' && (
                    <div className="w-7 h-7 shrink-0 rounded-full bg-white grid place-items-center shadow-soft border border-slate-100 mt-auto">
                      <BubblesHead size={20} />
                    </div>
                  )}
                  <div className={`max-w-[82%] ${m.from === 'user' ? 'items-end' : ''}`}>
                    <div
                      className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        m.from === 'user'
                          ? 'bg-brand-500 text-white rounded-2xl rounded-br-md shadow-lift'
                          : 'bg-white text-slate-700 rounded-2xl rounded-bl-md shadow-soft border border-slate-100'
                      }`}
                    >
                      <RichText text={m.text} />
                    </div>
                    {!!m.actions?.length && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.actions.map((a, i) => (
                          <button
                            key={i}
                            onClick={() => runAction(a)}
                            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white border border-brand-200
                                       text-brand-600 hover:bg-brand-50 transition active:scale-95"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-white grid place-items-center shadow-soft border border-slate-100 mt-auto">
                    <BubblesHead size={20} />
                  </div>
                  <Typing />
                </div>
              )}
            </div>

            {/* quick actions */}
            <div className="px-3 pb-2 shrink-0">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {QUICK_ACTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={typing}
                    className="whitespace-nowrap text-[11px] font-semibold px-3 py-1.5 rounded-full
                               bg-white border border-slate-200 text-slate-600 hover:border-brand-300
                               hover:text-brand-600 transition disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="p-3 pt-1 flex items-center gap-2 shrink-0 border-t border-slate-100 bg-white"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Bubbles anything…"
                className="flex-1 rounded-full border border-slate-200 bg-canvas px-4 py-2.5 text-[13px]
                           outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="w-10 h-10 shrink-0 rounded-full bg-brand-500 text-white grid place-items-center
                           shadow-lift hover:bg-brand-600 transition active:scale-95 disabled:opacity-40"
                aria-label="Send"
              >
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
