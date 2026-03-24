'use client'

import Link from 'next/link'

interface ClaimBannerProps {
  businessId: string
}

export default function ClaimBanner({ businessId }: ClaimBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[55] bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 text-center">
      <Link href={`/claim/${businessId}`} className="text-sm font-semibold hover:underline">
        Ini toko Anda? Klaim untuk aktifkan Scan di Meja! →
      </Link>
    </div>
  )
}
