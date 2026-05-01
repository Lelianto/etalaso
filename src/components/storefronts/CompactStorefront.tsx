'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, ArrowLeft, Plus } from 'lucide-react'
import PageViewCount from '@/components/ui/PageViewCount'
import { useCart, useCartActions } from '@/lib/ordering/cart'
import { KULINER_SUBCATEGORIES, OPERATING_DAYS } from '@/lib/kuliner/constants'
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

export default function CompactStorefront({ business, theme }: StorefrontProps) {
  const { addItem } = useCartActions()
  const { itemCount } = useCart()
  const isOpen = getTodayOpen(business.operatingDays)
  const products = business.products || []

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
    <div className="min-h-screen" style={{ ...cssVars, fontFamily: 'var(--font-body)', backgroundColor: 'var(--bg)' }}>
      {/* App Header */}
      <div className="px-6 pt-12 pb-8 border-b border-neutral-50 bg-white/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-2xl mx-auto">
          <Link href="/kuliner" className="w-10 h-10 flex items-center justify-center bg-neutral-100 rounded-full text-neutral-400 mb-8 hover:bg-neutral-900 hover:text-white transition-all">
            <ArrowLeft size={18} />
          </Link>
          
          <div className="flex justify-between items-end gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tighter text-neutral-900" style={{ fontFamily: 'var(--font-display)' }}>
                {business.name}
              </h1>
              <p className="text-neutral-400 text-sm font-medium tracking-tight line-clamp-1">{business.tagline || business.description}</p>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <PageViewCount businessId={business.id} inline />
              <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-slate-300'} ring-4 ring-white shadow-sm`} />
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap items-center gap-4 py-3 border-t border-neutral-50">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
               <MapPin size={12} style={{ color: 'var(--accent)' }} /> 
               <span>{business.kecamatan || 'Our Location'}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
               <Phone size={12} style={{ color: 'var(--accent)' }} /> 
               <span>Direct Contact</span>
            </div>
          </div>
        </div>
      </div>

      {/* App-Style List */}
      <div className="max-w-2xl mx-auto pb-40">
        {Array.from(grouped.entries()).map(([sub, items]) => (
          <div key={sub} className="mt-12 group">
            <div className="px-6 mb-4 flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-300 group-hover:text-neutral-900 transition-colors">
                {getSubcategoryLabel(sub)}
              </h2>
              <div className="h-[1px] flex-grow ml-4 bg-neutral-50" />
            </div>
            
            <div className="space-y-1 px-4">
              {items.map(p => (
                <div key={p.id} className="group/item bg-white/40 hover:bg-white rounded-3xl p-4 flex items-center justify-between gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-100 ring-1 ring-transparent hover:ring-neutral-100">
                  <div className="flex-grow space-y-1">
                    <h3 className="font-bold text-neutral-900 text-sm tracking-tight group-hover/item:text-black transition-colors" style={{ color: 'var(--primary)' }}>{p.name}</h3>
                    {p.description && (
                      <p className="text-neutral-400 text-xs font-medium line-clamp-1 group-hover/item:text-neutral-500 transition-colors">{p.description}</p>
                    )}
                    <span className="text-sm font-black tracking-tight block pt-1" style={{ color: 'var(--primary)' }}>{formatPrice(p.price)}</span>
                  </div>
                  
                  {p.imageUrl && (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-50 shrink-0 ring-1 ring-neutral-100 shadow-sm group-hover/item:scale-105 transition-transform duration-500">
                      <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="object-cover h-full" />
                    </div>
                  )}
                  
                  <button 
                    onClick={() => addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                    className="w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-90 hover:shadow-lg"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'transparent' }}
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* App Bottom-Bar Style CTA */}
      {business.whatsappNumber && itemCount === 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-2xl border-t border-neutral-50 z-40">
           <div className="max-w-2xl mx-auto">
             <a
              href={`https://wa.me/${business.whatsappNumber}`}
              className="w-full text-white py-4.5 rounded-2xl text-center font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Start Order
            </a>
           </div>
        </div>
      )}
    </div>
  )
}
