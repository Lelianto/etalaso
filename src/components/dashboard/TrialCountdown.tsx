'use client'

import Link from 'next/link'

export default function TrialCountdown({ expiresAt, planId }: { expiresAt: string; planId: string }) {
  const expDate = new Date(expiresAt)
  const now = new Date()
  const diffMs = expDate.getTime() - now.getTime()
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))

  if (daysLeft <= 0) return null

  const isUrgent = daysLeft <= 2

  return (
    <div className={`rounded-2xl p-4 border ${
      isUrgent
        ? 'bg-red-50 border-red-200'
        : 'bg-indigo-50 border-indigo-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isUrgent ? '⏰' : '🎁'}</span>
          <div>
            <p className={`text-sm font-bold ${isUrgent ? 'text-red-800' : 'text-indigo-800'}`}>
              Trial {planId.toUpperCase()} berakhir dalam {daysLeft} hari
            </p>
            <p className={`text-xs ${isUrgent ? 'text-red-600' : 'text-indigo-600'}`}>
              {isUrgent
                ? 'Segera upgrade agar tidak kehilangan akses fitur premium!'
                : `Nikmati semua fitur premium hingga ${expDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}`
              }
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/upgrade"
          className={`shrink-0 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors ${
            isUrgent
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Upgrade
        </Link>
      </div>
    </div>
  )
}
