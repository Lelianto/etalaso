'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, MapPin, Star, Clock, Phone, Truck, Plus, ChevronRight, X } from 'lucide-react'
import { useCart, useCartActions } from '@/lib/ordering/cart'
import PageViewCount from '@/components/ui/PageViewCount'
import type { ThemeConfig } from '@/components/templates/DesignSystem'
import { KULINER_SUBCATEGORIES, DELIVERY_METHODS, OPERATING_DAYS } from '@/lib/kuliner/constants'

interface StorefrontProps {
  business: any
  theme: ThemeConfig
}

function formatPrice(price: string | null): string {
  if (!price) return 'Hubungi'
  const digits = price.replace(/[^0-9]/g, '')
  if (!digits) return price
  const amount = Number(digits)
  if (Number.isNaN(amount) || amount <= 0) return price
  return `Rp ${amount.toLocaleString('id-ID')}`
}

function getSubcategoryLabel(value: string): string {
  return KULINER_SUBCATEGORIES.find(s => s.value === value)?.label || value
}

export default function EditorialStorefront({ business, theme }: StorefrontProps) {
  const { addItem } = useCartActions()
  const { itemCount } = useCart()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const products = business.products || []
  const grouped = new Map<string, typeof products>()
  for (const p of products) {
    const key = p.subcategory || 'lainnya'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(p)
  }

  const cssVars = {
    '--primary': theme.colors.primary,
    '--accent': theme.colors.accent,
    '--bg': theme.colors.background,
    '--surface': theme.colors.surface,
    '--text': theme.colors.text,
    '--muted': theme.colors.muted,
    '--font-display': "'DM Serif Display', serif",
    '--font-body': "'Plus Jakarta Sans', sans-serif",
    '--radius': theme.styles.borderRadius,
  } as React.CSSProperties

  return (
    <div className="min-h-screen bg-white" style={cssVars}>
      {/* Zoom Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-8" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-16 right-0 text-slate-400 hover:text-black transition-colors"><X size={32} /></button>
            <img src={selectedImage} alt="Zoom" className="w-full h-auto rounded-[2rem] shadow-2xl ring-1 ring-black/5" />
          </div>
        </div>
      )}

      {/* Editorial Header */}
      <div className="relative pt-12 pb-24 px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8 relative z-10">
             <Link href="/kuliner" className="inline-flex items-center gap-3 text-slate-400 hover:text-black transition-colors group">
               <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50">
                 <ArrowLeft size={16} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Kembali</span>
             </Link>
             
             <div className="space-y-4">
               <h1 className="text-6xl md:text-9xl font-normal text-slate-900 leading-[0.9] tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                 {business.name}
               </h1>
               <div className="flex items-center gap-6 pt-4">
                 <div className="w-20 h-[1px] bg-slate-900" />
                 <p className="text-xl md:text-2xl text-slate-500 italic max-w-md font-medium leading-relaxed">
                   {business.tagline || business.description || 'Kelezatan rumahan yang dibuat dengan penuh cinta.'}
                 </p>
               </div>
             </div>

             <div className="flex flex-wrap items-center gap-8 pt-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Lokasi Utama</span>
                  <span className="font-bold text-slate-900">{business.kecamatan || 'Area Sekitar'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Statistik</span>
                  <PageViewCount businessId={business.id} inline />
                </div>
             </div>
          </div>

          <div className="md:col-span-5 relative aspect-[3/4] md:translate-x-12">
            {business.imageUrl ? (
              <Image src={business.imageUrl} alt={business.name} fill className="object-cover rounded-[3rem] shadow-2xl" />
            ) : (
              <div className="w-full h-full bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center text-8xl grayscale opacity-10">🍱</div>
            )}
            <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 text-center">Buka Sekarang</p>
               <p className="text-xl font-bold tracking-tight text-center">Open for Order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <main className="max-w-6xl mx-auto px-8 pb-40">
        {Array.from(grouped.entries()).map(([sub, items]) => (
          <section key={sub} className="mt-32 first:mt-0">
            <div className="flex flex-col items-center text-center mb-20">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-6">Discovery</span>
               <h2 className="text-5xl md:text-7xl font-normal text-slate-900 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                 {getSubcategoryLabel(sub)}
               </h2>
               <div className="w-12 h-1 bg-slate-900 mt-8" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {items.map((p: any) => (
                <div key={p.id} className="group space-y-6">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-50 cursor-zoom-in shadow-sm group-hover:shadow-2xl group-hover:shadow-slate-200 transition-all duration-700" onClick={() => p.imageUrl && setSelectedImage(p.imageUrl)}>
                     {p.imageUrl ? (
                       <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-6xl grayscale opacity-20">🍽️</div>
                     )}
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-start gap-4">
                        <h3 className="text-3xl font-normal text-slate-900 leading-tight tracking-tight group-hover:italic transition-all" style={{ fontFamily: 'var(--font-display)' }}>{p.name}</h3>
                        <span className="text-xl font-normal tracking-tighter text-slate-900 pt-2" style={{ fontFamily: 'var(--font-display)' }}>{formatPrice(p.price)}</span>
                     </div>
                     <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">{p.description}</p>
                     <button 
                       onClick={() => addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                       className="w-full border-2 border-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
                     >
                       <Plus size={16} strokeWidth={3} /> Masukkan Keranjang
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Editorial Footer CTA */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
         <div className="bg-white border-2 border-slate-900 rounded-[2rem] p-3 shadow-2xl flex items-center gap-2 ring-8 ring-white/50">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0">
               <ShoppingBag size={24} />
            </div>
            <div className="flex-grow px-4">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Pemesanan</p>
               <p className="font-bold text-slate-900">{itemCount} Menu</p>
            </div>
            <a 
              href={`https://wa.me/${business.whatsappNumber}`}
              className="bg-slate-900 text-white px-8 h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
            >
              Order
            </a>
         </div>
      </div>
    </div>
  )
}
