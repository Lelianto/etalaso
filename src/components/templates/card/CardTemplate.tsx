import React from 'react'
import Link from 'next/link'
import { BusinessData, getWhatsAppLink, getMapsLink, getReviews, getOpeningHours, shouldShowBadge, getClaimUrl } from '../types'
import EtalasoBadge from '../EtalasoBadge'

/**
 * Template "Card" — compact, single-page card layout
 * Warna: soft blue/indigo, clean white cards
 * Cocok untuk: klinik, apotek, kesehatan, jasa
 */
export default function CardTemplate({ business }: { business: BusinessData }) {
  const waLink = getWhatsAppLink(business)
  const mapsLink = getMapsLink(business)
  const hours = getOpeningHours(business)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 font-sans">
      <div className="max-w-lg mx-auto px-4 py-10 space-y-5">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-indigo-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 pt-10 pb-14 text-center text-white">
            {shouldShowBadge(business) && (
              <div className="mb-4">
                <EtalasoBadge variant="dark" />
              </div>
            )}
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 text-3xl font-black">
              {business.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold mb-1">{business.name}</h1>
            {hours && <p className="text-indigo-200 text-sm">{hours}</p>}
          </div>

          <div className="px-6 -mt-6">
            <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
              {business.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Alamat</p>
                    <p className="text-slate-700 text-sm">{business.address}</p>
                  </div>
                </div>
              )}
              {hours && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Jam Buka</p>
                    <p className="text-slate-700 text-sm">{hours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="px-6 py-6 grid grid-cols-2 gap-3">
            {business.whatsappNumber && (
              <a href={waLink} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center text-sm transition-colors">
                WhatsApp
              </a>
            )}
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-center text-sm transition-colors">
              Directions
            </a>
          </div>
        </div>

        {/* Description */}
        {business.description && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-2">Tentang</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{business.description}</p>
          </div>
        )}

        {/* Products */}
        {business.products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4">Produk & Layanan</h2>
            <div className="space-y-3">
              {business.products.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{p.name}</p>
                    {p.description && <p className="text-xs text-slate-400 truncate">{p.description}</p>}
                  </div>
                  {p.price && (
                    <span className="text-indigo-600 font-bold text-sm whitespace-nowrap">{p.price}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4">Ulasan</h2>
            <div className="space-y-4">
              {getReviews(business).map((r) => (
                <div key={r.id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-slate-800">{r.author}</span>
                    <span className="text-amber-400 text-xs">★★★★★</span>
                  </div>
                  {r.text && <p className="text-slate-500 text-sm">{r.text}</p>}
                  {r.date && <p className="text-slate-300 text-xs mt-1">{r.date}</p>}
                </div>
              ))}
            </div>
          </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-slate-400 text-xs">&copy; {new Date().getFullYear()} {business.name}</p>
          {shouldShowBadge(business) && (
            <Link href={getClaimUrl(business)} className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-700 transition-colors">
              Ini bisnis Anda? Klaim sekarang →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
