import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Klaim Bisnis Anda | Etalaso',
  description: 'Klaim dan kelola halaman bisnis Anda di Etalaso secara gratis.',
}

const STEPS = [
  { num: '1', title: 'Cari Bisnis Anda', desc: 'Temukan bisnis Anda di halaman direktori Etalaso berdasarkan kota dan kategori.' },
  { num: '2', title: 'Klik "Klaim Bisnis Ini"', desc: 'Pada halaman bisnis, klik tombol klaim di bagian bawah. Login dengan akun Google jika belum.' },
  { num: '3', title: 'Isi Bukti Kepemilikan', desc: 'Lengkapi formulir verifikasi — nama, nomor WhatsApp, dan bukti kepemilikan bisnis.' },
  { num: '4', title: 'Tunggu Verifikasi', desc: 'Tim kami akan meninjau klaim Anda dalam 1x24 jam. Anda akan dihubungi via email.' },
]

const BENEFITS = [
  { icon: '✏️', title: 'Edit Profil Bisnis', desc: 'Ubah deskripsi, alamat, jam buka, dan informasi lainnya.' },
  { icon: '📸', title: 'Upload Foto Produk', desc: 'Tampilkan produk dan layanan Anda dengan foto menarik.' },
  { icon: '🎨', title: 'Pilih Template', desc: 'Ganti tampilan halaman bisnis dari ratusan template premium.' },
  { icon: '📱', title: 'Tombol WhatsApp', desc: 'Pelanggan bisa langsung chat ke WhatsApp bisnis Anda.' },
]

export default function ClaimLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-600 to-indigo-700 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Klaim Bisnis Anda di Etalaso</h1>
          <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
            Bisnis Anda sudah terdaftar di Etalaso. Klaim sekarang untuk mengelola profil, upload produk, dan dapatkan pelanggan baru via WhatsApp.
          </p>
          <Link
            href="/bisnis"
            className="inline-block bg-white text-indigo-700 font-bold px-8 py-4 rounded-full hover:bg-indigo-50 transition-colors"
          >
            Cari Bisnis Saya
          </Link>
        </div>
      </section>

      {/* Cara Klaim */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">Cara Klaim Bisnis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map(step => (
              <div key={step.num} className="bg-white rounded-2xl p-6 border border-slate-200 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keuntungan */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">Keuntungan Klaim Bisnis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex gap-4 p-4">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{b.title}</h3>
                  <p className="text-sm text-slate-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <p className="text-slate-500 mb-4">Gratis untuk semua pemilik bisnis</p>
        <Link
          href="/bisnis"
          className="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-full hover:bg-indigo-700 transition-colors"
        >
          Cari & Klaim Bisnis Saya
        </Link>
      </section>
    </div>
  )
}
