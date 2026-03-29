'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const BASE_NAV_ITEMS = [
  { href: '/dashboard', label: 'Profil Bisnis', icon: '🏪' },
  { href: '/dashboard/products', label: 'Produk', icon: '📦' },
  { href: '/dashboard/template', label: 'Template', icon: '🎨' },
  { href: '/dashboard/upgrade', label: 'Paket', icon: '⭐' },
  { href: '/dashboard/payments', label: 'Pembayaran', icon: '💳' },
]

export default function DashboardNav({ planId, isKuliner }: { businessId: string; planId: string; isKuliner: boolean }) {
  const pathname = usePathname()

  const navItems = useMemo(() => {
    const items = [...BASE_NAV_ITEMS]
    // UMKM + Business: QR code
    if (planId === 'umkm' || planId === 'business') {
      items.splice(3, 0, {
        href: '/dashboard/qr-code',
        label: isKuliner ? 'QR Meja' : 'QR Bisnis',
        icon: '📱',
      })
    }
    // Business only: Info Pembayaran
    if (planId === 'business') {
      items.splice(4, 0, { href: '/dashboard/payment-config', label: 'Info Pembayaran', icon: '🏦' })
    }
    return items
  }, [planId, isKuliner])

  return (
    <nav className="flex gap-1 overflow-x-auto pb-4 mb-2 scrollbar-none">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
