'use client'

import { OPERATING_DAYS } from '@/lib/kuliner/constants'

export default function OpenBadge({ operatingDays }: { operatingDays?: string[] }) {
  if (!operatingDays || operatingDays.length === 0) return null

  const jsDay = new Date().getDay()
  const today = OPERATING_DAYS[jsDay === 0 ? 6 : jsDay - 1]
  const isOpen = operatingDays.includes(today)

  return (
    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
      isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {isOpen ? 'Buka' : 'Tutup'}
    </span>
  )
}
