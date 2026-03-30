'use client'

import { useCallback } from 'react'

/**
 * Provides a trackWaClick function via render prop pattern.
 * Wrap WhatsApp links and call trackWaClick() on click.
 */
export function useWaClickTracker(businessId: string) {
  const trackWaClick = useCallback(() => {
    fetch('/api/analytics/wa-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId }),
    }).catch(() => {})
  }, [businessId])

  return trackWaClick
}

/**
 * Wrapper component that intercepts clicks on WhatsApp links inside it
 * and tracks them automatically.
 */
export default function WaClickTracker({ businessId, children }: { businessId: string; children: React.ReactNode }) {
  const handleClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest('a')
    if (target?.href?.includes('wa.me')) {
      fetch('/api/analytics/wa-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId }),
      }).catch(() => {})
    }
  }

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  )
}
