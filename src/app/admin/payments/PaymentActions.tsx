'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PaymentActions({ paymentId, userId, planId }: { paymentId: string; userId: string; planId: string }) {
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [showReject, setShowReject] = useState(false)
  const router = useRouter()

  const handleAction = async (action: 'verify' | 'reject') => {
    setLoading(true)
    await fetch('/api/admin/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, userId, planId, action, note }),
    })
    setLoading(false)
    router.refresh()
  }

  if (showReject) {
    return (
      <div className="flex flex-col gap-2 shrink-0">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Alasan penolakan..."
          className="text-sm border border-slate-200 rounded-lg p-2 w-48 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('reject')}
            disabled={loading}
            className="text-xs font-semibold bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? '...' : 'Tolak'}
          </button>
          <button
            onClick={() => setShowReject(false)}
            className="text-xs text-slate-500 hover:underline"
          >
            Batal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      <button
        onClick={() => handleAction('verify')}
        disabled={loading}
        className="text-xs font-semibold bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? '...' : 'Verifikasi'}
      </button>
      <button
        onClick={() => setShowReject(true)}
        className="text-xs font-semibold text-red-600 hover:underline"
      >
        Tolak
      </button>
    </div>
  )
}
