import { useState } from 'react'

/**
 * WashAI mark — a washing machine inside a swoosh with circuit traces and sparkles.
 * If /logo.png (or .jpg/.svg) is dropped into public/, it is used instead of the SVG.
 */
export function LogoMark({ size = 44, className = '', glow = true }) {
  const [useFile, setUseFile] = useState(true)
  const [srcIdx, setSrcIdx] = useState(0)
  const candidates = ['/logo.png', '/logo.jpg', '/logo.svg', '/washailogo.png']

  const wrap =
    'rounded-2xl overflow-hidden bg-white shrink-0 ' +
    (glow ? 'shadow-glow ring-1 ring-brand-100 ' : '') +
    className

  if (useFile && srcIdx < candidates.length) {
    return (
      <div className={wrap} style={{ width: size, height: size }}>
        <img
          src={candidates[srcIdx]}
          alt="WashAI"
          className="w-full h-full object-contain"
          onError={() => {
            if (srcIdx + 1 < candidates.length) setSrcIdx(srcIdx + 1)
            else setUseFile(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className={wrap} style={{ width: size, height: size }}>
      <LogoSvg size={size} />
    </div>
  )
}

export function LogoSvg({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" role="img" aria-label="WashAI">
      <defs>
        <linearGradient id="wa-swoosh" x1="10" y1="20" x2="105" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E6FE0" />
          <stop offset=".55" stopColor="#2D8BFF" />
          <stop offset="1" stopColor="#22D3C5" />
        </linearGradient>
        <linearGradient id="wa-drum" x1="42" y1="52" x2="82" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A3E8C" />
          <stop offset="1" stopColor="#132F63" />
        </linearGradient>
        <linearGradient id="wa-water" x1="42" y1="76" x2="82" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5AA6FF" />
          <stop offset="1" stopColor="#2D8BFF" />
        </linearGradient>
        <clipPath id="wa-clip">
          <circle cx="60" cy="73" r="20" />
        </clipPath>
      </defs>

      {/* swoosh ring */}
      <path
        d="M92 24A44 44 0 1 0 96 92c-9 7-20 11-32 11a45 45 0 1 1 28-79z"
        fill="url(#wa-swoosh)"
      />
      {/* leaf / wave tail */}
      <path d="M88 34c11 6 16 20 12 32-6-8-11-13-19-17z" fill="#22D3C5" opacity=".85" />

      {/* circuit traces */}
      <g stroke="#22D3C5" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M92 58h8l6-6" />
        <path d="M92 68h12" />
        <path d="M90 78h9l5 6" />
      </g>
      <g fill="#22D3C5">
        <circle cx="108" cy="50" r="3.2" />
        <circle cx="107" cy="68" r="3.2" />
        <circle cx="106" cy="86" r="3.2" />
      </g>

      {/* machine body */}
      <rect x="34" y="26" width="52" height="72" rx="10" fill="#fff" stroke="#132F63" strokeWidth="3.5" />
      <rect x="42" y="35" width="18" height="6" rx="3" fill="#132F63" />
      <g fill="#132F63">
        <circle cx="69" cy="38" r="2.4" />
        <circle cx="76" cy="38" r="2.4" />
        <circle cx="83" cy="38" r="2.4" />
      </g>

      {/* drum */}
      <circle cx="60" cy="73" r="23" fill="#fff" stroke="#132F63" strokeWidth="3.5" />
      <circle cx="60" cy="73" r="20" fill="url(#wa-drum)" />
      <g clipPath="url(#wa-clip)">
        <path d="M38 80c6-6 12-6 18 0s14 6 20 0v16H38z" fill="url(#wa-water)" />
      </g>
      <circle cx="68" cy="66" r="4" fill="#fff" />
      <circle cx="72" cy="76" r="3" fill="#fff" opacity=".9" />
      <circle cx="55" cy="63" r="2.2" fill="#fff" opacity=".75" />

      {/* sparkles */}
      <path d="M74 12l2.6 6.4L83 21l-6.4 2.6L74 30l-2.6-6.4L65 21l6.4-2.6z" fill="#22D3C5" />
      <path d="M62 22l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#2D8BFF" />
      <path d="M88 24l1.3 3.2 3.2 1.3-3.2 1.3L88 33l-1.3-3.2-3.2-1.3 3.2-1.3z" fill="#5AA6FF" />
    </svg>
  )
}

export function LogoWordmark({ size = 'md', className = '' }) {
  const map = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' }
  return (
    <span className={`font-extrabold tracking-tight leading-none ${map[size]} ${className}`}>
      <span className="text-brand-900">Wash</span>
      <span className="bg-gradient-to-r from-brand-500 to-aqua bg-clip-text text-transparent">Ai</span>
    </span>
  )
}

export function LogoLockup({ markSize = 44, size = 'md', tagline = false, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={markSize} />
      <div className="min-w-0">
        <LogoWordmark size={size} />
        {tagline && (
          <div className="text-[10px] font-semibold tracking-[.14em] uppercase text-slate-400 mt-0.5">
            Laundry Shops, Powered by AI
          </div>
        )}
      </div>
    </div>
  )
}
