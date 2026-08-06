import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useApp } from '../../store/AppStore'

export default function Toasts() {
  const { toasts } = useApp()
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] flex flex-col gap-2 items-center pointer-events-none px-4 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-lift
                        text-sm font-semibold border w-full
                        ${
                          t.type === 'error'
                            ? 'bg-white text-red-600 border-red-100'
                            : 'bg-white text-emerald-700 border-emerald-100'
                        }`}
          >
            {t.type === 'error' ? (
              <AlertCircle size={17} className="shrink-0" />
            ) : (
              <CheckCircle2 size={17} className="shrink-0" />
            )}
            <span className="leading-snug">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
