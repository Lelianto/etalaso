import React from 'react'
import { BusinessData, getWhatsAppLink, getReviews, getOpeningHours, shouldShowBadge } from '../types'
import EtalasoBadge from '../EtalasoBadge'

export default function MinimalistTemplate({ business }: { business: BusinessData }) {
  const waLink = getWhatsAppLink(business)
  const hours = getOpeningHours(business)

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 py-16 px-6 text-center">
        {shouldShowBadge(business) && (
          <div className="mb-6">
            <EtalasoBadge />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          {business.name}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-8 leading-relaxed">
          {business.description || 'Penyedia layanan berkualitas tinggi di kota Anda. Hubungi kami untuk informasi lebih lanjut.'}
        </p>
        {business.whatsappNumber && (
          <a href={waLink} className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl active:scale-95 gap-2">
            Chat via WhatsApp
          </a>
        )}
      </header>

      <main className="max-w-4xl mx-auto py-16 px-6">
        {business.products.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-slate-800">Produk & Layanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {business.products.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{p.description}</p>
                  {p.price && <p className="text-blue-600 font-bold">{p.price}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-slate-800">Apa Kata Mereka</h2>
            <div className="space-y-6">
              {getReviews(business).map((r) => (
                <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm italic text-slate-700">
                  <div className="flex text-yellow-500 mb-2">★★★★★</div>
                  <p className="mb-4">&quot;{r.text}&quot;</p>
                  <div className="text-sm font-bold text-slate-900 not-italic">
                    — {r.author} <span className="font-normal text-slate-400 ml-2">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Lokasi & Kontak</h2>
          {hours && (
            <div className="mb-6">
              <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Jam Operasional</p>
              <p className="text-slate-800 font-medium">{hours}</p>
            </div>
          )}
          {business.address && (
            <div className="mb-4">
              <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Alamat</p>
              <p className="text-slate-800 font-medium">{business.address}</p>
            </div>
          )}
          {business.whatsappNumber && (
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
              <a href={waLink} className="text-green-600 font-bold hover:underline">WhatsApp: {business.whatsappNumber}</a>
            </div>
          )}
        </section>
      </main>

      <footer className="py-12 pb-16 px-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-24">
        <p>&copy; {new Date().getFullYear()} {business.name}</p>
      </footer>
    </div>
  )
}
