'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, MapPin, Star, Clock, Phone, Truck, Plus, ChevronRight, Share2 } from 'lucide-react'
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

export default function BentoStorefront({ business, theme }: StorefrontProps) {
  const { addItem } = useCartActions()
  const { itemCount } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Dynamic Font Injection
  useEffect(() => {
    const fonts = [
      theme.typography.fontDisplay.split(',')[0],
      theme.typography.fontSans.split(',')[0]
    ].filter(f => !['Inter', 'system-ui', 'sans-serif', 'serif'].includes(f))

    if (fonts.length > 0) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${fonts.map(f => f.replace(' ', '+')).join('&family=')}&display=swap`
      document.head.appendChild(link)
      return () => { document.head.removeChild(link) }
    }
  }, [theme])

  const products = business.products || []
  const subcategories = Array.from(new Set(products.map((p: any) => p.subcategory || 'lainnya')))
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter((p: any) => (p.subcategory || 'lainnya') === selectedCategory)

  const cssVars = {
    '--primary': theme.colors.primary,
    '--accent': theme.colors.accent,
    '--bg': theme.colors.background,
    '--surface': theme.colors.surface,
    '--text': theme.colors.text,
    '--muted': theme.colors.muted,
    '--font-display': theme.typography.fontDisplay,
    '--font-body': theme.typography.fontSans,
    '--radius': theme.styles.borderRadius,
  } as React.CSSProperties

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8" style={cssVars}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between px-2">
          <Link href="/kuliner" className="p-3 bg-white rounded-2xl shadow-sm hover:scale-105 transition-transform">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div className="flex gap-3">
             <button className="p-3 bg-white rounded-2xl shadow-sm hover:scale-105 transition-transform">
               <Share2 size={20} className="text-slate-600" />
             </button>
             <div className="bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3">
                <PageViewCount businessId={business.id} inline />
             </div>
          </div>
        </div>

        {/* Bento Grid Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Info Card */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-8 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[300px]">
             {business.imageUrl && (
               <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -rotate-12 translate-x-4 -translate-y-4">
                 <Image src={business.imageUrl} alt="" fill className="object-contain" />
               </div>
             )}
             <div className="space-y-4">
               <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                 <Star size={12} fill="currentColor" /> Toko Terverifikasi
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                 {business.name}
               </h1>
               <p className="text-slate-500 font-medium text-lg leading-relaxed italic">{business.tagline || 'Kelezatan rumahan terbaik untuk Anda.'}</p>
             </div>
             <div className="flex items-center gap-4 pt-8">
                <a 
                  href={`https://wa.me/${business.whatsappNumber}`}
                  className="flex-grow bg-slate-900 text-white py-5 rounded-2xl text-center font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                >
                  Pesan via WhatsApp
                </a>
             </div>
          </div>

          {/* Quick Info Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
             {/* Open Status */}
             <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-center items-center text-center gap-4">
               <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                 <Clock size={24} />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                 <p className="font-bold text-slate-900 uppercase tracking-tighter">Buka Sekarang</p>
               </div>
             </div>

             {/* Location */}
             <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-center items-center text-center gap-4">
               <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                 <MapPin size={24} />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lokasi</p>
                 <p className="font-bold text-slate-900 truncate px-2">{business.kecamatan || 'Area Sekitar'}</p>
               </div>
             </div>

             {/* Delivery Methods */}
             <div className="col-span-2 bg-slate-900 rounded-[2rem] p-8 text-white flex items-center justify-between overflow-hidden relative group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Layanan Pengiriman</p>
                  <div className="flex flex-wrap gap-2">
                    {business.deliveryMethods?.map((m: string) => (
                      <span key={m} className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold border border-white/10">
                        {DELIVERY_METHODS.find(dm => dm.value === m)?.label || m}
                      </span>
                    ))}
                  </div>
                </div>
                <Truck size={60} className="absolute -right-4 -bottom-4 text-white/5 -rotate-12 group-hover:translate-x-2 transition-transform duration-700" />
             </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar pt-6">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${selectedCategory === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Semua Menu
          </button>
          {subcategories.map((sub: any) => (
            <button 
              key={sub}
              onClick={() => setSelectedCategory(sub)}
              className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm whitespace-nowrap ${selectedCategory === sub ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {getSubcategoryLabel(sub)}
            </button>
          ))}
        </div>

        {/* Modern Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredProducts.map((p: any) => (
             <div key={p.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col ring-1 ring-slate-100">
                <div className="relative aspect-[16/10] overflow-hidden">
                   {p.imageUrl ? (
                     <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="w-full h-full bg-slate-50 flex items-center justify-center text-4xl grayscale opacity-30">🍱</div>
                   )}
                   <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/20">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Favorit</span>
                   </div>
                </div>
                <div className="p-8 space-y-4 flex-grow flex flex-col">
                   <div className="space-y-1">
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight" style={{ color: 'var(--primary)' }}>{p.name}</h3>
                     <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">{p.description}</p>
                   </div>
                   <div className="flex items-center justify-between pt-6 mt-auto">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harga</span>
                         <span className="text-2xl font-black tracking-tighter" style={{ color: 'var(--accent)' }}>{formatPrice(p.price)}</span>
                      </div>
                      <button 
                        onClick={() => addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                        className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-black hover:scale-110 active:scale-95 transition-all"
                      >
                        <Plus size={24} />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Modern Floating CTA */}
      <div className="fixed bottom-10 left-0 right-0 z-50 px-6 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-slate-900 rounded-full p-2 flex items-center justify-between shadow-2xl shadow-slate-400 ring-4 ring-white">
             <div className="flex items-center gap-4 pl-6 text-white">
               <ShoppingBag size={20} />
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/50 leading-none">Keranjang</span>
                 <span className="text-sm font-bold tracking-tight">{itemCount} Menu Dipilih</span>
               </div>
             </div>
             <a 
               href={`https://wa.me/${business.whatsappNumber}`}
               className="bg-white text-slate-900 h-14 px-8 rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
             >
               Checkout
             </a>
          </div>
        </div>
      </div>
    </div>
  )
}
