import { requireAdmin } from '@/lib/auth/helpers'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Panel | Etalaso',
  robots: { index: false, follow: false },
}

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/claims', label: 'Klaim' },
  { href: '/admin/payments', label: 'Pembayaran' },
  { href: '/admin/businesses', label: 'Bisnis' },
  { href: '/admin/users', label: 'Pengguna' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-black tracking-tight text-white">
              etalaso <span className="text-xs font-medium text-slate-400">admin</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white">
              Dashboard →
            </Link>
            <span className="text-sm text-slate-400">{profile.name || profile.email}</span>
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}
