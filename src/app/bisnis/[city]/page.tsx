import Link from 'next/link'
import type { Metadata } from 'next'
import supabase from '@/lib/db/supabase'
import { toSlug, canonicalUrl, fromSlug, BASE_URL } from '@/lib/seo/utils'
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/structured-data'

export const revalidate = 86400

type Props = { params: Promise<{ city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const cityName = fromSlug(city)
  const pageUrl = canonicalUrl(`/bisnis/${city}`)

  // Fetch businesses to enrich description
  const { data: businesses } = await supabase
    .from('Business')
    .select('category')
    .ilike('kecamatan', `%${cityName}%`)

  const count = businesses?.length || 0
  const categories = [...new Set((businesses || []).map(b => b.category).filter(Boolean))]
  const topCategories = categories.slice(0, 3).join(', ')
  const description = count > 0
    ? `Temukan ${count} bisnis di ${cityName}: ${topCategories}. Hubungi langsung via WhatsApp.`
    : `Temukan bisnis lokal di ${cityName}. Lihat profil lengkap dan hubungi langsung via WhatsApp.`

  return {
    title: `Bisnis di ${cityName} — Etalaso`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Bisnis di ${cityName} — Etalaso`,
      description,
      type: 'website',
      url: pageUrl,
      locale: 'id_ID',
      siteName: 'Etalaso',
    },
  }
}

interface Business {
  placeId: string
  name: string
  address: string | null
  category: string | null
  kecamatan: string | null
  whatsappNumber: string | null
}

export default async function CityPage({ params }: Props) {
  const { city } = await params
  const cityName = fromSlug(city)

  const { data: businesses } = await supabase
    .from('Business')
    .select('placeId, name, address, category, kecamatan, whatsappNumber')
    .ilike('kecamatan', `%${cityName}%`)
    .order('name')

  // Group by category
  const grouped: Record<string, Business[]> = {}
  for (const biz of businesses || []) {
    const key = biz.category || 'Lainnya'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(biz)
  }

  const sortedCategories = Object.keys(grouped).sort()

  // Build flat list for JSON-LD
  const allItems = (businesses || []).map((biz, i) => ({
    name: biz.name,
    url: canonicalUrl(`/p/${city}/${toSlug(biz.category || 'bisnis')}/${toSlug(biz.name)}`),
    position: i + 1,
  }))

  const itemListJsonLd = generateItemListJsonLd({
    name: `Bisnis di ${cityName}`,
    description: `Daftar bisnis lokal di ${cityName}`,
    url: canonicalUrl(`/bisnis/${city}`),
    items: allItems,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Beranda', url: BASE_URL },
    { name: 'Bisnis', url: canonicalUrl('/bisnis') },
    { name: cityName },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-[var(--background)]">
        <nav className="border-b border-neutral-200/60 bg-[var(--background)]">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-charcoal">
              Etalaso<span className="text-amber">.</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/bisnis" className="text-neutral-500 hover:text-charcoal transition-colors">
                Semua Bisnis
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-charcoal transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/bisnis" className="hover:text-charcoal transition-colors">Bisnis</Link>
            <span>/</span>
            <span className="text-charcoal">{cityName}</span>
          </nav>

          <h1 className="font-[family-name:var(--font-display)] text-4xl text-charcoal mb-2">
            Bisnis di {cityName}
          </h1>
          <p className="text-neutral-500 mb-10">
            {businesses?.length || 0} bisnis ditemukan di {cityName}
          </p>

          {sortedCategories.length === 0 && (
            <p className="text-neutral-400 py-12 text-center">Belum ada bisnis terdaftar di {cityName}.</p>
          )}

          {sortedCategories.map((category) => {
            const catSlug = toSlug(category)
            return (
              <section key={category} className="mb-12">
                <Link
                  href={`/p/${city}/${catSlug}`}
                  className="font-semibold text-lg text-charcoal mb-4 capitalize hover:text-amber transition-colors inline-block"
                >
                  {category}
                </Link>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {grouped[category].map((biz) => {
                    const slug = toSlug(biz.name)
                    return (
                      <Link
                        key={biz.placeId}
                        href={`/p/${city}/${catSlug}/${slug}`}
                        className="block bg-white rounded-xl border border-neutral-100 p-5 hover:border-amber/40 hover:shadow-md transition-all group"
                      >
                        <div className="font-semibold text-charcoal group-hover:text-amber transition-colors">
                          {biz.name}
                        </div>
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
            )
          })}
        </main>
      </div>
    </>
  )
}
