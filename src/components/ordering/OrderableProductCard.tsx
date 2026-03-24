'use client'

import { useCart, useCartActions } from '@/lib/ordering/cart'
import { Minus, Plus } from 'lucide-react'
import { ThemeConfig } from '../templates/DesignSystem'

interface OrderableProductCardProps {
  product: {
    id: string
    name: string
    price: string | null
    description?: string | null
    imageUrl?: string | null
  }
  theme: ThemeConfig
  orderingActive: boolean
  children: React.ReactNode
}

export default function OrderableProductCard({
  product,
  theme,
  orderingActive,
  children,
}: OrderableProductCardProps) {
  const { state } = useCart()
  const { addItem, setQuantity } = useCartActions()

  const cartItem = state.items.find(i => i.id === product.id)
  const quantity = cartItem?.quantity ?? 0

  if (!orderingActive) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {children}
      <div
        className="flex items-center justify-center gap-3 py-2 px-3 mt-1"
        style={{ backgroundColor: theme.colors.surface, borderTop: `1px solid ${theme.colors.border}` }}
      >
        {quantity > 0 ? (
          <>
            <button
              onClick={() => setQuantity(product.id, quantity - 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border transition-colors"
              style={{ borderColor: theme.colors.border, color: theme.colors.text }}
              aria-label="Kurangi"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-bold text-sm" style={{ color: theme.colors.text }}>
              {quantity}
            </span>
            <button
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
              style={{ backgroundColor: theme.colors.accent, color: '#fff' }}
              aria-label="Tambah"
            >
              <Plus size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })}
            className="w-full py-1.5 rounded-lg text-xs font-bold transition-colors"
            style={{ backgroundColor: theme.colors.accent + '15', color: theme.colors.accent }}
          >
            + Tambah
          </button>
        )}
      </div>
    </div>
  )
}
