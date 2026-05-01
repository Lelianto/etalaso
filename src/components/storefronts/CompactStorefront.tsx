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

export default function CompactStorefront({ business }: StorefrontProps) {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="px-6 py-8 border-b border-slate-100">
        <Link href="/kuliner" className="text-slate-400 mb-6 block"><ArrowLeft size={20} /></Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{business.name}</h1>
            <p className="text-slate-500 text-sm mt-1">{business.tagline || business.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <PageViewCount businessId={business.id} inline />
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
              {isOpen ? 'Buka' : 'Tutup'}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1"><MapPin size={12} /> {business.kecamatan || 'Lokasi'}</div>
          <div className="flex items-center gap-1"><Phone size={12} /> {business.whatsappNumber}</div>
        </div>
      </div>

      {/* Menu List */}
      <div className="max-w-2xl mx-auto pb-32">
        {Array.from(grouped.entries()).map(([sub, items]) => (
          <div key={sub} className="mt-8">
            <h2 className="px-6 text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{sub}</h2>
            <div className="divide-y divide-slate-50">
              {items.map(p => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-800 text-sm">{p.name}</h3>
                    <p className="text-slate-500 text-xs line-clamp-1">{p.description}</p>
                    <span className="text-sm font-medium text-slate-900 block mt-1">{formatPrice(p.price)}</span>
                  </div>
                  {p.imageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                      <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="object-cover h-full" />
                    </div>
                  )}
                  <button 
                    onClick={() => addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Basic Float */}
      {business.whatsappNumber && itemCount === 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-40">
           <a
            href={`https://wa.me/${business.whatsappNumber}`}
            className="w-full bg-slate-900 text-white py-3 rounded-lg text-center font-bold text-sm block"
          >
            Chat Penjual
          </a>
        </div>
      )}
    </div>
  )
}
