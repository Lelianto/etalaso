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
  theme: any
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

export default function ModernStorefront({ business, theme }: StorefrontProps) {
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

  const cssVars = {
    '--accent': theme.colors.accent,
    '--accent-light': `${theme.colors.accent}1A`,
    '--bg': theme.colors.background,
    '--primary': theme.colors.primary,
    '--secondary': theme.colors.secondary,
    '--font-display': theme.typography.fontDisplay,
    '--font-body': theme.typography.fontSans,
  } as React.CSSProperties

  return (
    <div className="min-h-screen" style={{ ...cssVars, fontFamily: 'var(--font-body)', backgroundColor: '#fafafa' }}>
      {/* Zoom Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full group" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-14 right-0 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
            <img src={selectedImage} alt="Zoom" className="w-full h-auto rounded-[2rem] shadow-2xl ring-1 ring-white/10" />
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative h-[45vh] min-h-[320px] bg-neutral-900 overflow-hidden">
        {business.imageUrl ? (
          <Image src={business.imageUrl} alt={business.name} fill className="object-cover opacity-70 scale-105" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 max-w-5xl mx-auto w-full">
          <Link href="/kuliner" className="inline-flex items-center gap-2 text-white/60 text-xs font-black uppercase tracking-[0.2em] mb-6 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-400'}`} />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{isOpen ? 'Buka Sekarang' : 'Sedang Tutup'}</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                {business.name}
              </h1>
              <p className="text-white/80 max-w-lg text-sm md:text-base font-medium leading-relaxed">{business.tagline || business.description}</p>
            </div>
            
            <div className="flex items-center gap-6 pb-2">
               <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
                 <PageViewCount businessId={business.id} inline />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Sticky Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-neutral-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-8 py-5 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            <MapPin size={14} style={{ color: 'var(--accent)' }} /> 
            <span className="text-neutral-900">{business.kecamatan || business.areaNote || 'Local Store'}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            <Clock size={14} style={{ color: 'var(--accent)' }} /> 
            <span className="text-neutral-900">{business.operatingDays?.length === 7 ? 'Buka Setiap Hari' : 'Sesuai Jadwal'}</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            {business.deliveryMethods?.map(m => {
              const label = DELIVERY_METHODS.find(dm => dm.value === m)?.label || m
              return (
                <div key={m} className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter bg-neutral-50 border border-neutral-200 text-neutral-500">
                  {label}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid Menu Content */}
      <main className="max-w-5xl mx-auto px-8 py-16 pb-40">
        {Array.from(grouped.entries()).map(([sub, items]) => (
          <section key={sub} className="mb-20 last:mb-0">
            <div className="flex items-end gap-4 mb-10 border-b border-neutral-100 pb-4">
              <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                {getSubcategoryLabel(sub)}
              </h2>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{items.length} Pilihan</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map(p => (
                <div key={p.id} className="group bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500 flex flex-col ring-1 ring-neutral-50">
                  <div className="relative aspect-[4/5] cursor-zoom-in overflow-hidden" onClick={() => p.imageUrl && setSelectedImage(p.imageUrl)}>
                    {p.imageUrl ? (
                      <Image 
                        src={p.imageUrl} 
                        alt={p.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-50 flex items-center justify-center text-4xl grayscale opacity-30">🍽️</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                       <span className="text-white text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">Lihat Detail</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col gap-5">
                    <div className="space-y-2">
                      <h3 className="font-bold text-neutral-900 text-xl tracking-tight line-clamp-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{p.name}</h3>
                      <p className="text-neutral-500 text-sm font-medium line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Harga</span>
                        <span className="text-2xl font-black tracking-tighter leading-none" style={{ color: 'var(--accent)' }}>{formatPrice(p.price)}</span>
                      </div>
                      <button 
                        onClick={() => addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95"
                        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                      >
                        <ShoppingBag size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Floating CTA */}
      {business.whatsappNumber && itemCount === 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-40">
          <a
            href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Halo ${business.name}, saya ingin memesan...`)}`}
            className="flex items-center justify-center gap-3 w-full bg-neutral-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black hover:scale-[1.05] active:scale-[0.95] transition-all"
          >
            <Phone size={16} fill="currentColor" className="text-white/30" /> Hubungi via WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
