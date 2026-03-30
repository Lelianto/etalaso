'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Crown, Sparkles, ArrowRight, Palette, FileText, QrCode } from 'lucide-react'
import Link from 'next/link'

const FREE_FEATURES = [
  'Halaman bisnis online otomatis',
  'Profil, alamat & jam operasional',
  'Daftar produk/layanan tampil rapi',
  'Tombol WhatsApp langsung',
  'Link Google Maps',
  'Review pelanggan',
]

const PAID_FEATURES = [
  { tier: 'UMKM', features: [
    'Edit profil bisnis sendiri',
    'Pemesanan via WhatsApp',
    'QR Code bisnis / QR Meja',
    '150+ pilihan template premium',
    'Cetak lembaran menu (PDF)',
    'Tanpa badge "Etalaso"',
  ]},
  { tier: 'Business', features: [
    'Semua fitur UMKM',
    'Sistem pre-order + bukti bayar',
    'Info pembayaran (bank & QRIS)',
    'Prioritas dukungan',
  ]},
]

const TEMPLATE_SAMPLES = [
  { name: 'Pure Clean',       layout: 'Standard',  bg: '#ffffff', surface: '#f8fafc', accent: '#3b82f6', text: '#000000' },
  { name: 'Midnight Pro',     layout: 'Standard',  bg: '#0f172a', surface: '#1e293b', accent: '#f59e0b', text: '#ffffff' },
  { name: 'Elegant Classic',  layout: 'Showcase',  bg: '#ffffff', surface: '#fafaf9', accent: '#c5a059', text: '#1c1917' },
  { name: 'Neon Cyber',       layout: 'App',       bg: '#09090b', surface: '#18181b', accent: '#d946ef', text: '#ffffff' },
  { name: 'Sunset Warm',      layout: 'Gallery',   bg: '#fff1f2', surface: '#ffffff', accent: '#f59e0b', text: '#881337' },
  { name: 'Emerald Fresh',    layout: 'Cards',     bg: '#ecfdf5', surface: '#ffffff', accent: '#fbbf24', text: '#064e3b' },
  { name: 'Glass Modern',     layout: 'Split',     bg: '#eff6ff', surface: '#ffffff', accent: '#0ea5e9', text: '#0c4a6e' },
  { name: 'Luxury Gold',      layout: 'Magazine',  bg: '#000000', surface: '#171717', accent: '#d4af37', text: '#ffffff' },
]

interface ProductShowcaseProps {
  claimUrl: string
  businessUrl?: string
}

