'use client'

import Image from 'next/image'
import { MapPin, Clock, Phone, Truck } from 'lucide-react'
import { useCart, useCartActions } from '@/lib/ordering/cart'
import { KULINER_SUBCATEGORIES, DELIVERY_METHODS, OPERATING_DAYS } from '@/lib/kuliner/constants'
import type { BusinessData } from '@/components/templates/types'

interface KulinerStorePageProps {
  store: BusinessData & {
    id: string
    kecamatan?: string | null
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

function getSubcategoryIcon(value: string): string {
  return KULINER_SUBCATEGORIES.find(s => s.value === value)?.icon || '🍽️'
}

export default function KulinerStorePage({ store }: KulinerStorePageProps) {
  const { addItem } = useCartActions()
  const { itemCount } = useCart()
  const isOpen = getTodayOpen(store.operatingDays)
  const products = store.products || []

  // Group products by subcategory
  const grouped = new Map<string, typeof products>()
  for (const p of products) {
    const key = p.subcategory || 'lainnya'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(p)
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-5">
          {/* Store image */}
          {store.imageUrl && (
            <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 relative">
              <Image
                src={store.imageUrl}
                alt={store.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-[family-name:var(--font-display)] text-2xl text-charcoal truncate">
                {store.name}
              </h1>
              {store.tagline && (
                <p className="text-neutral-500 text-sm mt-0.5">{store.tagline}</p>
              )}
            </div>
            <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
              isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isOpen ? 'Buka' : 'Tutup'}
            </div>
          </div>

          {/* Info pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {store.areaNote && (
              <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-full">
                <MapPin size={12} /> {store.areaNote}
              </span>
            )}
            {!store.areaNote && store.kecamatan && (
              <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-full">
                <MapPin size={12} /> {store.kecamatan} & sekitar
              </span>
            )}
            {store.operatingDays && store.operatingDays.length > 0 && store.operatingDays.length < 7 && (
              <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-full">
                <Clock size={12} /> {store.operatingDays.join(', ')}
              </span>
            )}
            {store.operatingDays && store.operatingDays.length === 7 && (
              <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-full">
                <Clock size={12} /> Setiap hari
              </span>
            )}
          </div>

          {/* Delivery methods */}
          {store.deliveryMethods && store.deliveryMethods.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {store.deliveryMethods.map(dm => {
                const method = DELIVERY_METHODS.find(m => m.value === dm)
                if (!method) return null
                const note = dm === 'gojek_grab' ? ' (dipesan pembeli)' : ''
                return (
                  <span key={dm} className="inline-flex items-center gap-1 text-xs text-amber bg-amber/10 px-2.5 py-1 rounded-full font-medium">
                    <Truck size={12} /> {method.label}{note}
                  </span>
                )
              })}
            </div>
          )}

          {/* Description */}
          {store.description && (
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{store.description}</p>
          )}

          {/* Address */}
          {store.address && (
            <div className="mt-3 flex items-start gap-2 text-xs text-neutral-400">
              <MapPin size={12} className="shrink-0 mt-0.5" />
              <span>{store.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-neutral-500 text-sm">Menu belum tersedia.</p>
            <p className="text-neutral-400 text-xs mt-1">Pemilik sedang menyiapkan katalog makanan.</p>
          </div>
        ) : grouped.size === 1 && grouped.has('lainnya') ? (
          // Single category — no headers
          <div className="space-y-3">
            {products.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addItem} />
            ))}
          </div>
        ) : (
          // Multiple categories
          <div className="space-y-8">
            {Array.from(grouped.entries()).map(([subcategory, items]) => (
              <div key={subcategory}>
                <h2 className="flex items-center gap-2 font-semibold text-charcoal mb-3">
                  <span>{getSubcategoryIcon(subcategory)}</span>
                  {getSubcategoryLabel(subcategory)}
                </h2>
                <div className="space-y-3">
                  {items.map(product => (
                    <ProductCard key={product.id} product={product} onAdd={addItem} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp direct CTA — hidden when cart has items (CartFAB takes over) */}
      {store.whatsappNumber && itemCount === 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 z-40">
          <div className="max-w-2xl mx-auto">
            <a
              href={`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(`Halo, saya lihat ${store.name} di Etalaso. Hari ini buka?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat WhatsApp"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-green-600 transition-colors"
            >
              <Phone size={16} />
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
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-100 p-3 flex gap-3">
      {product.imageUrl && (
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-charcoal text-sm truncate">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{product.description}</p>
        )}
        {product.availabilityNote && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-amber bg-amber/10 px-2 py-0.5 rounded-full">
            {product.availabilityNote}
          </span>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-charcoal">
            {product.price || 'Hubungi'}
          </span>
          <button
            onClick={() => onAdd({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })}
            className="text-xs font-bold text-amber bg-amber/10 px-3 py-1.5 rounded-lg hover:bg-amber/20 transition-colors"
          >
            + Tambah
          </button>
        </div>
      </div>
    </div>
  )
}
