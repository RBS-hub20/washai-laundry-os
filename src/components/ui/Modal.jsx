import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, subtitle, icon, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`relative w-full ${widths[size]} bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl
                        max-h-[92vh] flex flex-col overflow-hidden`}
          >
            <div className="flex items-start gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
              {icon && (
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                  {icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-ink leading-tight">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 grid place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 sm:px-6 py-5 flex-1">{children}</div>
            {footer && (
              <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/60">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
