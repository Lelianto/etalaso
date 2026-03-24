import Link from 'next/link'
import supabase from '@/lib/db/supabase'

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
  const [
    { count: businessCount },
    { data: regions },
    { data: categories },
  ] = await Promise.all([
    supabase.from('Business').select('*', { count: 'exact', head: true }),
    supabase.from('Business').select('region').not('region', 'is', null),
    supabase.from('Business').select('category').not('category', 'is', null),
  ])

  const uniqueRegions = new Set((regions || []).map((r: { region: string }) => r.region))
  const uniqueCategories = new Set((categories || []).map((c: { category: string }) => c.category))

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
  ;(categories || []).forEach((c: { category: string }) => {
    catCounts[c.category] = (catCounts[c.category] || 0) + 1
  })

  const dynamicCategories = Object.entries(CATEGORY_META)
    .map(([key, meta]) => ({
      name: meta.label,
      icon: meta.icon,
      count: catCounts[key] ? `${catCounts[key].toLocaleString('id-ID')}+` : '0',
    }))
    .filter(c => c.count !== '0')
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/demo" className="text-sm text-neutral-500 hover:text-charcoal transition-colors">
              Demo
            </Link>
            <Link
              href="#daftar"
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
              Etalaso menyajikan profil bisnis lokal dalam halaman yang cantik
              — lengkap dengan produk, review, dan tombol WhatsApp.
            </p>

            <div className="animate-fade-up mt-10 flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-4 rounded-full text-base font-medium hover:bg-neutral-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Lihat Demo
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

      {/* CTA */}
      <section id="daftar" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-terracotta/5" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl text-charcoal leading-tight">
            Punya bisnis lokal?
          </h2>
          <p className="mt-6 text-neutral-500 text-lg leading-relaxed">
            Klaim halaman bisnis Anda di Etalaso dan mulai terima pelanggan baru
            langsung via WhatsApp. Gratis untuk memulai.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 bg-amber text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-amber-light transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber/20"
            >
              Lihat Demo Template
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-[family-name:var(--font-display)] text-xl text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <Link href="/bisnis" className="hover:text-charcoal transition-colors">Daftar Bisnis</Link>
            <Link href="/demo" className="hover:text-charcoal transition-colors">Demo</Link>
            <span>&copy; {new Date().getFullYear()} Etalaso</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
