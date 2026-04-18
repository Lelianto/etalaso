import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan Ketentuan penggunaan platform Etalaso — direktori bisnis lokal Indonesia.',
  alternates: {
    canonical: '/syarat-ketentuan',
  },
}

export default function SyaratKetentuan() {
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
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-charcoal mb-2">Syarat &amp; Ketentuan</h1>
        <p className="text-sm text-neutral-400 mb-10">Terakhir diperbarui: 1 April 2026</p>

        <div className="prose-custom space-y-8 text-neutral-600 leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">1. Penerimaan Syarat</h2>
            <p>
              Dengan mengakses dan menggunakan platform Etalaso (etalaso.biz.id), Anda menyetujui dan terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui syarat-syarat ini, mohon untuk tidak menggunakan platform kami.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">2. Definisi</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>&quot;Platform&quot;</strong> merujuk pada situs web etalaso.biz.id dan seluruh layanan yang disediakan oleh Etalaso.</li>
              <li><strong>&quot;Pengguna&quot;</strong> merujuk pada setiap orang yang mengakses atau menggunakan platform.</li>
              <li><strong>&quot;Pemilik Bisnis&quot;</strong> merujuk pada pengguna yang mendaftarkan atau mengklaim bisnis di platform.</li>
              <li><strong>&quot;Pengunjung&quot;</strong> merujuk pada pengguna yang menjelajahi dan melihat profil bisnis.</li>
              <li><strong>&quot;Konten&quot;</strong> merujuk pada teks, gambar, data, dan informasi lain yang ditampilkan di platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">3. Layanan Platform</h2>
            <p className="mb-3">Etalaso menyediakan layanan berikut:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Direktori bisnis lokal Indonesia dengan profil yang dapat diakses publik</li>
              <li>Halaman profil bisnis dengan informasi kontak, lokasi, produk, dan review</li>
              <li>Fitur komunikasi langsung via WhatsApp antara pengunjung dan pemilik bisnis</li>
              <li>Sistem pemesanan online untuk kategori kuliner rumahan</li>
              <li>Template desain halaman bisnis yang dapat dikustomisasi</li>
              <li>Analitik pengunjung untuk pemilik bisnis</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">4. Pendaftaran dan Akun</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Anda harus memberikan informasi yang akurat dan lengkap saat mendaftar.</li>
              <li>Anda bertanggung jawab menjaga kerahasiaan akun Anda.</li>
              <li>Anda harus berusia minimal 17 tahun untuk membuat akun.</li>
              <li>Satu akun hanya boleh digunakan oleh satu orang atau entitas bisnis.</li>
              <li>Kami berhak menonaktifkan akun yang melanggar ketentuan ini.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">5. Konten dan Hak Kekayaan Intelektual</h2>
            <p className="mb-3">
              Seluruh konten platform termasuk desain, teks, grafik, logo, dan template adalah milik Etalaso atau pemberi lisensinya dan dilindungi oleh hukum hak cipta Indonesia.
            </p>
            <p className="mb-3">Dengan mengunggah konten ke platform, Anda:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Menjamin bahwa Anda memiliki hak atas konten tersebut</li>
              <li>Memberikan Etalaso lisensi non-eksklusif untuk menampilkan konten di platform</li>
              <li>Bertanggung jawab penuh atas konten yang Anda unggah</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">6. Klaim Bisnis</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Profil bisnis yang tampil di platform mungkin berasal dari data publik yang tersedia.</li>
              <li>Pemilik bisnis berhak mengklaim dan mengelola profil bisnis mereka.</li>
              <li>Proses klaim memerlukan verifikasi oleh tim Etalaso.</li>
              <li>Kami berhak menolak klaim yang tidak dapat diverifikasi.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">7. Larangan Penggunaan</h2>
            <p className="mb-3">Pengguna dilarang:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mendaftarkan informasi bisnis yang palsu atau menyesatkan</li>
              <li>Mengklaim bisnis yang bukan milik Anda</li>
              <li>Menggunakan platform untuk aktivitas ilegal atau penipuan</li>
              <li>Menyebarkan konten yang melanggar hukum, SARA, pornografi, atau kekerasan</li>
              <li>Melakukan scraping atau pengambilan data otomatis tanpa izin</li>
              <li>Mengganggu operasional atau keamanan platform</li>
              <li>Membuat akun palsu atau ganda</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">8. Langganan dan Pembayaran</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Beberapa fitur tersedia melalui paket berbayar (langganan).</li>
              <li>Harga dan fitur paket dapat berubah dengan pemberitahuan sebelumnya.</li>
              <li>Pembayaran dilakukan melalui metode yang tersedia di platform (termasuk QRIS).</li>
              <li>Langganan yang tidak diperpanjang akan otomatis dikembalikan ke paket gratis.</li>
              <li>Pengembalian dana (refund) diproses berdasarkan kebijakan yang berlaku.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">9. Batasan Tanggung Jawab</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Etalaso menyediakan platform &quot;sebagaimana adanya&quot; tanpa jaminan apapun.</li>
              <li>Kami tidak bertanggung jawab atas transaksi antara pengunjung dan pemilik bisnis.</li>
              <li>Kami tidak menjamin keakuratan seluruh informasi bisnis yang ditampilkan.</li>
              <li>Kami tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan platform.</li>
              <li>Komunikasi via WhatsApp sepenuhnya menjadi tanggung jawab pihak yang terlibat.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">10. Penghentian Layanan</h2>
            <p>
              Kami berhak menghentikan atau menangguhkan akses Anda ke platform tanpa pemberitahuan sebelumnya jika terjadi pelanggaran terhadap Syarat dan Ketentuan ini. Anda juga dapat menghentikan penggunaan platform kapan saja dengan menonaktifkan akun Anda.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">11. Hukum yang Berlaku</h2>
            <p>
              Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan melalui musyawarah terlebih dahulu, dan jika tidak tercapai, akan diselesaikan melalui pengadilan yang berwenang di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">12. Perubahan Syarat</h2>
            <p>
              Kami berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan berlaku sejak dipublikasikan di halaman ini. Penggunaan berkelanjutan atas platform setelah perubahan dianggap sebagai persetujuan Anda.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">13. Kontak</h2>
            <p>
              Untuk pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui halaman <Link href="/kontak" className="text-amber hover:underline">Kontak</Link>.
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
            <span>&copy; {new Date().getFullYear()} Etalaso</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
