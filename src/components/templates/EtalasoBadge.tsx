'use client'

import Link from 'next/link'

interface EtalasoBadgeProps {
  variant?: 'light' | 'dark'
}

/** Small pill badge linking to Etalaso landing page — for unclaimed/free businesses */
export default function EtalasoBadge({ variant = 'light' }: EtalasoBadgeProps) {
  const isDark = variant === 'dark'
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-opacity hover:opacity-80"
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
        color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      Etalaso
    </Link>
  )
}
