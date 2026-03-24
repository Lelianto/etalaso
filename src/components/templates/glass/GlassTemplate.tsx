import React from 'react'
import Link from 'next/link'
import { BusinessData, getWhatsAppLink, getMapsLink, getReviews, getOpeningHours, shouldShowBadge, getClaimUrl } from '../types'
import EtalasoBadge from '../EtalasoBadge'

/**
 * Template "Glass" — glassmorphism, gradient backgrounds
 * Warna: purple/violet gradient, frosted glass cards
 * Cocok untuk: kafe, coffee shop, tempat nongkrong, creative space
 */
export default function GlassTemplate({ business }: { business: BusinessData }) {
  const waLink = getWhatsAppLink(business)
  const mapsLink = getMapsLink(business)
  const hours = getOpeningHours(business)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 text-white font-sans">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-16 space-y-8">
        {/* Header */}
        <header className="text-center py-10">
          {shouldShowBadge(business) && (
            <div className="mb-6">
              <EtalasoBadge variant="dark" />
            </div>
          )}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {hours || 'Buka'}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {business.name}
          </h1>
          {business.address && (
            <p className="text-purple-300/80 text-sm max-w-md mx-auto">{business.address}</p>
          )}
          <div className="flex items-center justify-center gap-3 mt-8">
            {business.whatsappNumber && (
              <a href={waLink} className="bg-white/15 backdrop-blur-md hover:bg-white/25 border border-white/20 text-white font-bold px-7 py-3 rounded-2xl text-sm transition-all">
                Chat WhatsApp
              </a>
            )}
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="bg-white/5 backdrop-blur-md hover:bg-white/15 border border-white/10 text-purple-200 font-semibold px-7 py-3 rounded-2xl text-sm transition-all">
              Maps
            </a>
          </div>
        </header>

        {/* About */}
        {business.description && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <p className="text-purple-100 leading-relaxed text-center">{business.description}</p>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          {hours && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 col-span-2">
              <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">Jam Buka</p>
              <p className="text-sm font-medium">{hours}</p>
            </div>
          )}
        </div>

        {/* Products */}
        {business.products.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Menu & Layanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.products.map((p) => (
                <div key={p.id} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold group-hover:text-purple-200 transition-colors">{p.name}</h3>
                      {p.description && <p className="text-purple-300/70 text-sm mt-1">{p.description}</p>}
                    </div>
                    {p.price && (
                      <span className="bg-white/15 text-purple-100 font-bold text-sm px-3 py-1 rounded-xl whitespace-nowrap">
                        {p.price}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Ulasan</h2>
            <div className="space-y-4">
              {getReviews(business).map((r) => (
                <div key={r.id} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center font-bold text-sm">
                      {r.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{r.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-300 text-xs">★★★★★</span>
                        {r.date && <span className="text-purple-400 text-xs">{r.date}</span>}
                      </div>
                    </div>
                  </div>
                  {r.text && <p className="text-purple-200/80 text-sm leading-relaxed">{r.text}</p>}
                </div>
              ))}
            </div>
          </section>

        {/* Footer */}
        <footer className="text-center pt-8 pb-4">
          <p className="text-purple-400/60 text-xs">&copy; {new Date().getFullYear()} {business.name}</p>
          {shouldShowBadge(business) && (
            <Link href={getClaimUrl(business)} className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white/15 backdrop-blur-md border border-white/20 text-white rounded-2xl text-xs font-bold hover:bg-white/25 transition-all">
              Ini bisnis Anda? Klaim sekarang →
            </Link>
          )}
        </footer>
      </div>
    </div>
  )
}
