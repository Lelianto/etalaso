'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Profil Bisnis', icon: '🏪' },
  { href: '/dashboard/products', label: 'Produk', icon: '📦' },
  { href: '/dashboard/template', label: 'Template', icon: '🎨' },
  { href: '/dashboard/upgrade', label: 'Paket', icon: '⭐' },
  { href: '/dashboard/payments', label: 'Pembayaran', icon: '💳' },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function DashboardNav(_props: { businessId: string; planId: string }) {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto pb-4 mb-2 scrollbar-none">
      {NAV_ITEMS.map((item) => {
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
