import Link from 'next/link'
import type { Metadata } from 'next'
import supabase from '@/lib/db/supabase'
import { toSlug } from '@/lib/seo/utils'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Daftar Bisnis Lokal — Etalaso',
  description: 'Jelajahi ribuan bisnis lokal Indonesia berdasarkan kota dan kategori. Temukan dan hubungi langsung via WhatsApp.',
}

interface Business {
  name: string
  address: string | null
  category: string | null
  kecamatan: string | null
  region: string | null
  whatsappNumber: string | null
}

export default async function BisnisPage() {
  const { data: businesses } = await supabase
    .from('Business')
    .select('name, address, category, kecamatan, region, whatsappNumber')
    .order('name')

  const grouped: Record<string, Business[]> = {}
  for (const biz of businesses || []) {
    const key = biz.kecamatan || 'Lainnya'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(biz)
  }

  const sortedKecamatans = Object.keys(grouped).sort()

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
        <p className="text-neutral-500 mb-10">
          {businesses?.length || 0} bisnis terdaftar di {sortedKecamatans.length} kecamatan
        </p>

        {/* Quick nav by kecamatan */}
        <div className="flex flex-wrap gap-2 mb-12">
          {sortedKecamatans.map((k) => (
            <Link
              key={k}
              href={`/bisnis/${toSlug(k)}`}
              className="px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-sm text-charcoal hover:border-amber/40 hover:bg-amber/5 transition-colors"
            >
              {k} <span className="text-neutral-400">({grouped[k].length})</span>
            </Link>
          ))}
        </div>

        {/* Business listings grouped by kecamatan */}
        {sortedKecamatans.map((kecamatan) => (
          <section key={kecamatan} id={toSlug(kecamatan)} className="mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {kecamatan}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[kecamatan].map((biz) => {
                const city = toSlug(biz.kecamatan || 'indonesia')
                const category = toSlug(biz.category || 'bisnis')
                const slug = toSlug(biz.name)
                return (
                  <Link
                    key={biz.name}
                    href={`/p/${city}/${category}/${slug}`}
                    className="block bg-white rounded-xl border border-neutral-100 p-5 hover:border-amber/40 hover:shadow-md transition-all group"
                  >
                    <div className="font-semibold text-charcoal group-hover:text-amber transition-colors">
                      {biz.name}
                    </div>
                    {biz.category && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-neutral-100 text-xs text-neutral-500">
                        {biz.category}
                      </span>
                    )}
                    {biz.address && (
                      <p className="mt-2 text-xs text-neutral-400 line-clamp-2">{biz.address}</p>
                    )}
                    {biz.whatsappNumber && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        </svg>
                        WhatsApp
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
