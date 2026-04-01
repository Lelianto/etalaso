import type { Metadata } from 'next'
import Link from 'next/link'
import { BASE_URL } from '@/lib/seo/utils'

export const metadata: Metadata = {
  title: 'Tentang Etalaso',
  description: 'Etalaso adalah platform direktori bisnis lokal Indonesia yang menghubungkan pelanggan dengan UMKM melalui WhatsApp. Gratis untuk semua usaha kecil.',
  alternates: {
    canonical: '/tentang',
  },
  openGraph: {
    title: 'Tentang Etalaso — Platform Bisnis Lokal Indonesia',
    description: 'Menghubungkan pelanggan dengan bisnis lokal melalui WhatsApp. Setiap usaha berhak punya halaman online yang profesional.',
    url: '/tentang',
  },
}

export default function Tentang() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Etalaso',
    url: BASE_URL,
    description: 'Platform direktori bisnis lokal Indonesia — menghubungkan pelanggan dengan UMKM via WhatsApp.',
    foundingDate: '2024',
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia',
    },
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </Link>
          <Link href="/" className="text-sm text-neutral-500 hover:text-charcoal transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-charcoal mb-6">Tentang Etalaso</h1>

        <div className="space-y-8 text-neutral-600 leading-relaxed">
          <section>
            <p className="text-lg">
              <strong className="text-charcoal">Etalaso</strong> adalah platform direktori bisnis lokal Indonesia yang membantu menghubungkan pelanggan dengan usaha kecil dan menengah (UMKM) melalui WhatsApp. Kami percaya bahwa setiap bisnis — dari warung makan hingga bengkel motor — berhak memiliki kehadiran online yang profesional.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">Misi Kami</h2>
            <p>
              Jutaan usaha kecil di Indonesia belum memiliki kehadiran online. Padahal, pelanggan semakin sering mencari layanan dan produk melalui internet. Etalaso hadir untuk menjembatani kesenjangan ini — memberikan setiap bisnis lokal halaman profil profesional yang mudah ditemukan dan memudahkan pelanggan untuk langsung terhubung via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">Apa yang Kami Tawarkan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Profil Bisnis Gratis',
                  desc: 'Setiap bisnis mendapat halaman profil online profesional tanpa biaya. Lengkap dengan informasi kontak, lokasi, jam buka, dan review.',
                },
                {
                  title: 'Template Eksklusif',
                  desc: 'Pilih dari berbagai template desain yang dirancang khusus untuk berbagai jenis bisnis Indonesia.',
                },
                {
                  title: 'Integrasi WhatsApp',
                  desc: 'Pengunjung bisa langsung menghubungi bisnis via WhatsApp — cara komunikasi yang paling familiar bagi masyarakat Indonesia.',
                },
                {
                  title: 'Sistem Pemesanan',
                  desc: 'Fitur khusus untuk kuliner rumahan — katalog menu online, keranjang belanja, dan pemesanan otomatis via WhatsApp.',
                },
                {
                  title: 'Analitik Bisnis',
                  desc: 'Pemilik bisnis dapat memantau jumlah pengunjung, klik WhatsApp, dan performa halaman mereka.',
                },
                {
                  title: 'SEO Otomatis',
                  desc: 'Halaman bisnis dioptimasi untuk mesin pencari sehingga lebih mudah ditemukan oleh calon pelanggan.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-neutral-100 p-5">
                  <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">Untuk Siapa Etalaso?</h2>
            <div className="space-y-3">
              <p>
                <strong className="text-charcoal">Untuk pemilik bisnis:</strong> Jika Anda menjalankan warung makan, bengkel, salon, toko, atau usaha lokal lainnya, Etalaso memberikan Anda visibilitas online tanpa perlu membuat website sendiri. Cukup klaim profil Anda dan mulai terima pelanggan baru.
              </p>
              <p>
                <strong className="text-charcoal">Untuk pelanggan:</strong> Temukan bisnis lokal terbaik di sekitar Anda. Lihat informasi lengkap, review dari pelanggan lain, dan hubungi langsung via WhatsApp — tanpa perlu mengunduh aplikasi tambahan.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">Nilai-Nilai Kami</h2>
            <div className="space-y-4">
              {[
                {
                  value: 'Aksesibilitas',
                  desc: 'Kami percaya teknologi harus bisa diakses oleh semua orang, termasuk pemilik usaha kecil yang mungkin belum familiar dengan dunia digital.',
                },
                {
                  value: 'Transparansi',
                  desc: 'Informasi bisnis yang ditampilkan adalah yang akurat dan terkini. Kami tidak memanipulasi review atau peringkat.',
                },
                {
                  value: 'Keberdayaan Lokal',
                  desc: 'Kami mendukung pertumbuhan ekonomi lokal dengan memberikan alat yang dibutuhkan UMKM untuk bersaing di era digital.',
                },
              ].map((item) => (
                <div key={item.value} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber/10 text-amber flex items-center justify-center font-[family-name:var(--font-display)] text-lg">
                    {item.value[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">{item.value}</h3>
                    <p className="text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-charcoal text-white rounded-2xl p-8 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-2xl mb-3">Bergabung dengan Etalaso</h2>
            <p className="text-neutral-300 mb-6">
              Daftarkan bisnis Anda sekarang — gratis dan tanpa syarat rumit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center bg-amber text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-amber-light transition-all"
              >
                Daftarkan Bisnis
              </Link>
              <Link
                href="/bisnis"
                className="inline-flex items-center justify-center border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium hover:border-white/40 transition-all"
              >
                Jelajahi Bisnis
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-[family-name:var(--font-display)] text-xl text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <Link href="/kontak" className="hover:text-charcoal transition-colors">Kontak</Link>
            <Link href="/kebijakan-privasi" className="hover:text-charcoal transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat-ketentuan" className="hover:text-charcoal transition-colors">Syarat & Ketentuan</Link>
            <span>&copy; {new Date().getFullYear()} Etalaso</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
