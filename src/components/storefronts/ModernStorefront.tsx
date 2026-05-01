'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Phone, Truck, ArrowLeft, X, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useCart, useCartActions } from '@/lib/ordering/cart'
import { KULINER_SUBCATEGORIES, DELIVERY_METHODS, OPERATING_DAYS } from '@/lib/kuliner/constants'
import PageViewCount from '@/components/ui/PageViewCount'
import type { BusinessData } from '@/components/templates/types'

interface StorefrontProps {
  business: BusinessData & {
    id: string
  }
}

function getTodayOpen(operatingDays?: string[]): boolean {
  if (!operatingDays || operatingDays.length === 0) return true
  const today = OPERATING_DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  return operatingDays.includes(today)
}

function getSubcategoryLabel(value: string): string {
  return KULINER_SUBCATEGORIES.find(s => s.value === value)?.label || value
}

function formatPrice(price: string | null): string {
  if (!price) return 'Hubungi'
  const digits = price.replace(/[^0-9]/g, '')
  if (!digits) return price
  const amount = Number(digits)
  if (Number.isNaN(amount) || amount <= 0) return price
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export default function ModernStorefront({ business }: StorefrontProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { addItem } = useCartActions()
  const { itemCount } = useCart()
  const isOpen = getTodayOpen(business.operatingDays)
  const products = business.products || []

  // Group products by subcategory
  const grouped = new Map<string, typeof products>()
  for (const p of products) {
    const key = p.subcategory || 'lainnya'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(p)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Zoom Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-white"><X size={32} /></button>
            <img src={selectedImage} alt="Zoom" className="w-full h-auto rounded-xl" />
          </div>
        </div>
      )}

      {/* Modern Banner & Header */}
      <div className="relative h-64 bg-slate-900">
        {business.imageUrl && (
          <Image src={business.imageUrl} alt={business.name} fill className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-4xl mx-auto">
          <Link href="/kuliner" className="inline-flex items-center gap-2 text-white/70 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{business.name}</h1>
              <p className="text-white/80 max-w-xl text-sm md:text-base">{business.tagline || business.description}</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
              <PageViewCount businessId={business.id} inline />
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {isOpen ? 'Buka' : 'Tutup'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5"><MapPin size={14} className="text-indigo-500" /> {business.kecamatan || business.areaNote || 'Lokasi Terdaftar'}</div>
          <div className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-500" /> {business.operatingDays?.join(', ') || 'Setiap Hari'}</div>
          {business.deliveryMethods?.map(m => (
            <div key={m} className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Truck size={14} /> {m === 'pickup' ? 'Ambil Sendiri' : 'Kurir'}</div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-4xl mx-auto px-6 py-10 pb-32">
        {Array.from(grouped.entries()).map(([sub, items]) => (
          <section key={sub} className="mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              {getSubcategoryLabel(sub)}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {items.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative aspect-square cursor-zoom-in group" onClick={() => p.imageUrl && setSelectedImage(p.imageUrl)}>
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">🍽️</div>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1 line-clamp-1">{p.name}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-3 flex-grow">{p.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-indigo-600 text-sm">{formatPrice(p.price)}</span>
                      <button 
                        onClick={() => addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Floating Checkout CTA */}
      {business.whatsappNumber && itemCount === 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-40">
          <a
            href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Halo ${business.name}, saya ingin memesan...`)}`}
            className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-2xl hover:bg-black transition-colors"
          >
            <Phone size={20} /> Chat WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
