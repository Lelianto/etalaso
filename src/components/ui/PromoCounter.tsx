'use client'

import { useEffect, useState } from 'react'

interface PromoData {
  total: number
  remaining: number
  promoPrice: number
  promoActive: boolean
}

export default function PromoCounter({ variant = 'banner' }: { variant?: 'banner' | 'inline' }) {
  const [promo, setPromo] = useState<PromoData | null>(null)

  useEffect(() => {
    fetch('/api/promo/slots')
      .then(r => r.json())
      .then(setPromo)
      .catch(() => {})
  }, [])

  if (!promo || !promo.promoActive) return null

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full animate-pulse">
          {promo.remaining}/{promo.total} slot tersisa
        </span>
        <span className="text-slate-500">
          Harga spesial <strong className="text-red-600">Rp {promo.promoPrice.toLocaleString('id-ID')}</strong>/bulan
        </span>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-sm">Promo 50 Bisnis Pertama!</p>
          <p className="text-white/80 text-xs mt-0.5">
            Paket UMKM hanya <strong className="text-white">Rp {promo.promoPrice.toLocaleString('id-ID')}/bulan</strong> (hemat 34%)
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black">{promo.remaining}</p>
          <p className="text-white/70 text-[10px] font-semibold">/{promo.total} slot</p>
        </div>
      </div>
      <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all"
          style={{ width: `${((promo.total - promo.remaining) / promo.total) * 100}%` }}
        />
      </div>
    </div>
  )
}
