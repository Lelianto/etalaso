import Link from 'next/link'
import type { Metadata } from 'next'
import supabase from '@/lib/db/supabase'
import BusinessList from './BusinessList'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Daftar Bisnis Lokal',
  description: 'Jelajahi ribuan bisnis lokal Indonesia berdasarkan kota dan kategori. Temukan warung, bengkel, salon, toko, dan lainnya. Hubungi langsung via WhatsApp.',
  alternates: {
    canonical: '/bisnis',
  },
  openGraph: {
    title: 'Daftar Bisnis Lokal — Etalaso',
    description: 'Jelajahi ribuan bisnis lokal Indonesia berdasarkan kota dan kategori. Hubungi langsung via WhatsApp.',
    url: '/bisnis',
  },
}

export default async function BisnisPage() {
  // Fetch lightweight columns for filter metadata (category + kecamatan + region)
  // Supabase default limit is 1000, so we need to paginate to get all
  const allMeta: Array<{ category: string | null; kecamatan: string | null; region: string | null }> = []
  let from = 0
  const batchSize = 1000
  while (true) {
    const { data } = await supabase
      .from('Business')
      .select('name, category, kecamatan, region')
      .range(from, from + batchSize - 1)
    if (!data || data.length === 0) break
    for (const row of data) {
      // Skip dirty names (junk from scraping: ".", ",,,,", single chars)
      const letters = row.name.replace(/[^a-zA-Z0-9]/g, '')
      if (letters.length >= 2) allMeta.push(row)
    }
    if (data.length < batchSize) break
    from += batchSize
  }

  // Single source of truth: totalCount comes from the same filtered data
  const totalCount = allMeta.length

  // Build category counts
  const categoryCounts: Record<string, number> = {}
  for (const row of allMeta) {
    const cat = row.category || 'lainnya'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  }
  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // Build kecamatan counts with region info
  const kecamatanMap: Record<string, { count: number; region: string }> = {}
  for (const row of allMeta) {
    const kec = row.kecamatan || 'Lainnya'
    if (!kecamatanMap[kec]) kecamatanMap[kec] = { count: 0, region: row.region || '' }
    kecamatanMap[kec].count++
  }
  const kecamatans = Object.entries(kecamatanMap)
    .map(([name, { count, region }]) => ({ name, count, region }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-[var(--background)]">
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
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl text-charcoal">
              Daftar Bisnis
            </h1>
            <p className="mt-1 text-neutral-500 text-sm">
              {(totalCount || 0).toLocaleString('id-ID')} bisnis terdaftar
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mb-8 bg-gradient-to-r from-amber/5 to-terracotta/5 rounded-2xl border border-amber/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-charcoal text-lg">Daftarkan Bisnis Anda</h2>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-neutral-600">
              <span>&#10003; Halaman bisnis otomatis</span>
              <span>&#10003; Template dasar</span>
              <span>&#10003; Tombol WhatsApp</span>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/daftar"
              className="bg-charcoal text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-700 transition-colors"
            >
              Daftar Gratis
            </Link>
            <Link
              href="/demo"
              className="border border-neutral-300 text-charcoal px-5 py-2.5 rounded-full text-sm font-medium hover:border-neutral-400 hover:bg-white transition-colors"
            >
              Lihat Template
            </Link>
          </div>
        </div>

        <BusinessList
          totalCount={totalCount || 0}
          categories={categories}
          kecamatans={kecamatans}
        />
      </main>
    </div>
  )
}
