'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/ordering/cart'

interface CartFABProps {
  onClick: () => void
  accentColor: string
}

export default function CartFAB({ onClick, accentColor }: CartFABProps) {
  const { itemCount } = useCart()

  if (itemCount === 0) return null

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-xl z-50 hover:scale-110 transition-transform active:scale-95"
      style={{ backgroundColor: accentColor, color: '#fff' }}
      aria-label={`Keranjang (${itemCount} item)`}
    >
      <ShoppingCart size={28} />
      <span
        className="absolute -top-1 -right-1 min-w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1.5"
      >
        {itemCount}
      </span>
    </button>
  )
}
