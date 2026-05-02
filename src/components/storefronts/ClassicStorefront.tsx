'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Phone, Truck, ArrowLeft, X } from 'lucide-react'
import { useState } from 'react'
import { useCart, useCartActions } from '@/lib/ordering/cart'
import { KULINER_SUBCATEGORIES, DELIVERY_METHODS, OPERATING_DAYS } from '@/lib/kuliner/constants'
import PageViewCount from '@/components/ui/PageViewCount'
import type { BusinessData } from '@/components/templates/types'

interface ClassicStorefrontProps {
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

function getSubcategoryIcon(value: string): string {
  return KULINER_SUBCATEGORIES.find(s => s.value === value)?.icon || '🍽️'
}

function formatPrice(price: string | null): string {
  if (!price) return 'Hubungi'
  const digits = price.replace(/[^0-9]/g, '')
  if (!digits) return price
  const amount = Number(digits)
  if (Number.isNaN(amount) || amount <= 0) return price
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export default function ClassicStorefront({ business, theme }: ClassicStorefrontProps) {
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
    <div className="min-h-screen pb-10" style={{ ...cssVars, backgroundColor: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-all backdrop-blur-md"
            >
              <X size={24} />
            </button>
            <div className="w-full h-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
              <img
                src={selectedImage}
                alt="Produk"
                className="w-full h-full object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white border-b border-neutral-100/80">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/80 to-white" />
        <div className="max-w-2xl mx-auto px-6 pt-6 pb-10 relative z-10">
          <Link
            href="/kuliner"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-all mb-6"
          >
            <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-neutral-900 transition-colors">
              <ArrowLeft size={14} />
            </div>
            <span>Kembali</span>
          </Link>

          <div className="flex flex-col gap-8">
            {/* Store image with subtle float effect */}
            {business.imageUrl && (
              <div className="w-full h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-neutral-200/60 relative group ring-1 ring-neutral-100">
                <Image
                  src={business.imageUrl}
                  alt={business.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            )}

            <div className="flex flex-col gap-5 text-center items-center">
              <div className="flex flex-col gap-2 items-center">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                  isOpen ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                }`}>
                  {isOpen ? 'Buka Sekarang' : 'Sedang Tutup'}
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral-900 mt-2 leading-[1.1]" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                  {business.name}
                </h1>
                {business.tagline && (
                  <p className="text-neutral-500 font-medium italic mt-2 text-sm md:text-base max-w-md" style={{ color: 'var(--secondary)' }}>{business.tagline}</p>
                )}
              </div>

              {/* Enhanced Info Grid */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {business.areaNote && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-600 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-200">
                    <MapPin size={14} className="text-neutral-400" /> {business.areaNote}
                  </span>
                )}
                {business.operatingDays && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-600 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-200">
                    <Clock size={14} className="text-neutral-400" /> {business.operatingDays.length === 7 ? 'Setiap Hari' : business.operatingDays.join(', ')}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {business.deliveryMethods?.map(dm => {
                  const method = DELIVERY_METHODS.find(m => m.value === dm)
                  if (!method) return null
                  return (
                    <span key={dm} className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-current shadow-sm" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-light)' }}>
                      <Truck size={12} /> {method.label}
                    </span>
                  )
                })}
              </div>

              {business.description && (
                <p className="text-sm leading-relaxed text-neutral-600 max-w-lg mt-2" style={{ color: 'var(--secondary)' }}>{business.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-2xl mx-auto px-5 pt-10 pb-40">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50/50 rounded-[2.5rem] border border-dashed border-neutral-200">
            <div className="text-5xl mb-4 grayscale opacity-50">🍱</div>
            <h3 className="font-bold text-neutral-900">Menu Segera Hadir</h3>
            <p className="text-sm text-neutral-500 mt-1">Kami sedang menyiapkan menu spesial untuk Anda.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Array.from(grouped.entries()).map(([subcategory, items]) => (
              <div key={subcategory} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-lg shadow-neutral-100 flex items-center justify-center text-xl border border-neutral-50">
                    {getSubcategoryIcon(subcategory)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight" style={{ color: 'var(--primary)' }}>
                      {getSubcategoryLabel(subcategory)}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">{items.length} Menu</p>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {items.map(product => (
                    <ProductCard key={product.id} product={product} onAdd={addItem} onImageClick={setSelectedImage} accentColor={theme.colors.accent} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky WhatsApp Floating Button - Enhanced */}
      {business.whatsappNumber && itemCount === 0 && (
        <div className="fixed bottom-8 left-0 right-0 px-5 z-40 pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <a
              href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Halo, saya lihat ${business.name} di Etalaso. Hari ini buka?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full text-white py-4.5 rounded-[1.5rem] font-bold text-sm shadow-2xl shadow-neutral-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Phone size={18} fill="currentColor" className="text-white/20" />
              Chat via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({
  product,
  onAdd,
  onImageClick,
  accentColor,
}: {
  product: {
    id: string
    name: string
    price: string | null
    description: string | null
    imageUrl: string | null
    availabilityNote?: string | null
  }
  onAdd: (item: { id: string; name: string; price: string | null; imageUrl?: string | null }) => void
  onImageClick: (url: string) => void
  accentColor: string
}) {
  return (
    <div className="group bg-white rounded-3xl border border-neutral-100 p-3 sm:p-5 flex gap-4 sm:gap-6 hover:border-neutral-200 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500 ring-1 ring-transparent hover:ring-neutral-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-neutral-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
      {product.imageUrl && (
        <button
          type="button"
          onClick={() => onImageClick(product.imageUrl!)}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 relative cursor-zoom-in shadow-inner ring-1 ring-neutral-100 z-10"
        >
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        </button>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1 z-10">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-neutral-900 text-base sm:text-lg tracking-tight leading-snug line-clamp-2" style={{ color: 'var(--primary)' }}>{product.name}</h3>
            {product.availabilityNote && (
              <span className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm border border-current" style={{ color: accentColor, backgroundColor: `${accentColor}1A`, borderColor: `${accentColor}33` }}>
                {product.availabilityNote}
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--secondary)' }}>{product.description}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg sm:text-xl font-black tracking-tighter text-neutral-900" style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAdd({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md hover:shadow-lg"
            style={{ color: 'white', backgroundColor: accentColor }}
          >
            Pesan
          </button>
        </div>
      </div>
    </div>
  )
}
