import React from 'react'
import Link from 'next/link'
import { BusinessData, getWhatsAppLink, getMapsLink, getReviews, getOpeningHours, shouldShowBadge, getClaimUrl } from '../types'
import EtalasoBadge from '../EtalasoBadge'

/**
 * Template "Warung" — warm, friendly, food-focused
 * Warna: earth tones (amber, orange, warm brown)
 * Cocok untuk: warung makan, depot, bakso, mie ayam
 */
export default function WarungTemplate({ business }: { business: BusinessData }) {
  const waLink = getWhatsAppLink(business)
  const mapsLink = getMapsLink(business)
  const hours = getOpeningHours(business)

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      {/* Banner */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 text-white">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          {shouldShowBadge(business) && (
            <div className="mb-6">
              <EtalasoBadge variant="dark" />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-sm">
            {business.name}
          </h1>
          {business.address && (
            <p className="text-amber-100 text-sm md:text-base max-w-xl mx-auto">
              {business.address}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-8">
            {business.whatsappNumber && (
              <a href={waLink} className="bg-white text-orange-700 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-lg">
                Pesan via WA
              </a>
            )}
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              Lihat di Maps
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {/* About */}
        {business.description && (
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
            <h2 className="text-xl font-bold text-orange-700 mb-3">Tentang Kami</h2>
            <p className="text-stone-600 leading-relaxed">{business.description}</p>
          </section>
        )}

        {/* Opening Hours */}
        {hours && (
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
            <h2 className="text-xl font-bold text-orange-700 mb-3">Jam Buka</h2>
            <p className="text-stone-700 font-medium">{hours}</p>
          </section>
        )}

        {/* Menu / Products */}
        {business.products.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Menu</h2>
            <div className="space-y-3">
              {business.products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-5 shadow-sm border border-amber-100 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-800">{p.name}</h3>
                    {p.description && <p className="text-stone-500 text-sm mt-1">{p.description}</p>}
                  </div>
                  {p.price && (
                    <span className="text-orange-700 font-bold whitespace-nowrap bg-orange-50 px-3 py-1 rounded-full text-sm">
                      {p.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Ulasan Pelanggan</h2>
            <div className="grid gap-4">
              {getReviews(business).map((r) => (
                <div key={r.id} className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white font-bold text-sm">
                      {r.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{r.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 text-sm">★★★★★</span>
                        {r.date && <span className="text-stone-400 text-xs">{r.date}</span>}
                      </div>
                    </div>
                  </div>
                  {r.text && <p className="text-stone-600 text-sm leading-relaxed">{r.text}</p>}
                </div>
              ))}
            </div>
          </section>
      </main>

      <footer className="border-t border-amber-200 py-10 px-6 text-center bg-white">
        <p className="text-stone-400 text-sm">&copy; {new Date().getFullYear()} {business.name}</p>
        {shouldShowBadge(business) && (
          <Link href={getClaimUrl(business)} className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-orange-600 text-white rounded-full text-xs font-bold hover:bg-orange-700 transition-colors">
            Ini bisnis Anda? Klaim sekarang →
          </Link>
        )}
      </footer>
    </div>
  )
}
