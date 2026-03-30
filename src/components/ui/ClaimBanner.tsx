'use client'

import Link from 'next/link'

interface ClaimBannerProps {
  claimUrl: string
  bannerText?: string
}

export default function ClaimBanner({ claimUrl, bannerText }: ClaimBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3 shadow-2xl">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">🏪</span>
          <p className="text-sm font-medium truncate">
            {bannerText || 'Ini bisnis Anda? Klaim supaya pelanggan bisa hubungi langsung!'}
          </p>
        </div>
        <Link
          href={claimUrl}
          className="shrink-0 bg-white text-indigo-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          Klaim
        </Link>
      </div>
    </div>
  )
}
