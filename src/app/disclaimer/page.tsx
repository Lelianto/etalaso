import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer Etalaso — Batasan tanggung jawab dan penyangkalan terkait informasi yang ditampilkan di platform Etalaso.',
  alternates: {
    canonical: '/disclaimer',
  },
}

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
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
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-charcoal mb-2">Disclaimer</h1>
        <p className="text-sm text-neutral-400 mb-10">Terakhir diperbarui: 1 April 2026</p>

        <div className="prose-custom space-y-8 text-neutral-600 leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">1. Informasi Umum</h2>
            <p>
              Informasi yang ditampilkan di platform Etalaso (etalaso.id) disediakan untuk tujuan informasi umum. Meskipun kami berusaha menjaga keakuratan informasi, kami tidak memberikan jaminan, baik tersurat maupun tersirat, mengenai kelengkapan, keakuratan, keandalan, kesesuaian, atau ketersediaan informasi, produk, layanan, atau grafik terkait yang terdapat di platform.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">2. Sumber Data Bisnis</h2>
            <p>
              Sebagian data bisnis yang ditampilkan di Etalaso berasal dari sumber publik yang tersedia, termasuk Google Maps dan sumber daring lainnya. Data ini mungkin tidak selalu terkini atau akurat. Pemilik bisnis dapat mengklaim dan memperbarui informasi bisnis mereka melalui proses verifikasi.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">3. Tidak Ada Hubungan Bisnis</h2>
            <p>
              Etalaso bertindak sebagai platform direktori dan penghubung. Kami <strong>tidak</strong> memiliki, mengoperasikan, atau memiliki afiliasi langsung dengan bisnis-bisnis yang terdaftar di platform. Tampilnya suatu bisnis di Etalaso bukan merupakan rekomendasi, endorsement, atau jaminan kualitas dari kami.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">4. Transaksi Antar Pengguna</h2>
            <p>
              Segala transaksi, komunikasi, atau interaksi yang terjadi antara pengunjung dan pemilik bisnis — termasuk melalui WhatsApp — sepenuhnya menjadi tanggung jawab pihak-pihak yang terlibat. Etalaso tidak bertanggung jawab atas sengketa, kerugian, atau masalah yang timbul dari transaksi tersebut.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">5. Review dan Ulasan</h2>
            <p>
              Review dan ulasan yang ditampilkan di platform berasal dari pengguna atau sumber pihak ketiga. Etalaso tidak memverifikasi kebenaran setiap review dan tidak bertanggung jawab atas isi ulasan tersebut. Kami menyediakan fitur pelaporan untuk konten yang tidak pantas.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">6. Tautan Eksternal</h2>
            <p>
              Platform kami mungkin mengandung tautan ke situs web pihak ketiga (termasuk WhatsApp, Google Maps, dan layanan lainnya). Kami tidak memiliki kendali atas konten atau kebijakan privasi situs-situs tersebut dan tidak bertanggung jawab atas isinya.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">7. Ketersediaan Layanan</h2>
            <p>
              Kami berusaha menjaga ketersediaan platform 24/7, namun kami tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan. Pemeliharaan teknis, pembaruan, atau faktor di luar kendali kami dapat menyebabkan gangguan sementara.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">8. Batasan Tanggung Jawab</h2>
            <p>
              Sejauh diizinkan oleh hukum yang berlaku, Etalaso, termasuk pemilik, karyawan, dan afiliasinya, tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, konsekuensial, atau kerugian apapun yang timbul dari penggunaan atau ketidakmampuan menggunakan platform ini.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">9. Perubahan Disclaimer</h2>
            <p>
              Kami berhak mengubah disclaimer ini kapan saja tanpa pemberitahuan sebelumnya. Perubahan berlaku sejak dipublikasikan di halaman ini. Anda disarankan untuk memeriksa halaman ini secara berkala.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">10. Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai disclaimer ini, silakan hubungi kami melalui halaman <Link href="/kontak" className="text-amber hover:underline">Kontak</Link>.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-[family-name:var(--font-display)] text-xl text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <Link href="/tentang" className="hover:text-charcoal transition-colors">Tentang</Link>
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
