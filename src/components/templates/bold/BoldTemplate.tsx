import React from 'react'
import Link from 'next/link'
import { BusinessData, getWhatsAppLink, getMapsLink, getReviews, getOpeningHours, shouldShowBadge, getClaimUrl } from '../types'
import EtalasoBadge from '../EtalasoBadge'

/**
 * Template "Bold" — energetic, modern, high-contrast
 * Warna: black, white, accent lime/emerald
 * Cocok untuk: bengkel, otomotif, barbershop, retail
 */
export default function BoldTemplate({ business }: { business: BusinessData }) {
  const waLink = getWhatsAppLink(business)
  const mapsLink = getMapsLink(business)
  const hours = getOpeningHours(business)

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20">
          {shouldShowBadge(business) && (
            <div className="mb-8">
              <EtalasoBadge variant="dark" />
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight mb-4">
                {business.name}
              </h1>
              <p className="text-zinc-400 max-w-md leading-relaxed">
                {business.description || 'Layanan profesional dan terpercaya untuk kebutuhan Anda.'}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end shrink-0">
              {business.whatsappNumber && (
                <a href={waLink} className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-4 text-sm uppercase tracking-wider transition-colors text-center">
                  WhatsApp Sekarang
                </a>
              )}
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 px-8 py-4 text-sm uppercase tracking-wider transition-colors text-center">
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Info Strip */}
      <div className="border-y border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
          {business.address && (
            <div className="py-5 sm:pr-6">
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">Alamat</p>
              <p className="text-zinc-300 text-sm">{business.address}</p>
            </div>
          )}
          {hours && (
            <div className="py-5 sm:px-6">
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">Jam Buka</p>
              <p className="text-zinc-300 text-sm">{hours}</p>
            </div>
          )}
          {business.whatsappNumber && (
            <div className="py-5 sm:pl-6">
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">Kontak</p>
              <p className="text-zinc-300 text-sm">{business.whatsappNumber}</p>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Products */}
        {business.products.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-8">
              <span className="text-emerald-500">{'//'}</span> Produk & Layanan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {business.products.map((p) => (
                <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-6 hover:border-emerald-500/50 transition-colors group">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">{p.name}</h3>
                  {p.description && <p className="text-zinc-500 text-sm mb-4">{p.description}</p>}
                  {p.price && (
                    <span className="text-emerald-400 font-black text-lg">{p.price}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section>
            <h2 className="text-3xl font-black mb-8">
              <span className="text-emerald-500">{'//'}</span> Review
            </h2>
            <div className="space-y-4">
              {getReviews(business).map((r) => (
                <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-6 flex gap-5">
                  <div className="w-12 h-12 bg-emerald-500 text-black font-black text-xl flex items-center justify-center shrink-0">
                    5
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-sm">{r.author}</span>
                      <span className="text-emerald-500 text-sm">★★★★★</span>
                      {r.date && <span className="text-zinc-600 text-xs">{r.date}</span>}
                    </div>
                    {r.text && <p className="text-zinc-400 text-sm leading-relaxed">{r.text}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
      </main>

      <footer className="border-t border-zinc-800 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs">&copy; {new Date().getFullYear()} {business.name}</p>
          {shouldShowBadge(business) && (
            <Link href={getClaimUrl(business)} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black text-xs font-black uppercase tracking-wider hover:bg-emerald-400 transition-colors">
              Klaim bisnis ini →
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}
