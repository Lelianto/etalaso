import Link from 'next/link'
import type { Metadata } from 'next'
import supabase from '@/lib/db/supabase'
import { BASE_URL } from '@/lib/seo/utils'
export const metadata: Metadata = {
  title: 'Etalaso — Temukan Bisnis Lokal, Hubungi Langsung via WhatsApp',
  description: 'Platform direktori bisnis lokal Indonesia. Temukan warung, bengkel, salon, toko, dan ribuan UMKM lainnya. Hubungi langsung via WhatsApp — gratis.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Etalaso — Temukan Bisnis Lokal, Hubungi Langsung via WhatsApp',
    description: 'Platform direktori bisnis lokal Indonesia. Temukan warung, bengkel, salon, toko, dan ribuan UMKM lainnya.',
    url: '/',
  },
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  kuliner: { label: 'Kuliner', icon: '🍜' },
  otomotif: { label: 'Bengkel & Otomotif', icon: '🔧' },
  kecantikan: { label: 'Salon & Kecantikan', icon: '💇' },
  jasa: { label: 'Jasa', icon: '👔' },
  retail: { label: 'Toko & Retail', icon: '🏗️' },
  kesehatan: { label: 'Apotek & Kesehatan', icon: '💊' },
}

const STEPS = [
  {
    num: '01',
    title: 'Cari Bisnis',
    desc: 'Temukan bisnis lokal berdasarkan kategori dan lokasi kecamatan Anda.',
  },
  {
    num: '02',
    title: 'Lihat Profil',
    desc: 'Buka halaman bisnis lengkap dengan produk, review, dan jam buka.',
  },
  {
    num: '03',
    title: 'Hubungi via WhatsApp',
    desc: 'Langsung chat pemilik usaha — tanpa telepon, tanpa antri.',
  },
]

const TEMPLATES = [
  { name: 'Minimalist', style: 'bg-white border border-neutral-200', accent: 'bg-neutral-900' },
  { name: 'Warung', style: 'bg-amber-50 border border-amber-200', accent: 'bg-amber' },
  { name: 'Elegant', style: 'bg-stone-50 border border-stone-300', accent: 'bg-stone-800' },
  { name: 'Bold', style: 'bg-red-50 border border-red-200', accent: 'bg-red-600' },
  { name: 'Card', style: 'bg-sky-50 border border-sky-200', accent: 'bg-sky-600' },
  { name: 'Glass', style: 'bg-violet-50/60 border border-violet-200', accent: 'bg-violet-600' },
]

export const revalidate = 3600 // refresh stats every hour

