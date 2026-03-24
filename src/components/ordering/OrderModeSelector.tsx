'use client'

import { useCart, useCartActions, OrderMode } from '@/lib/ordering/cart'

interface OrderModeSelectorProps {
  accentColor: string
}

export default function OrderModeSelector({ accentColor }: OrderModeSelectorProps) {
  const { state } = useCart()
  const { setOrderMode } = useCartActions()

  const modes: { value: OrderMode; label: string; icon: string }[] = [
    { value: 'dine-in', label: 'Makan di Sini', icon: '🍽️' },
    { value: 'pre-order', label: 'Pesan untuk Nanti', icon: '📦' },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-[55] bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-2.5 flex gap-2 justify-center">
      {modes.map(mode => {
        const isActive = state.orderMode === mode.value
        return (
          <button
            key={mode.value}
            onClick={() => setOrderMode(mode.value)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: isActive ? accentColor : 'transparent',
              color: isActive ? '#fff' : '#64748b',
              border: isActive ? 'none' : '1px solid #e2e8f0',
            }}
          >
            {mode.icon} {mode.label}
          </button>
        )
      })}
    </div>
  )
}
