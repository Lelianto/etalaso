'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, X, MapPin, Star, Clock, ChevronRight, Phone } from 'lucide-react'
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
      <header className="relative h-[60vh] flex items-end">
        {business.imageUrl && (
          <Image src={business.imageUrl} alt={business.name} fill className="object-cover opacity-60" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
        
        <div className="absolute top-8 left-6 right-6 flex justify-between items-start z-20">
          <Link href="/kuliner" className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
             <PageViewCount businessId={business.id} inline />
          </div>
        </div>

        <div className="relative z-10 p-8 w-full max-w-4xl mx-auto space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            {business.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm font-medium tracking-tight">
            <div className="flex items-center gap-2"><MapPin size={16} className="text-white" /> {business.kecamatan}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="flex items-center gap-2"><Star size={16} className="text-yellow-400 fill-yellow-400" /> Premium Store</div>
          </div>
        </div>
      </header>

      {/* Product Discovery */}
      <main className="relative z-10 -mt-10 rounded-t-[3rem] bg-white px-6 pt-12 pb-40">
        <div className="max-w-4xl mx-auto space-y-16">
          {products.length === 0 ? (
            <div className="py-20 text-center text-neutral-400 font-medium tracking-tighter">Exploring our kitchen...</div>
          ) : (
            products.map((p: any, idx: number) => (
              <div key={p.id} className={`flex flex-col md:flex-row gap-10 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Visual Side */}
                <div className="w-full md:w-3/5 aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl shadow-neutral-200 group">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-50 flex items-center justify-center text-6xl opacity-20">🍽️</div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Content Side */}
                <div className="w-full md:w-2/5 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black tracking-tighter leading-none text-neutral-900" style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                      {p.name}
                    </h3>
                    <p className="text-neutral-500 font-medium leading-relaxed">{p.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-3xl font-black tracking-tighter" style={{ color: 'var(--accent)' }}>
                      {formatPrice(p.price)}
                    </span>
                    <button 
                      onClick={() => addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                      style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                    >
                      <ShoppingBag size={24} />
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
               Explore Menu
             </div>
             <a 
               href={`https://wa.me/${business.whatsappNumber}`}
               className="h-14 px-8 rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest text-black"
               style={{ backgroundColor: 'white' }}
             >
               Order Now
             </a>
          </div>
        </div>
      </div>
    </div>
  )
}
