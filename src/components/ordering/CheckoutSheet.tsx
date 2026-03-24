'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { useCart, useCartActions } from '@/lib/ordering/cart'
import { generateDineInMessage, generatePreOrderMessage, openWhatsApp } from '@/lib/ordering/whatsapp'
import { isWithinOperatingHours } from '@/lib/ordering/time-validation'
import { createClient } from '@/lib/supabase/browser'
import Image from 'next/image'

interface CheckoutSheetProps {
  isOpen: boolean
  onClose: () => void
  business: {
    name: string
    whatsappNumber: string | null
    openingHours: string | null
    bankName?: string | null
    bankAccountNumber?: string | null
    bankAccountName?: string | null
    qrisImageUrl?: string | null
  }
  businessId: string
  accentColor: string
}

export default function CheckoutSheet({
  isOpen,
  onClose,
  business,
  businessId,
  accentColor,
}: CheckoutSheetProps) {
  const { state, totalFormatted } = useCart()
  const { setCustomerName, setArrivalTime, setProofUrl, clearCart } = useCartActions()
  const [uploading, setUploading] = useState(false)
  const [timeWarning, setTimeWarning] = useState<string | undefined>()

  const isDineIn = state.orderMode === 'dine-in'
  const hasPaymentInfo = business.bankName || business.qrisImageUrl

  const handleTimeChange = (time: string) => {
    setArrivalTime(time)
    const result = isWithinOperatingHours(business.openingHours, time)
    setTimeWarning(result.warning)
  }

  const handleUploadProof = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createClient()
      const fileName = `${businessId}/${Date.now()}-${file.name}`
      const { data: upload } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file)

      if (upload) {
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName)
        setProofUrl(publicUrl)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleSend = () => {
    if (!business.whatsappNumber) return

    const cartItems = state.items.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }))

    let message: string
    if (isDineIn) {
      message = generateDineInMessage(business.name, state.tableNumber, cartItems)
    } else {
      message = generatePreOrderMessage(
        business.name,
        state.customerName,
        state.arrivalTime,
        cartItems,
        state.proofImageUrl
      )
    }

    openWhatsApp(business.whatsappNumber, message)
    clearCart()
    onClose()
  }

  const canSendDineIn = state.tableNumber && state.items.length > 0
  const canSendPreOrder = state.customerName && state.arrivalTime && state.proofImageUrl && state.items.length > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[70]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[71] max-h-[90vh] flex flex-col shadow-2xl"
          >
            {/* Handle */}
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">
                {isDineIn ? '🍽️ Pesan Meja' : '📦 Pre-Order'}
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {isDineIn ? (
                /* Dine-in flow */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                      Nomor Meja
                    </label>
                    <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-lg text-slate-800">
                      Meja #{state.tableNumber || '?'}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
                      Ringkasan Pesanan
                    </label>
                    <div className="space-y-2">
                      {state.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-semibold">{item.price || '-'}</span>
                        </div>
                      ))}
                      <div className="border-t border-slate-100 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{totalFormatted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pre-order flow */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                      Nama Anda
                    </label>
                    <input
                      value={state.customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Masukkan nama"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                      Waktu Pengambilan
                    </label>
                    <input
                      type="time"
                      value={state.arrivalTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {timeWarning && (
                      <div className="flex items-start gap-2 mt-2 text-amber-600 text-xs">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>{timeWarning}</span>
                      </div>
                    )}
                  </div>

                  {/* Payment info */}
                  {hasPaymentInfo && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase">Info Pembayaran</h4>
                      {business.bankName && (
                        <div className="text-sm">
                          <p className="font-semibold">{business.bankName}</p>
                          <p className="text-slate-600">{business.bankAccountNumber}</p>
                          <p className="text-slate-500">a.n. {business.bankAccountName}</p>
                        </div>
                      )}
                      {business.qrisImageUrl && (
                        <div>
                          <p className="text-xs text-slate-500 mb-2">atau scan QRIS:</p>
                          <Image
                            src={business.qrisImageUrl}
                            alt="QRIS"
                            width={200}
                            height={200}
                            className="rounded-lg mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order summary */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
                      Ringkasan Pesanan
                    </label>
                    <div className="space-y-2">
                      {state.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-semibold">{item.price || '-'}</span>
                        </div>
                      ))}
                      <div className="border-t border-slate-100 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{totalFormatted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload proof */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                      Bukti Transfer
                    </label>
                    {state.proofImageUrl ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                        <CheckCircle size={20} className="text-green-600" />
                        <span className="text-sm text-green-700 font-semibold">Bukti berhasil diunggah</span>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-indigo-400 transition-colors">
                        <Upload size={24} className="text-slate-400" />
                        <span className="text-sm text-slate-500">
                          {uploading ? 'Mengunggah...' : 'Tap untuk upload bukti transfer'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (f) handleUploadProof(f)
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Send button */}
            <div className="border-t border-slate-100 px-5 py-4">
              <button
                onClick={handleSend}
                disabled={isDineIn ? !canSendDineIn : !canSendPreOrder}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm disabled:opacity-40 transition-opacity"
                style={{ backgroundColor: accentColor }}
              >
                Kirim via WhatsApp
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