export default async function Home() {
  // Fetch total count (head-only, no row limit issue)
  const { count: businessCount } = await supabase
    .from('Business')
    .select('*', { count: 'exact', head: true })

  // Paginate to get all category + region data (Supabase limits 1000 per query)
  const allRows: Array<{ category: string | null; region: string | null }> = []
  let from = 0
  const batchSize = 1000
  while (true) {
    const { data } = await supabase
      .from('Business')
      .select('category, region')
      .range(from, from + batchSize - 1)
    if (!data || data.length === 0) break
    allRows.push(...data)
    if (data.length < batchSize) break
    from += batchSize
  }

  const uniqueRegions = new Set(allRows.filter(r => r.region).map(r => r.region!))
  const uniqueCategories = new Set(allRows.filter(c => c.category).map(c => c.category!))

  const totalBisnis = businessCount || 0
  const bisnisLabel = totalBisnis >= 1000
    ? `${(Math.floor(totalBisnis / 100) / 10).toLocaleString('id-ID')}rb+`
    : `${totalBisnis}+`

  const stats = [
    { value: bisnisLabel, label: 'Bisnis Terdaftar' },
    { value: `${uniqueRegions.size}`, label: 'Kota & Kabupaten' },
    { value: `${uniqueCategories.size}`, label: 'Kategori Bisnis' },
    { value: '100%', label: 'Gratis untuk Pengunjung' },
  ]

  // Build category counts from DB
  const catCounts: Record<string, number> = {}
  for (const c of allRows) {
    if (c.category) catCounts[c.category] = (catCounts[c.category] || 0) + 1
  }

  const dynamicCategories = Object.entries(CATEGORY_META)
    .map(([key, meta]) => ({
      name: meta.label,
      icon: meta.icon,
      count: catCounts[key] ? `${catCounts[key].toLocaleString('id-ID')}+` : '0',
    }))
    .filter(c => c.count !== '0')
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Etalaso',
    url: BASE_URL,
    description: 'Platform direktori bisnis lokal Indonesia. Temukan dan hubungi bisnis via WhatsApp.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/bisnis?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Etalaso',
    url: BASE_URL,
    description: 'Platform bisnis lokal Indonesia — hubungkan pelanggan dengan UMKM via WhatsApp.',
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/bisnis" className="text-sm text-neutral-500 hover:text-charcoal transition-colors">
              Jelajahi Bisnis
            </Link>
            <Link
              href="/daftar"
              className="text-sm bg-charcoal text-white px-5 py-2 rounded-full hover:bg-neutral-700 transition-colors"
            >
              Daftarkan Bisnis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-amber/5 blur-3xl" />
        <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full bg-terracotta/5 blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <h1 className="mt-16 animate-fade-up font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tight text-charcoal" style={{ animationDelay: '0.1s' }}>
              Temukan bisnis lokal,{' '}
              <span className="relative">
                <span className="relative z-10 text-amber">hubungi langsung</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-amber/15 -z-0 rounded" />
              </span>{' '}
              via WhatsApp.
            </h1>

            <p className="animate-fade-up mt-8 text-lg sm:text-xl text-neutral-500 max-w-xl leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Dari warung makan sampai bengkel motor — setiap usaha berhak punya
              halaman online yang profesional. Gratis.
            </p>

            <div className="animate-fade-up mt-10 flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/bisnis"
                className="inline-flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-4 rounded-full text-base font-medium hover:bg-neutral-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Jelajahi Bisnis
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#cara-kerja"
                className="inline-flex items-center justify-center gap-2 border border-neutral-300 text-charcoal px-8 py-4 rounded-full text-base font-medium hover:border-neutral-400 hover:bg-white transition-all"
              >
                Cara Kerja
              </Link>
            </div>
          </div>

          {/* Floating cards preview */}
          <div className="hidden lg:block absolute top-8 right-0 w-[340px]">
            <div className="animate-float relative">
              <div className="bg-white rounded-2xl shadow-xl shadow-neutral-200/60 border border-neutral-100 p-6 rotate-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center text-xl">🍜</div>
                  <div>
                    <div className="font-semibold text-charcoal">Sambalado Nusantara</div>
                    <div className="text-sm text-neutral-400">Ciputat, Tangerang Selatan</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber text-sm mb-3">★★★★★ <span className="text-neutral-400 ml-1">5.0</span></div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">WhatsApp</span>
                  <span className="px-3 py-1 rounded-full bg-amber/10 text-amber text-xs font-medium">Kuliner</span>
                </div>
              </div>
            </div>
            <div className="animate-float mt-4 ml-8" style={{ animationDelay: '1s' }}>
              <div className="bg-white rounded-2xl shadow-lg shadow-neutral-200/40 border border-neutral-100 p-5 -rotate-1">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-lg">🔧</div>
                  <div>
                    <div className="font-semibold text-charcoal text-sm">Bengkel Jaya Motor</div>
                    <div className="text-xs text-neutral-400">Pamulang, Tangerang Selatan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kuliner Rumahan Banner */}
      <section className="py-16 px-6 bg-gradient-to-r from-amber/5 via-orange-50 to-amber/5">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-amber/20 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber bg-amber/10 px-4 py-1.5 rounded-full mb-4">
                <span className="text-lg">🍳</span> Baru! Kuliner Rumahan
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-charcoal leading-tight">
                Jualan makanan dari rumah?<br />
                <span className="text-amber">Terima pesanan via WhatsApp.</span>
              </h2>
              <p className="mt-3 text-neutral-500 text-sm leading-relaxed">
                Katalog makanan online + keranjang belanja + pesan otomatis ke WhatsApp.
                Gratis untuk semua usaha kuliner rumahan.
              </p>
              <p className="mt-2 text-xs text-amber font-medium">
                🔗 Dapatkan link kustom: <span className="font-mono">etalaso.id/kuliner/nama-toko</span>
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/kuliner/daftar"
                  className="inline-flex items-center justify-center gap-2 bg-amber text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-amber-light transition-all"
                >
                  Daftar Gratis
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/kuliner"
                  className="inline-flex items-center justify-center gap-2 border border-neutral-300 text-charcoal px-6 py-3 rounded-full text-sm font-medium hover:border-neutral-400 transition-all"
                >
                  Lihat Katalog
                </Link>
              </div>
            </div>
            <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0 w-48">
              {['🍛', '🍿', '🥤', '🍰'].map((icon, i) => (
                <div key={i} className="bg-amber/5 rounded-xl p-4 text-center">
                  <div className="text-2xl">{icon}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-charcoal">
              Jelajahi Kategori
            </h2>
            <p className="mt-3 text-neutral-500">Ribuan bisnis lokal sudah terdaftar di Etalaso</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dynamicCategories.map((cat) => (
              <div
                key={cat.name}
                className="group bg-white rounded-2xl border border-neutral-100 p-5 text-center hover:border-amber/40 hover:shadow-lg hover:shadow-amber/5 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="font-medium text-charcoal text-sm">{cat.name}</div>
                <div className="text-xs text-neutral-400 mt-1">{cat.count} bisnis</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/bisnis" className="inline-flex items-center gap-2 text-amber font-medium hover:underline">
              Lihat Semua Bisnis
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-amber">Kenapa Etalaso?</span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-charcoal mt-4 leading-tight">
                Halaman bisnis yang <span className="text-terracotta">profesional</span>, tanpa ribet.
              </h2>
              <p className="mt-6 text-neutral-500 leading-relaxed">
                Setiap bisnis mendapat halaman profil yang siap pakai.
                Pemilik bisa klaim dan kustomisasi dengan ratusan template eksklusif.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                    ),
                    title: 'Chat WhatsApp Langsung',
                    desc: 'Pengunjung bisa langsung hubungi bisnis via WhatsApp — tanpa install aplikasi lain.',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                      </svg>
                    ),
                    title: 'Ratusan Template Eksklusif',
                    desc: 'Pilih dari ratusan template yang dirancang khusus — sesuai karakter bisnis Anda.',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    ),
                    title: 'Informasi Lengkap',
                    desc: 'Alamat, lokasi, review, dan kategori — semuanya tersedia di halaman profil bisnis.',
                  },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber/10 text-amber flex items-center justify-center">
                      {f.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-charcoal">{f.title}</div>
                      <div className="text-sm text-neutral-500 mt-1">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template showcase */}
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <div key={t.name} className={`${t.style} rounded-xl p-4 hover:scale-[1.03] transition-transform cursor-pointer`}>
                  <div className={`${t.accent} w-full h-2 rounded-full mb-3`} />
                  <div className="h-2 w-3/4 bg-neutral-200 rounded mb-2" />
                  <div className="h-2 w-1/2 bg-neutral-200 rounded mb-4" />
                  <div className="flex gap-1.5">
                    <div className="h-6 w-6 rounded bg-neutral-100" />
                    <div className="h-6 w-6 rounded bg-neutral-100" />
                    <div className="h-6 w-6 rounded bg-neutral-100" />
                  </div>
                  <div className="mt-3 text-xs font-medium text-neutral-500">{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Untuk Siapa */}
      <section className="py-24 px-6 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-terracotta">Untuk Siapa Etalaso?</span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-charcoal mt-4">
              Bisnis kecil pun bisa tampil <span className="text-amber">profesional</span>.
            </h2>
            <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
              Tidak perlu website mahal atau aplikasi rumit. Etalaso memberi setiap usaha halaman profil yang siap pakai.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🍗',
                title: 'Warung Pecel Lele',
                benefit: 'Pelanggan baru bisa pesan via WhatsApp sebelum datang.',
                detail: 'Menu dan harga tampil online — tidak perlu spanduk besar.',
              },
              {
                icon: '🔧',
                title: 'Bengkel Motor',
                benefit: 'Tidak perlu pasang spanduk mahal, cukup share link Etalaso.',
                detail: 'Pelanggan langsung tahu lokasi, jam buka, dan layanan tersedia.',
              },
              {
                icon: '💇',
                title: 'Salon Rumahan',
                benefit: 'Jadwal booking via WhatsApp, tanpa aplikasi tambahan.',
                detail: 'Review pelanggan lain jadi bukti kualitas layanan Anda.',
              },
              {
                icon: '🛒',
                title: 'Toko Kelontong',
                benefit: 'Pelanggan sekitar bisa cek stok dan harga dari rumah.',
                detail: 'Jangkauan lebih luas dari mulut ke mulut.',
              },
              {
                icon: '🧵',
                title: 'Penjahit & Laundry',
                benefit: 'Terima orderan lewat WhatsApp tanpa pelanggan harus datang.',
                detail: 'Tampilkan daftar harga dan estimasi waktu di profil.',
              },
              {
                icon: '🍰',
                title: 'Usaha Kue & Catering',
                benefit: 'Katalog menu online — pelanggan tinggal pilih dan pesan.',
                detail: 'Foto produk dan testimoni langsung tampil di halaman.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-2xl border border-neutral-100 p-6 hover:border-amber/40 hover:shadow-lg hover:shadow-amber/5 transition-all"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                <h3 className="font-semibold text-charcoal text-lg">{item.title}</h3>
                <p className="mt-2 text-amber font-medium text-sm">{item.benefit}</p>
                <p className="mt-1 text-neutral-500 text-sm">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="py-24 px-6 bg-charcoal text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-light">Cara Kerja</span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl mt-4">
              Tiga langkah, langsung terhubung.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.num} className="relative group">
                <div className="text-7xl font-[family-name:var(--font-display)] text-white/10 absolute -top-6 -left-2 select-none group-hover:text-amber/20 transition-colors z-10 pointer-events-none">
                  {s.num}
                </div>
                <div className="relative bg-white/5 rounded-2xl border border-white/10 p-8 pt-10 hover:border-amber/30 transition-colors">
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-charcoal">{s.value}</div>
                <div className="text-sm text-neutral-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber">Cerita Mereka</span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-charcoal mt-4">
              Pemilik usaha yang sudah merasakan manfaatnya.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: 'Sejak ada halaman di Etalaso, pesanan via WhatsApp naik. Padahal saya cuma jualan pecel lele.',
                name: 'Pak Joko',
                biz: 'Pecel Lele Mas Joko, Ciputat',
                icon: '🍗',
              },
              {
                quote: 'Dulu pelanggan cuma dari sekitar sini. Sekarang ada yang datang dari kecamatan sebelah gara-gara lihat profil Etalaso.',
                name: 'Bu Ratna',
                biz: 'Salon Ratna, Pamulang',
                icon: '💇',
              },
              {
                quote: 'Saya nggak ngerti bikin website. Tapi sekarang bengkel saya punya halaman online sendiri. Tinggal share link-nya.',
                name: 'Mas Dedi',
                biz: 'Bengkel Dedi Motor, Serpong',
                icon: '🔧',
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-lg hover:shadow-amber/5 transition-all"
              >
                <div className="text-3xl mb-4">{t.icon}</div>
                <p className="text-neutral-600 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <div className="font-semibold text-charcoal text-sm">{t.name}</div>
                  <div className="text-xs text-neutral-400">{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="daftar" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-terracotta/5" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl text-charcoal leading-tight">
            Punya warung, bengkel, atau toko?
          </h2>
          <p className="mt-6 text-neutral-500 text-lg leading-relaxed">
            Dapatkan halaman bisnis online otomatis, template dasar profesional,
            dan tombol WhatsApp untuk pelanggan — semuanya gratis.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/daftar"
              className="inline-flex items-center justify-center gap-2 bg-amber text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-amber-light transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber/20"
            >
              Klaim Bisnis Anda — Gratis
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/bisnis"
              className="inline-flex items-center justify-center gap-2 border border-neutral-300 text-charcoal px-8 py-4 rounded-full text-base font-medium hover:border-neutral-400 hover:bg-white transition-all"
            >
              Jelajahi Bisnis
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Web CTA */}
      <section className="py-20 px-6 bg-charcoal text-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-light">Layanan Custom</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl mt-4 leading-tight">
            Butuh landing page atau website <span className="text-amber">custom</span> untuk bisnis Anda?
          </h2>
          <p className="mt-6 text-neutral-400 text-lg leading-relaxed">
            Kami juga melayani pembuatan landing page dan website custom yang disesuaikan
            dengan kebutuhan bisnis Anda — desain profesional, cepat, dan siap pakai.
          </p>
          <div className="mt-10">
            <a
              href="https://wa.me/6281578777654?text=Halo%2C%20saya%20tertarik%20untuk%20dibuatkan%20landing%20page%20%2F%20website%20custom%20untuk%20bisnis%20saya."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-green-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hubungi Kami via WhatsApp
            </a>
          </div>
          <p className="mt-4 text-neutral-500 text-sm">
            Konsultasi gratis — langsung chat ke tim kami.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-4">
                Etalaso<span className="text-amber">.</span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Platform direktori bisnis lokal Indonesia. Hubungkan pelanggan dengan UMKM via WhatsApp.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal text-sm mb-3">Jelajahi</h4>
              <div className="flex flex-col gap-2 text-sm text-neutral-400">
                <Link href="/bisnis" className="hover:text-charcoal transition-colors">Daftar Bisnis</Link>
                <Link href="/kuliner" className="hover:text-charcoal transition-colors">Kuliner Rumahan</Link>
                <Link href="/daftar" className="hover:text-charcoal transition-colors">Daftarkan Bisnis</Link>
                <Link href="/demo" className="hover:text-charcoal transition-colors">Lihat Template</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal text-sm mb-3">Perusahaan</h4>
              <div className="flex flex-col gap-2 text-sm text-neutral-400">
                <Link href="/tentang" className="hover:text-charcoal transition-colors">Tentang Kami</Link>
                <Link href="/kontak" className="hover:text-charcoal transition-colors">Hubungi Kami</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal text-sm mb-3">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-neutral-400">
                <Link href="/kebijakan-privasi" className="hover:text-charcoal transition-colors">Kebijakan Privasi</Link>
                <Link href="/syarat-ketentuan" className="hover:text-charcoal transition-colors">Syarat & Ketentuan</Link>
                <Link href="/disclaimer" className="hover:text-charcoal transition-colors">Disclaimer</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-neutral-400">&copy; {new Date().getFullYear()} Etalaso. Hak cipta dilindungi.</span>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <Link href="/kebijakan-privasi" className="hover:text-charcoal transition-colors">Privasi</Link>
              <Link href="/syarat-ketentuan" className="hover:text-charcoal transition-colors">Syarat</Link>
              <Link href="/disclaimer" className="hover:text-charcoal transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
