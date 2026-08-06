import { useState } from 'react'
import { Smartphone, Upload, Check, Copy, ShieldCheck } from 'lucide-react'
import Modal from '../ui/Modal'
import { Field } from '../ui/Bits'
import { useApp } from '../../store/AppStore'
import { peso, PLANS } from '../../lib/constants'

const GCASH_NUMBER = '0977 812 4455'
const GCASH_NAME = 'WashAI Technologies'

export default function GCashModal({ open, onClose, plan = 'BIZ', cycle = 'monthly' }) {
  const { submitPayment, toast } = useApp()
  const [refNo, setRefNo] = useState('')
  const [senderName, setSenderName] = useState('')
  const [proof, setProof] = useState(null)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const amount = cycle === 'yearly' ? PLANS[plan].yearly : PLANS[plan].price

  const reset = () => {
    setRefNo('')
    setSenderName('')
    setProof(null)
    setDone(false)
  }

  const close = () => {
    onClose()
    setTimeout(reset, 250)
  }

  const copyNumber = () => {
    navigator.clipboard?.writeText(GCASH_NUMBER.replace(/\s/g, ''))
    setCopied(true)
    toast('GCash number copied')
    setTimeout(() => setCopied(false), 1800)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!refNo.trim() || !senderName.trim()) return
    submitPayment({ plan, cycle, amount, refNo: refNo.trim(), senderName: senderName.trim(), proofName: proof?.name })
    setDone(true)
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={done ? 'Proof submitted!' : `Pay via GCash — ${PLANS[plan].name}`}
      subtitle={done ? 'Sit tight while we verify' : `${peso(amount)} · billed ${cycle}`}
      icon={<Smartphone size={19} />}
      size="sm"
    >
      {done ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 grid place-items-center mx-auto mb-4">
            <Check size={30} strokeWidth={3} />
          </div>
          <h4 className="font-bold text-ink text-lg">Payment proof received 🫧</h4>
          <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
            Our team reviews GCash proofs within a few hours. Your{' '}
            <span className="font-bold text-brand-600">{PLANS[plan].name}</span> plan activates as soon
            as it's approved.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Reference
            </p>
            <p className="text-sm font-mono font-bold text-ink">{refNo}</p>
          </div>
          <button onClick={close} className="btn-primary w-full mt-5">
            Got it
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {/* payment target */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0057FF] to-[#0091FF] p-5 text-white shadow-lift">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">Send exactly</p>
            <p className="text-3xl font-extrabold mt-1 tabular-nums">{peso(amount)}</p>
            <div className="h-px bg-white/20 my-4" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">GCash number</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xl font-extrabold tracking-wide tabular-nums">{GCASH_NUMBER}</p>
              <button
                type="button"
                onClick={copyNumber}
                className="ml-auto flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-white/80 mt-1">{GCASH_NAME}</p>
          </div>

          <div className="flex gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
            <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Send the exact amount, then enter your GCash reference number below. Demo mode — no real
              money moves.
            </p>
          </div>

          <Field label="GCash Reference No." required>
            <input
              className="input font-mono"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              placeholder="e.g. 0012 8891 2210"
              required
            />
          </Field>

          <Field label="Sender Name" required>
            <input
              className="input"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Name on the GCash account"
              required
            />
          </Field>

          <Field label="Upload Proof (screenshot)">
            <label
              className={`flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 cursor-pointer transition ${
                proof ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/40'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProof(e.target.files?.[0] || null)}
              />
              <div
                className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${
                  proof ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {proof ? <Check size={18} /> : <Upload size={18} />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  {proof ? proof.name : 'Tap to attach screenshot'}
                </p>
                <p className="text-[11px] text-slate-400">PNG or JPG, up to 5MB</p>
              </div>
            </label>
          </Field>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={close} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Submit Proof
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
