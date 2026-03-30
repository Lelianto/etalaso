'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Plan {
  id: string
  name: string
  price: number
  discountPrice: number | null
  features: string[]
}

export default function PricingEditor({ plans }: { plans: Plan[] }) {
  const router = useRouter()
  const [items, setItems] = useState(
    plans.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      discountPrice: p.discountPrice,
      features: p.features,
      hasDiscount: p.discountPrice !== null && p.discountPrice > 0,
    }))
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const updateItem = (id: string, field: string, value: number | boolean | null) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      if (field === 'hasDiscount') {
        return { ...item, hasDiscount: value as boolean, discountPrice: value ? item.discountPrice || 0 : null }
      }
      return { ...item, [field]: value }
    }))
    setMessage(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const payload = items.map(item => ({
      id: item.id,
      price: item.price,
      discountPrice: item.hasDiscount ? item.discountPrice : null,
    }))

    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans: payload }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan' })
      } else {
        setMessage({ type: 'success', text: 'Harga berhasil diperbarui!' })
        router.refresh()
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan' })
    } finally {
      setSaving(false)
    }
  }

  const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

  return (
    <div className="space-y-4">
      {items.map(item => {
        const isFree = item.id === 'free'
        const discount = item.hasDiscount && item.discountPrice !== null && item.price > 0
          ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
          : 0

        return (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-xs font-mono rounded-full">{item.id}</span>
              </div>
              {!isFree && item.hasDiscount && discount > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                  Diskon {discount}%
                </span>
              )}
            </div>

            {/* Features preview */}
            <div className="flex flex-wrap gap-1.5">
              {(item.features as string[]).map((f, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[11px] rounded-full border border-slate-100">
                  {f}
                </span>
              ))}
            </div>

            {isFree ? (
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-sm text-slate-500">Paket gratis — harga tidak dapat diubah.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Normal price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Harga Normal (/bulan)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={item.price}
                      onChange={e => updateItem(item.id, 'price', parseInt(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{formatRupiah(item.price)}/bulan</p>
                </div>

                {/* Discount toggle + price */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-500">
                      Harga Diskon (/bulan)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <span className="text-[11px] text-slate-400">{item.hasDiscount ? 'Aktif' : 'Nonaktif'}</span>
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, 'hasDiscount', !item.hasDiscount)}
                        className={`relative w-9 h-5 rounded-full transition-colors ${item.hasDiscount ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.hasDiscount ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                    </label>
                  </div>
                  {item.hasDiscount ? (
                    <>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          value={item.discountPrice ?? 0}
                          onChange={e => updateItem(item.id, 'discountPrice', parseInt(e.target.value) || 0)}
                          className="w-full pl-10 pr-4 py-2.5 border border-red-200 rounded-xl text-sm font-semibold text-red-700 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <p className="text-[11px] text-red-500 mt-1">
                        {formatRupiah(item.discountPrice ?? 0)}/bulan
                        {discount > 0 && <span className="font-bold"> (hemat {discount}%)</span>}
                      </p>
                    </>
                  ) : (
                    <div className="bg-slate-50 rounded-xl px-4 py-2.5">
                      <p className="text-xs text-slate-400">Aktifkan untuk mengatur harga diskon.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price preview */}
            {!isFree && (
              <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-700">Harga yang tampil ke user:</span>
                <div className="text-right">
                  {item.hasDiscount && item.discountPrice !== null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 line-through">{formatRupiah(item.price)}</span>
                      <span className="text-sm font-bold text-indigo-700">{formatRupiah(item.discountPrice)}/bulan</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-indigo-700">{formatRupiah(item.price)}/bulan</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Save bar */}
      <div className="sticky bottom-4 bg-white rounded-2xl border border-slate-200 shadow-lg p-4 flex items-center justify-between gap-4">
        {message ? (
          <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        ) : (
          <p className="text-sm text-slate-400">Perubahan belum disimpan.</p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0"
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  )
}
