'use client'

import { useEffect } from 'react'

export default function ViewTracker({ businessId, path }: { businessId: string; path?: string }) {
  useEffect(() => {
    // Fire-and-forget pageview
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, path }),
    }).catch(() => {})
  }, [businessId, path])

  return null
}