export default function ProductShowcase({ claimUrl, businessUrl }: ProductShowcaseProps) {
  const [open, setOpen] = useState(false)

  const demoHref = businessUrl ? `/demo?from=${encodeURIComponent(businessUrl)}` : '/demo'

  return (
    <>
      {/* Floating CTA button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[7.5rem] right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-sm shadow-2xl hover:scale-105 transition-transform active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <Sparkles size={16} />
        Lihat Fitur Etalaso
      </button>

      {/* Full-screen showcase modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100">
              <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                <h1 className="font-black text-lg text-slate-900">etalaso</h1>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
              {/* Hero */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Bisnis Anda, Online dalam 2 Menit
                </h2>
                <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">
                  Klaim bisnis Anda di Etalaso dan langsung dapatkan halaman bisnis digital.
                  Pelanggan bisa lihat produk & pesan via WhatsApp.
                </p>
              </div>

              {/* ─── Section 1: Free Tier ─── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">Yang Langsung Anda Dapat (Gratis)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FREE_FEATURES.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-4 py-3 bg-green-50 rounded-xl">
                      <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                      <span className="text-sm text-green-900">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Section 2: Premium Features ─── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Crown size={16} className="text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">Fitur Premium</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PAID_FEATURES.map((plan) => (
                    <div key={plan.tier} className="border border-slate-200 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                          {plan.tier}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-indigo-500 mt-0.5 shrink-0">&#10003;</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Section 3: Template Gallery ─── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Palette size={16} className="text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">150+ Pilihan Template</h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">UMKM+</span>
                </div>
                <p className="text-slate-500 text-sm mb-5">
                  Paket gratis sudah termasuk beberapa template pilihan. Upgrade ke UMKM untuk akses 150+ template premium — dari minimalis hingga luxury.
                </p>

                {/* Template swatch cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {TEMPLATE_SAMPLES.map((t) => (
                    <div
                      key={t.name}
                      className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                    >
                      {/* Mini preview */}
                      <div className="p-3 space-y-2" style={{ backgroundColor: t.bg }}>
                        {/* Header bar */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.accent }} />
                          <div className="h-2 rounded-full flex-1" style={{ backgroundColor: t.text, opacity: 0.15 }} />
                        </div>
                        {/* Hero block */}
                        <div className="h-10 rounded-lg" style={{ backgroundColor: t.surface, border: `1px solid ${t.text}11` }} />
                        {/* Content lines */}
                        <div className="space-y-1.5">
                          <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: t.text, opacity: 0.2 }} />
                          <div className="h-1.5 rounded-full w-1/2" style={{ backgroundColor: t.text, opacity: 0.12 }} />
                        </div>
                        {/* Product cards */}
                        <div className="flex gap-1.5">
                          <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: t.surface, border: `1px solid ${t.text}11` }} />
                          <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: t.surface, border: `1px solid ${t.text}11` }} />
                        </div>
                        {/* CTA button */}
                        <div className="h-4 rounded-full w-2/3 mx-auto" style={{ backgroundColor: t.accent }} />
                      </div>
                      {/* Label */}
                      <div className="px-3 py-2 bg-white border-t border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-800 truncate">{t.name}</p>
                        <p className="text-[10px] text-slate-400">{t.layout}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prominent CTA to demo */}
                <Link
                  href={demoHref}
                  className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 transition-colors group"
                >
                  <div>
                    <p className="font-bold text-indigo-900 text-sm sm:text-base">
                      Explore Semua Template
                    </p>
                    <p className="text-indigo-600/70 text-xs sm:text-sm mt-0.5">
                      Coba langsung 150+ template dengan data demo interaktif
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </Link>
              </div>

              {/* ─── Section 4: QR Meja ─── */}
              <div className="rounded-2xl border-2 border-sky-200 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-50 to-indigo-50 px-5 py-5 sm:px-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <QrCode size={16} className="text-sky-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">QR Code per Meja</h3>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">UMKM+</span>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Generate QR code unik untuk setiap meja. Pelanggan scan, pilih menu, dan pesan sendiri — <strong>Anda fokus masak dan melayani</strong>, bukan catat pesanan.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-sky-100">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                        <QrCode size={20} className="text-sky-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Meja 1</p>
                        <p className="text-[10px] text-slate-400">Scan &rarr; Pesan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-sky-100">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                        <QrCode size={20} className="text-sky-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Meja 2</p>
                        <p className="text-[10px] text-slate-400">Scan &rarr; Pesan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-sky-100">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                        <QrCode size={20} className="text-sky-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Meja 3</p>
                        <p className="text-[10px] text-slate-400">Scan &rarr; Pesan</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-sky-100/50 rounded-xl px-4 py-3">
                    <Sparkles size={14} className="text-sky-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-sky-800">
                      <strong>Tidak perlu catat pesanan manual lagi.</strong> Pesanan masuk otomatis via WhatsApp lengkap dengan nomor meja — Anda tinggal siapkan dan antarkan.
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── Section 5: Cetak Menu PDF ─── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <FileText size={16} className="text-amber-700" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">Cetak Lembaran Menu (PDF)</h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">UMKM+</span>
                </div>
                <p className="text-slate-500 text-sm mb-5">
                  Download PDF menu siap cetak untuk ditaruh di meja atau etalase. Desain profesional dengan branding bisnis Anda.
                </p>

                {/* Mini PDF preview */}
                <div className="rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm bg-white">
                  <div className="p-5 space-y-4" style={{ background: 'linear-gradient(135deg, #faf7f2 0%, #fff 100%)' }}>
                    {/* PDF header mock */}
                    <div className="text-center space-y-1">
                      <div className="h-2.5 rounded-full w-1/3 mx-auto" style={{ backgroundColor: '#c8691b' }} />
                      <div className="h-1.5 rounded-full w-1/4 mx-auto bg-slate-200" />
                    </div>
                    {/* Menu items grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-100">
                          <div className="space-y-1 flex-1">
                            <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: '#2a2a2a', opacity: 0.25 }} />
                            <div className="h-1 rounded-full w-1/2" style={{ backgroundColor: '#c8691b', opacity: 0.4 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Footer branding */}
                    <div className="text-center pt-1">
                      <div className="h-1 rounded-full w-1/3 mx-auto bg-slate-200" />
                      <p className="text-[8px] text-slate-300 mt-1">Supported &amp; Powered by Etalaso</p>
                    </div>
                  </div>
                  {/* Feature highlights */}
                  <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 flex flex-wrap gap-2">
                    {['Nama bisnis', 'WhatsApp (opsional)', 'Harga (opsional)', 'Badge pesanan', 'Branding Etalaso'].map((label) => (
                      <span key={label} className="px-2 py-0.5 bg-white border border-amber-200 text-amber-800 text-[10px] font-medium rounded-full">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── Section 6: Pre-order & Pembayaran Langsung ─── */}
              <div className="rounded-2xl border-2 border-emerald-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-5 sm:px-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 text-base font-bold">$</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">Terima Pembayaran Langsung</h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">Business</span>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Pelanggan bisa pre-order dan bayar langsung ke rekening bank atau QRIS <strong>milik Anda sendiri</strong> — tanpa perantara, tanpa potongan.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-emerald-100">
                      <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">&#10003;</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Sistem Pre-order + Bukti Bayar</p>
                        <p className="text-xs text-slate-500 mt-0.5">Pelanggan upload bukti transfer sebelum ambil pesanan</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-emerald-100">
                      <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">&#10003;</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Bank Transfer & QRIS</p>
                        <p className="text-xs text-slate-500 mt-0.5">Uang masuk langsung ke rekening / QRIS Anda, bukan kami</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── CTA ─── */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-center text-white">
                <h3 className="text-xl font-black mb-2">Siap klaim bisnis Anda?</h3>
                <p className="text-indigo-100 text-sm mb-5">
                  Gratis untuk mulai. Upgrade kapan saja sesuai kebutuhan.
                </p>
                <Link
                  href={claimUrl}
                  className="inline-block bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors"
                >
                  Klaim Bisnis Ini
                </Link>
              </div>

              {/* Bottom spacing */}
              <div className="h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
