import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Hubungi tim Etalaso untuk pertanyaan, saran, atau kerja sama. Kami siap membantu Anda melalui WhatsApp dan email.',
  alternates: {
    canonical: '/kontak',
  },
  openGraph: {
    title: 'Hubungi Kami — Etalaso',
    description: 'Punya pertanyaan atau saran? Hubungi tim Etalaso melalui WhatsApp atau email.',
    url: '/kontak',
  },
}

export default function Kontak() {
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
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-charcoal mb-4">Hubungi Kami</h1>
        <p className="text-lg text-neutral-500 mb-12">
          Punya pertanyaan, saran, atau ingin bekerja sama? Kami senang mendengar dari Anda.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <a
            href="https://wa.me/6281578777654?text=Halo%20Etalaso%2C%20saya%20ingin%20bertanya%20tentang..."
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-neutral-100 p-6 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h2 className="font-semibold text-charcoal text-lg mb-1">WhatsApp</h2>
            <p className="text-sm text-neutral-500 mb-3">Respon tercepat — langsung chat dengan tim kami.</p>
            <span className="text-sm text-green-600 font-medium">+62 815-7877-7654</span>
          </a>

          <a
            href="mailto:hello@etalaso.biz.id"
            className="group bg-white rounded-2xl border border-neutral-100 p-6 hover:border-amber/40 hover:shadow-lg hover:shadow-amber/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber/10 text-amber flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="font-semibold text-charcoal text-lg mb-1">Email</h2>
            <p className="text-sm text-neutral-500 mb-3">Untuk pertanyaan formal atau kerja sama bisnis.</p>
            <span className="text-sm text-amber font-medium">hello@etalaso.biz.id</span>
          </a>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">Pertanyaan Umum</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Bagaimana cara mendaftarkan bisnis saya?',
                  a: 'Kunjungi halaman Daftarkan Bisnis dan isi formulir dengan informasi bisnis Anda. Prosesnya gratis dan hanya membutuhkan beberapa menit.',
                  link: '/daftar',
                  linkText: 'Daftar Sekarang',
                },
                {
                  q: 'Apakah Etalaso benar-benar gratis?',
                  a: 'Ya! Profil bisnis dasar sepenuhnya gratis. Kami juga menawarkan paket berbayar dengan fitur tambahan seperti template premium, analitik lanjutan, dan custom URL.',
                },
                {
                  q: 'Bagaimana cara mengklaim bisnis yang sudah terdaftar?',
                  a: 'Jika bisnis Anda sudah ada di Etalaso, Anda bisa mengklaim kepemilikannya melalui proses verifikasi. Kunjungi halaman bisnis Anda dan klik tombol "Klaim Bisnis Ini".',
                },
                {
                  q: 'Apakah informasi bisnis saya aman?',
                  a: 'Ya. Kami hanya menampilkan informasi yang Anda setujui untuk ditampilkan secara publik. Data pribadi Anda dilindungi sesuai Kebijakan Privasi kami.',
                  link: '/kebijakan-privasi',
                  linkText: 'Baca Kebijakan Privasi',
                },
                {
                  q: 'Saya menemukan informasi yang salah tentang bisnis saya. Bagaimana mengubahnya?',
                  a: 'Klaim bisnis Anda terlebih dahulu, lalu Anda bisa mengedit semua informasi melalui dashboard. Jika mengalami kesulitan, hubungi kami via WhatsApp.',
                },
              ].map((item) => (
                <div key={item.q} className="bg-white rounded-xl border border-neutral-100 p-5">
                  <h3 className="font-semibold text-charcoal mb-2">{item.q}</h3>
                  <p className="text-sm text-neutral-500">{item.a}</p>
                  {item.link && (
                    <Link href={item.link} className="inline-block mt-2 text-sm text-amber font-medium hover:underline">
                      {item.linkText}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-4">Laporkan Masalah</h2>
            <p className="text-neutral-500 mb-4">
              Menemukan konten yang tidak pantas, informasi salah, atau masalah teknis? Beri tahu kami agar bisa segera ditindaklanjuti.
            </p>
            <a
              href="https://wa.me/6281578777654?text=Halo%20Etalaso%2C%20saya%20ingin%20melaporkan%20masalah..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-neutral-300 text-charcoal px-5 py-2.5 rounded-full text-sm font-medium hover:border-neutral-400 transition-all"
            >
              Laporkan via WhatsApp
            </a>
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
            <Link href="/kebijakan-privasi" className="hover:text-charcoal transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat-ketentuan" className="hover:text-charcoal transition-colors">Syarat & Ketentuan</Link>
            <span>&copy; {new Date().getFullYear()} Etalaso</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
