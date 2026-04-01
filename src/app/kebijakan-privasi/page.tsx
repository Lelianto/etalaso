import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan Privasi Etalaso — Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda di platform Etalaso.',
  alternates: {
    canonical: '/kebijakan-privasi',
  },
}

export default function KebijakanPrivasi() {
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
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-charcoal mb-2">Kebijakan Privasi</h1>
        <p className="text-sm text-neutral-400 mb-10">Terakhir diperbarui: 1 April 2026</p>

        <div className="prose-custom space-y-8 text-neutral-600 leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">1. Pendahuluan</h2>
            <p>
              Etalaso (&quot;kami&quot;, &quot;platform&quot;) berkomitmen melindungi privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan platform Etalaso yang dapat diakses melalui situs web etalaso.id.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">2. Informasi yang Kami Kumpulkan</h2>
            <p className="mb-3">Kami mengumpulkan beberapa jenis informasi:</p>
            <h3 className="font-semibold text-charcoal mt-4 mb-2">a. Informasi yang Anda Berikan</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nama bisnis, alamat, nomor telepon, dan kategori saat mendaftarkan bisnis</li>
              <li>Informasi akun seperti alamat email saat login</li>
              <li>Informasi produk dan menu yang Anda unggah</li>
              <li>Konten lain yang Anda kirimkan melalui formulir di platform</li>
            </ul>

            <h3 className="font-semibold text-charcoal mt-4 mb-2">b. Informasi yang Dikumpulkan Otomatis</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Data kunjungan halaman (page view) untuk analitik</li>
              <li>Interaksi dengan tombol WhatsApp (klik)</li>
              <li>Informasi perangkat dan browser</li>
              <li>Alamat IP dan data lokasi umum</li>
            </ul>

            <h3 className="font-semibold text-charcoal mt-4 mb-2">c. Informasi dari Pihak Ketiga</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Data bisnis yang tersedia secara publik dari Google Maps</li>
              <li>Informasi autentikasi dari penyedia login (Google)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">3. Penggunaan Informasi</h2>
            <p className="mb-3">Kami menggunakan informasi yang dikumpulkan untuk:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Menampilkan profil bisnis di platform Etalaso</li>
              <li>Memfasilitasi komunikasi antara pengunjung dan pemilik bisnis via WhatsApp</li>
              <li>Menyediakan fitur analitik kepada pemilik bisnis (statistik pengunjung)</li>
              <li>Memproses pendaftaran, klaim bisnis, dan langganan</li>
              <li>Meningkatkan kualitas layanan dan pengalaman pengguna</li>
              <li>Mengirimkan informasi terkait layanan yang relevan</li>
              <li>Mencegah penyalahgunaan platform</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">4. Penyimpanan dan Keamanan Data</h2>
            <p>
              Data Anda disimpan di server yang aman melalui layanan Supabase dengan enkripsi standar industri. Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi informasi pribadi Anda dari akses yang tidak sah, perubahan, pengungkapan, atau penghancuran.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">5. Berbagi Informasi</h2>
            <p className="mb-3">Kami <strong>tidak menjual</strong> data pribadi Anda. Informasi dapat dibagikan dalam kondisi berikut:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Informasi bisnis yang Anda daftarkan ditampilkan secara publik di platform</li>
              <li>Penyedia layanan pihak ketiga yang membantu operasional platform (hosting, analitik)</li>
              <li>Jika diwajibkan oleh hukum atau proses hukum yang berlaku di Indonesia</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">6. Cookie dan Teknologi Pelacakan</h2>
            <p>
              Kami menggunakan cookie dan teknologi serupa untuk menjaga sesi login, mengingat preferensi Anda, dan mengumpulkan data analitik. Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda, namun beberapa fitur platform mungkin tidak berfungsi dengan baik tanpa cookie.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">7. Hak Pengguna</h2>
            <p className="mb-3">Anda memiliki hak untuk:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mengakses data pribadi yang kami simpan tentang Anda</li>
              <li>Meminta koreksi data yang tidak akurat</li>
              <li>Meminta penghapusan data pribadi Anda</li>
              <li>Menarik persetujuan atas penggunaan data</li>
            </ul>
            <p className="mt-3">
              Untuk menggunakan hak-hak tersebut, silakan hubungi kami melalui halaman <Link href="/kontak" className="text-amber hover:underline">Kontak</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">8. Layanan Pihak Ketiga</h2>
            <p>
              Platform kami terintegrasi dengan layanan pihak ketiga termasuk Google Maps, WhatsApp, dan penyedia autentikasi. Penggunaan layanan tersebut tunduk pada kebijakan privasi masing-masing penyedia layanan.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">9. Perlindungan Data Anak</h2>
            <p>
              Etalaso tidak ditujukan untuk anak di bawah usia 17 tahun. Kami tidak secara sengaja mengumpulkan informasi dari anak-anak. Jika Anda mengetahui bahwa anak di bawah umur telah memberikan data kepada kami, silakan hubungi kami untuk penghapusan.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">10. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diumumkan melalui halaman ini dengan tanggal pembaruan terbaru. Penggunaan berkelanjutan atas platform setelah perubahan dianggap sebagai persetujuan Anda terhadap kebijakan yang diperbarui.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal mb-3">11. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami melalui halaman <Link href="/kontak" className="text-amber hover:underline">Kontak</Link> atau melalui WhatsApp di nomor yang tersedia di situs kami.
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
            <Link href="/syarat-ketentuan" className="hover:text-charcoal transition-colors">Syarat & Ketentuan</Link>
            <span>&copy; {new Date().getFullYear()} Etalaso</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
