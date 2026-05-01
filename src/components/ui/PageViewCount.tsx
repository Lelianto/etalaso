'use client'

import { useEffect, useState } from 'react'

export default function PageViewCount({ businessId, inline }: { businessId: string; inline?: boolean }) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/analytics/view-count?businessId=${encodeURIComponent(businessId)}`)
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {})
  }, [businessId])

  if (count === null || count === 0) return null

  const wrapperClassName = inline
    ? 'inline-flex items-center gap-2 text-sm text-neutral-500'
    : 'fixed bottom-14 left-0 right-0 z-40 flex justify-center pointer-events-none'

  const badgeClassName = inline
    ? 'inline-flex items-center gap-1 text-xs text-neutral-500'
    : 'bg-slate-800/70 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5'

  return (
    <div className={wrapperClassName}>
      <div className={badgeClassName}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={inline ? 'opacity-70' : 'opacity-70'}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>Dilihat {count.toLocaleString('id-ID')} kali</span>
      </div>
    </div>
  )
}
