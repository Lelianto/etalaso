import Link from 'next/link'
import type { Metadata } from 'next'
import supabase from '@/lib/db/supabase'
import { toSlug, canonicalUrl, fromSlug, BASE_URL } from '@/lib/seo/utils'
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/structured-data'

export const revalidate = 86400

type Props = { params: Promise<{ city: string; category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, category } = await params
  const cityName = fromSlug(city)
  const catName = fromSlug(category)
  const pageUrl = canonicalUrl(`/p/${city}/${category}`)

  return {
    title: `Daftar ${catName} di ${cityName} — Etalaso`,
    description: `Temukan ${catName.toLowerCase()} terbaik di ${cityName}. Lihat profil, review, dan hubungi langsung via WhatsApp di Etalaso.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${catName} di ${cityName} — Etalaso`,
      description: `Daftar ${catName.toLowerCase()} di ${cityName}. Bandingkan dan hubungi langsung via WhatsApp.`,
      type: 'website',
      url: pageUrl,
      locale: 'id_ID',
      siteName: 'Etalaso',
    },
  }
}

interface Business {
  name: string
  address: string | null
  category: string | null
  kecamatan: string | null
  whatsappNumber: string | null
  description: string | null
}

export default async function CategoryPage({ params }: Props) {
  const { city, category } = await params
  const cityName = fromSlug(city)
  const catName = fromSlug(category)

  const { data: businesses } = await supabase
    .from('Business')
    .select('name, address, category, kecamatan, whatsappNumber, description')
    .ilike('kecamatan', `%${cityName}%`)
    .ilike('category', `%${catName}%`)
    .order('name')

  const items = (businesses || []).map((biz, i) => ({
    name: biz.name,
    url: canonicalUrl(`/p/${city}/${category}/${toSlug(biz.name)}`),
    position: i + 1,
  }))

  const itemListJsonLd = generateItemListJsonLd({
    name: `${catName} di ${cityName}`,
    description: `Daftar ${catName.toLowerCase()} di ${cityName}`,
    url: canonicalUrl(`/p/${city}/${category}`),
    items,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Beranda', url: BASE_URL },
    { name: cityName, url: canonicalUrl(`/bisnis/${city}`) },
    { name: catName },
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
            <Link href={`/bisnis/${city}`} className="hover:text-charcoal transition-colors">{cityName}</Link>
            <span>/</span>
            <span className="text-charcoal">{catName}</span>
          </nav>

          <h1 className="font-[family-name:var(--font-display)] text-4xl text-charcoal mb-2">
            {catName} di {cityName}
          </h1>
          <p className="text-neutral-500 mb-10">
            {businesses?.length || 0} {catName.toLowerCase()} ditemukan di {cityName}
          </p>

          {(!businesses || businesses.length === 0) && (
            <p className="text-neutral-400 py-12 text-center">
              Belum ada {catName.toLowerCase()} terdaftar di {cityName}.
            </p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(businesses || []).map((biz) => {
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
                  {biz.description && (
                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{biz.description}</p>
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
        </main>
      </div>
    </>
  )
}
