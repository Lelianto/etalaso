import Link from 'next/link'
import type { Metadata } from 'next'
import supabase from '@/lib/db/supabase'
import { Suspense } from 'react'
import CategoryFilter from './CategoryFilter'
import BusinessList from './BusinessList'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Daftar Bisnis Lokal — Etalaso',
  description: 'Jelajahi ribuan bisnis lokal Indonesia berdasarkan kota dan kategori. Temukan dan hubungi langsung via WhatsApp.',
}

export default async function BisnisPage() {
  const { data: businesses } = await supabase
    .from('Business')
    .select('name, address, category, kecamatan, region, whatsappNumber')
    .order('name')

  // Build category list with counts
  const categoryCounts: Record<string, number> = {}
  for (const biz of businesses || []) {
    const cat = biz.category || 'Lainnya'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  }
  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Nav */}
      <nav className="border-b border-neutral-200/60 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-charcoal transition-colors"
          >
            Beranda
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-charcoal mb-2">
          Daftar Bisnis
        </h1>
        <p className="text-neutral-500 mb-6">
          {businesses?.length || 0} bisnis terdaftar
        </p>

        {/* Category filter */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-neutral-500 mb-3">Filter kategori</h2>
          <Suspense>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        {/* Filtered business list */}
        <Suspense>
          <BusinessList businesses={businesses || []} />
        </Suspense>
      </main>
    </div>
  )
}
