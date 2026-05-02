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
      <div className="relative overflow-hidden bg-white border-b border-neutral-100/50">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-neutral-50/50" />
        <div className="max-w-2xl mx-auto px-5 pt-5 pb-8 relative z-10">
          <Link
            href="/kuliner"
            className="group inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-all mb-5"
          >
            <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:border-neutral-900 transition-colors">
              <ArrowLeft size={14} />
            </div>
            <span className="font-medium">Kembali</span>
          </Link>

          <div className="flex flex-col gap-6">
            {/* Store image with subtle float effect */}
            {business.imageUrl && (
              <div className="w-full h-56 rounded-[2rem] overflow-hidden shadow-2xl shadow-neutral-200/50 relative group">
                <Image
                  src={business.imageUrl}
                  alt={business.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-3xl font-bold tracking-tight text-neutral-900" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                    {business.name}
                  </h1>
                  <div className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {isOpen ? 'Buka Sekarang' : 'Sedang Tutup'}
                  </div>
                </div>
                {business.tagline && (
                  <p className="text-neutral-500 font-medium italic" style={{ color: 'var(--secondary)' }}>{business.tagline}</p>
                )}
              </div>

              {/* Enhanced Info Grid */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-4 py-1">
                   <PageViewCount businessId={business.id} inline />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {business.areaNote && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-neutral-200/50">
                    <MapPin size={12} className="text-neutral-400" /> {business.areaNote}
                  </span>
                )}
                {business.operatingDays && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-neutral-200/50">
                    <Clock size={12} className="text-neutral-400" /> {business.operatingDays.length === 7 ? 'Setiap Hari' : business.operatingDays.join(', ')}
                  </span>
                )}
                {business.deliveryMethods?.map(dm => {
                  const method = DELIVERY_METHODS.find(m => m.value === dm)
                  if (!method) return null
                  return (
                    <span key={dm} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-current shadow-sm" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-light)' }}>
                      <Truck size={12} /> {method.label}
                    </span>
                  )
                })}
              </div>

              {business.description && (
                <p className="text-sm leading-relaxed text-neutral-600 max-w-prose" style={{ color: 'var(--secondary)' }}>{business.description}</p>
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
    <div className="group bg-white rounded-[2rem] border border-neutral-100/80 p-4 flex gap-5 hover:border-neutral-200 hover:shadow-xl hover:shadow-neutral-200/40 transition-all duration-300">
      {product.imageUrl && (
        <button
          type="button"
          onClick={() => onImageClick(product.imageUrl!)}
          className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative cursor-zoom-in shadow-inner ring-1 ring-neutral-100"
        >
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
        </button>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-neutral-900 text-base leading-tight truncate" style={{ color: 'var(--primary)' }}>{product.name}</h3>
            {product.availabilityNote && (
              <span className="shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ color: accentColor, backgroundColor: `${accentColor}1A` }}>
                {product.availabilityNote}
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--secondary)' }}>{product.description}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-black tracking-tight text-neutral-900" style={{ color: 'var(--primary)' }}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAdd({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm"
            style={{ color: 'white', backgroundColor: accentColor }}
          >
            Tambah +
          </button>
        </div>
      </div>
    </div>
  )
}
