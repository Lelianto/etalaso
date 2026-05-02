'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, X, MapPin, Star, Clock, ChevronRight, Phone, Plus } from 'lucide-react'
import { useCart, useCartActions } from '@/lib/ordering/cart'
import PageViewCount from '@/components/ui/PageViewCount'
import type { ThemeConfig } from '@/components/templates/DesignSystem'

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

export default function VisualImmersiveStorefront({ business, theme }: StorefrontProps) {
  const { addItem } = useCartActions()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const products = business.products || []
  
  const cssVars = {
    '--primary': theme.colors.primary,
    '--secondary': theme.colors.secondary,
    '--accent': theme.colors.accent,
    '--accent-light': theme.colors.accent + '1A',
    '--bg': theme.colors.background,
    '--font-display': theme.typography.fontDisplay,
    '--font-body': theme.typography.fontSans,
  } as React.CSSProperties

  return (
    <div className="min-h-screen bg-black" style={cssVars}>
      {/* Immersive Header */}
      <header className="relative h-[70vh] flex items-end overflow-hidden">
        {business.imageUrl && (
          <Image src={business.imageUrl} alt={business.name} fill className="object-cover opacity-70 scale-105" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
        
        <div className="absolute top-8 left-6 right-6 flex justify-between items-start z-20">
          <Link href="/kuliner" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
             <PageViewCount businessId={business.id} inline />
          </div>
        </div>

        <div className="relative z-10 p-8 w-full max-w-4xl mx-auto space-y-6 pb-20">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Toko Pilihan</span>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.8]" style={{ fontFamily: 'var(--font-display)' }}>
              {business.name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2 border-r border-white/20 pr-6"><MapPin size={16} /> {business.kecamatan}</div>
            <div className="flex items-center gap-2"><Clock size={16} /> Buka Sekarang</div>
          </div>
        </div>
      </header>

      {/* Product Discovery */}
      <main className="relative z-20 -mt-16 rounded-t-[4rem] bg-white px-6 pt-16 pb-40 ring-1 ring-black/5">
        <div className="max-w-4xl mx-auto space-y-32">
          {products.length === 0 ? (
            <div className="py-20 text-center text-neutral-400 font-medium tracking-tighter">Sedang menyiapkan menu spesial...</div>
          ) : (
            products.map((p: any, idx: number) => (
              <div key={p.id} className={`flex flex-col md:flex-row gap-12 md:gap-20 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Visual Side */}
                <div className="w-full md:w-1/2 aspect-square md:aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl group">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-8xl opacity-30 grayscale">🍱</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 space-y-8">
                  <div className="space-y-4">
                    <div className="w-12 h-1 bg-black/10" style={{ backgroundColor: 'var(--accent)' }} />
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                      {p.name}
                    </h3>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">{p.description}</p>
                  </div>
                  
                  <div className="flex flex-col gap-6 pt-4">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Harga Menu</span>
                       <span className="text-4xl font-black tracking-tighter text-slate-900">
                         {formatPrice(p.price)}
                       </span>
                    </div>
                    <button 
                      onClick={() => addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                      className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
                      style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                    >
                      <Plus size={18} strokeWidth={3} /> Masukkan Keranjang
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Navigation */}
      <div className="fixed bottom-10 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-md mx-auto px-6 pointer-events-auto">
          <div className="bg-black/90 backdrop-blur-2xl rounded-full p-2 flex items-center justify-between border border-white/10 shadow-2xl">
             <div className="flex items-center gap-4 pl-6 text-white text-xs font-black uppercase tracking-widest">
               Lihat Menu
             </div>
             <a 
               href={`https://wa.me/${business.whatsappNumber}`}
               className="h-14 px-8 rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest text-black"
               style={{ backgroundColor: 'white' }}
             >
               Pesan Sekarang
             </a>
          </div>
        </div>
      </div>
    </div>
  )
}
