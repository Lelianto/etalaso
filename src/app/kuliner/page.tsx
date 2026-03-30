import Link from 'next/link'
import type { Metadata } from 'next'
import { getKulinerStores } from '@/lib/kuliner/queries'
import { KULINER_SUBCATEGORIES } from '@/lib/kuliner/constants'
import OpenBadge from '@/components/ui/OpenBadge'

export const metadata: Metadata = {
  title: 'Kuliner Rumahan — Pesan Makanan via WhatsApp | Etalaso',
  description: 'Temukan usaha kuliner rumahan di sekitar Anda. Pesan makanan langsung via WhatsApp — tanpa aplikasi, tanpa ribet.',
  alternates: { canonical: '/kuliner' },
}

export const revalidate = 1800

export default async function KulinerListingPage() {
  const stores = await getKulinerStores(50)

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/bisnis" className="text-sm text-neutral-500 hover:text-charcoal transition-colors hidden sm:block">
              Bisnis Lokal
            </Link>
            <Link
              href="/kuliner/daftar"
              className="text-sm bg-charcoal text-white px-5 py-2 rounded-full hover:bg-neutral-700 transition-colors"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber bg-amber/10 px-4 py-1.5 rounded-full mb-6">
            <span className="text-lg">🍳</span> Kuliner Rumahan
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-charcoal leading-tight">
            Pesan makanan rumahan{' '}
            <span className="text-amber">via WhatsApp</span>
          </h1>
          <p className="mt-4 text-neutral-500 text-lg max-w-xl mx-auto">
            Temukan usaha kuliner rumahan di sekitar Anda. Pilih menu, pesan langsung via WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {KULINER_SUBCATEGORIES.slice(0, 5).map(s => (
              <span key={s.value} className="inline-flex items-center gap-1.5 text-sm text-neutral-600 bg-white border border-neutral-100 px-3 py-1.5 rounded-full">
                {s.icon} {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Store Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {stores.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🍽️</div>
              <h2 className="text-xl font-semibold text-charcoal mb-2">Belum ada usaha terdaftar</h2>
              <p className="text-neutral-500 mb-6">Jadilah yang pertama mendaftarkan usaha kuliner rumahan Anda!</p>
              <Link
                href="/kuliner/daftar"
                className="inline-flex items-center gap-2 bg-amber text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-light transition-colors"
              >
                Daftar Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map(store => (
                  <Link
                    key={store.id}
                    href={`/kuliner/${store.customSlug || store.placeId}`}
                    className="group bg-white rounded-2xl border border-neutral-100 p-5 hover:border-amber/40 hover:shadow-lg hover:shadow-amber/5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-charcoal group-hover:text-amber transition-colors truncate">
                          {store.name}
                        </h3>
                        {store.tagline && (
                          <p className="text-xs text-neutral-400 mt-0.5 truncate">{store.tagline}</p>
                        )}
                      </div>
                      <OpenBadge operatingDays={store.operatingDays} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {store.areaNote ? (
                        <span className="text-[10px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">
                          📍 {store.areaNote}
                        </span>
                      ) : store.kecamatan ? (
                        <span className="text-[10px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">
                          📍 {store.kecamatan}
                        </span>
                      ) : null}
                      {store.deliveryMethods?.includes('pickup') && (
                        <span className="text-[10px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">🏃 Ambil sendiri</span>
                      )}
                      {store.deliveryMethods?.includes('delivery') && (
                        <span className="text-[10px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">📦 Diantar</span>
                      )}
                      {store.deliveryMethods?.includes('gojek_grab') && (
                        <span className="text-[10px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">🛵 Gojek/Grab</span>
                      )}
                    </div>
                  </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA for sellers */}
      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto bg-charcoal rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
            Punya usaha kuliner rumahan?
          </h2>
          <p className="mt-3 text-neutral-400 text-sm">
            Daftarkan gratis dan terima pesanan via WhatsApp. Tanpa biaya, tanpa komisi.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 text-neutral-300 bg-white/10 px-3 py-1.5 rounded-full">
              🍽️ Katalog online
            </span>
            <span className="inline-flex items-center gap-1.5 text-neutral-300 bg-white/10 px-3 py-1.5 rounded-full">
              💬 Pesan via WA
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber bg-amber/10 px-3 py-1.5 rounded-full font-medium">
              🔗 Link kustom
            </span>
          </div>
          <p className="mt-3 text-neutral-500 text-xs">
            Dapatkan link seperti <span className="font-mono text-amber">etalaso.id/kuliner/nama-toko</span>
          </p>
          <Link
            href="/kuliner/daftar"
            className="inline-flex items-center gap-2 mt-6 bg-amber text-white px-8 py-3.5 rounded-full font-semibold hover:bg-amber-light transition-colors"
          >
            Daftar Sekarang — Gratis
          </Link>
        </div>
      </section>
    </div>
  )
}
