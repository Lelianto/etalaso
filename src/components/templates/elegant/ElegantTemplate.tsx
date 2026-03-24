import React from 'react'
import Link from 'next/link'
import { BusinessData, getWhatsAppLink, getMapsLink, getReviews, getOpeningHours, shouldShowBadge } from '../types'
import EtalasoBadge from '../EtalasoBadge'

/**
 * Template "Elegant" — classy, premium feel
 * Warna: deep navy, gold accents, white
 * Cocok untuk: salon, kecantikan, klinik, jasa premium
 */
export default function ElegantTemplate({ business }: { business: BusinessData }) {
  const waLink = getWhatsAppLink(business)
  const mapsLink = getMapsLink(business)
  const hours = getOpeningHours(business)

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          {shouldShowBadge(business) && (
            <div className="mb-6">
              <EtalasoBadge variant="dark" />
            </div>
          )}
          <div className="w-16 h-[2px] bg-amber-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            {business.name}
          </h1>
          <p className="max-w-lg mx-auto text-stone-400 font-sans text-sm leading-relaxed mb-10">
            {business.description || 'Pengalaman layanan terbaik dengan kualitas premium untuk Anda.'}
          </p>
          <div className="flex items-center justify-center gap-4 font-sans">
            {business.whatsappNumber && (
              <a href={waLink} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 text-sm uppercase tracking-wider transition-colors">
                Hubungi Kami
              </a>
            )}
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="border border-stone-500 text-stone-300 hover:text-white hover:border-white px-8 py-3 text-sm uppercase tracking-wider transition-colors">
              Lokasi
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-200 rounded-lg overflow-hidden shadow-sm">
          {hours && (
            <div className="bg-white p-6 text-center">
              <p className="text-xs text-stone-400 uppercase tracking-widest font-sans mb-1">Jam Operasional</p>
              <p className="font-medium text-sm">{hours}</p>
            </div>
          )}
          {business.address && (
            <div className="bg-white p-6 text-center">
              <p className="text-xs text-stone-400 uppercase tracking-widest font-sans mb-1">Alamat</p>
              <p className="font-medium text-sm">{business.address}</p>
            </div>
          )}
        </div>

        {/* Products */}
        {business.products.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <div className="w-12 h-[2px] bg-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-light">Layanan Kami</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {business.products.map((p) => (
                <div key={p.id} className="group">
                  <div className="border-b border-stone-200 pb-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-lg font-medium group-hover:text-amber-700 transition-colors">{p.name}</h3>
                      {p.price && <span className="text-amber-700 font-sans text-sm font-semibold">{p.price}</span>}
                    </div>
                    {p.description && <p className="text-stone-500 font-sans text-sm mt-2">{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-12">
            <div>
              <div className="text-center mb-10">
                <div className="w-12 h-[2px] bg-amber-400 mx-auto mb-4" />
                <h2 className="text-3xl font-light">Testimoni</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {getReviews(business).map((r) => (
                  <div key={r.id} className="border border-stone-700 rounded-lg p-6">
                    <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                    {r.text && (
                      <p className="text-stone-300 font-sans text-sm leading-relaxed italic mb-4">
                        &ldquo;{r.text}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs font-sans">
                      <span className="text-white font-semibold">{r.author}</span>
                      {r.date && <span className="text-stone-500">&middot; {r.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
      </main>

      <footer className="border-t border-stone-200 py-12 px-6 text-center font-sans">
        <p className="text-stone-400 text-xs uppercase tracking-widest">&copy; {new Date().getFullYear()} {business.name}</p>
        {shouldShowBadge(business) && (
          <Link href="/claim" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-amber-500 text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors">
            Ini bisnis Anda? Klaim sekarang →
          </Link>
        )}
      </footer>
    </div>
  )
}
