'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart, useCartActions } from '@/lib/ordering/cart'
import Image from 'next/image'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
  accentColor: string
}

export default function CartDrawer({ isOpen, onClose, onCheckout, accentColor }: CartDrawerProps) {
  const { state, itemCount, totalFormatted } = useCart()
  const { setQuantity, removeItem } = useCartActions()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60]"
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[61] max-h-[80vh] flex flex-col shadow-2xl"
          >
            {/* Handle */}
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">
                Keranjang ({itemCount})
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {state.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                      Img
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.price || '-'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor, color: '#fff' }}
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 ml-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Total</span>
                <span className="font-bold text-lg text-slate-800">{totalFormatted}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
                style={{ backgroundColor: accentColor }}
              >
                Lanjut Pesan
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
