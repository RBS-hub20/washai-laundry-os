/**
 * Bubbles — the WashAI AI laundry assistant mascot.
 * A friendly white robot with a dark visor face, headphones, and bubbles on top.
 */
export default function Bubbles({ size = 56, waving = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      role="img"
      aria-label="Bubbles, the WashAI assistant"
    >
      <defs>
        <linearGradient id="bb-ring" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E6FE0" />
          <stop offset=".5" stopColor="#2D8BFF" />
          <stop offset="1" stopColor="#22D3C5" />
        </linearGradient>
        <linearGradient id="bb-visor" x1="36" y1="40" x2="86" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1B2340" />
          <stop offset="1" stopColor="#0B1020" />
        </linearGradient>
        <radialGradient id="bb-bub" cx=".35" cy=".3" r=".8">
          <stop stopColor="#EAF6FF" />
          <stop offset=".5" stopColor="#9BD4FF" />
          <stop offset="1" stopColor="#5AA6FF" />
        </radialGradient>
        <linearGradient id="bb-body" x1="30" y1="80" x2="95" y2="118" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E6EFFA" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="59" fill="url(#bb-ring)" />
      <circle cx="60" cy="60" r="59" fill="none" stroke="#fff" strokeWidth="2" opacity=".5" />

      {/* bubbles on top */}
      <g>
        <circle cx="58" cy="17" r="9" fill="url(#bb-bub)" opacity=".95" />
        <circle cx="55" cy="14" r="2.6" fill="#fff" opacity=".9" />
        <circle cx="44" cy="26" r="6.5" fill="url(#bb-bub)" opacity=".95" />
        <circle cx="42" cy="24" r="1.9" fill="#fff" opacity=".9" />
        <circle cx="74" cy="24" r="6" fill="url(#bb-bub)" opacity=".95" />
        <circle cx="72" cy="22" r="1.8" fill="#fff" opacity=".9" />
      </g>

      {/* head */}
      <rect x="28" y="33" width="64" height="52" rx="24" fill="url(#bb-body)" stroke="#CFE1F5" strokeWidth="1.5" />
      {/* visor */}
      <rect x="36" y="41" width="48" height="37" rx="16" fill="url(#bb-visor)" />
      {/* eyes */}
      <path d="M47 57c2.4-3.4 6.6-3.4 9 0" stroke="#5EEAD4" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="72" cy="58" r="6.2" fill="#fff" />
      <circle cx="72.5" cy="58.5" r="4" fill="#1B7FD4" />
      <circle cx="70.8" cy="56.6" r="1.5" fill="#fff" />
      <path d="M67 47.5c2.6-1.6 5.6-1.6 8 0" stroke="#5EEAD4" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {/* smile */}
      <path d="M52 66h12a6 6 0 0 1-12 0z" fill="#2D8BFF" />
      <path d="M50.5 65.5h15" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />

      {/* headphones */}
      <circle cx="27" cy="60" r="8.5" fill="#fff" stroke="#CFE1F5" strokeWidth="1.5" />
      <circle cx="93" cy="60" r="9.5" fill="#fff" stroke="#CFE1F5" strokeWidth="1.5" />
      <circle cx="93" cy="60" r="6.4" fill="#2D8BFF" />
      <text x="93" y="63.2" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff" fontFamily="Poppins, Inter, sans-serif">
        AI
      </text>

      {/* body */}
      <path d="M38 86h44a16 16 0 0 1 16 16v18H22v-18a16 16 0 0 1 16-16z" fill="url(#bb-body)" stroke="#CFE1F5" strokeWidth="1.5" />
      <path d="M50 86h20v6a10 10 0 0 1-20 0z" fill="#DCE9F8" />

      {/* waving arm */}
      <g style={waving ? { transformOrigin: '26px 96px', animation: 'bb-wave 1.2s ease-in-out infinite' } : undefined}>
        <rect x="14" y="86" width="14" height="20" rx="7" fill="#2D8BFF" />
        <circle cx="15" cy="86" r="8.5" fill="#fff" stroke="#CFE1F5" strokeWidth="1.5" />
      </g>

      {/* laundry basket */}
      <g>
        <path d="M84 100h26l-3 20H87z" fill="#1E6FE0" />
        <path d="M86 96c6-4 14-5 22-2l-1 6H85z" fill="#5AA6FF" />
        <g stroke="#2D8BFF" strokeWidth="1.4" opacity=".55">
          <path d="M90 104v14M97 104v14M104 104v14" />
        </g>
      </g>

      <style>{`@keyframes bb-wave{0%,100%{transform:rotate(0)}50%{transform:rotate(-22deg)}}`}</style>
    </svg>
  )
}

/** Compact head-only version for the chat launcher button. */
export function BubblesHead({ size = 36, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bh-visor" x1="16" y1="20" x2="64" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1B2340" />
          <stop offset="1" stopColor="#0B1020" />
        </linearGradient>
        <radialGradient id="bh-bub" cx=".35" cy=".3" r=".8">
          <stop stopColor="#EAF6FF" />
          <stop offset=".6" stopColor="#9BD4FF" />
          <stop offset="1" stopColor="#5AA6FF" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="11" r="7" fill="url(#bh-bub)" />
      <circle cx="28" cy="9" r="2" fill="#fff" opacity=".9" />
      <circle cx="48" cy="14" r="5" fill="url(#bh-bub)" />
      <circle cx="46.5" cy="12.5" r="1.5" fill="#fff" opacity=".9" />
      <rect x="8" y="24" width="64" height="50" rx="23" fill="#fff" />
      <rect x="16" y="31" width="48" height="37" rx="16" fill="url(#bh-visor)" />
      <path d="M27 47c2.4-3.4 6.6-3.4 9 0" stroke="#5EEAD4" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="52" cy="48" r="6.2" fill="#fff" />
      <circle cx="52.5" cy="48.5" r="4" fill="#1B7FD4" />
      <circle cx="50.8" cy="46.6" r="1.5" fill="#fff" />
      <path d="M32 56h12a6 6 0 0 1-12 0z" fill="#2D8BFF" />
      <path d="M30.5 55.5h15" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="7" cy="50" r="7" fill="#fff" />
      <circle cx="73" cy="50" r="7.6" fill="#fff" />
      <circle cx="73" cy="50" r="5" fill="#2D8BFF" />
    </svg>
  )
}
