'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  max_products: number
  has_analytics: boolean
  has_subdomain: boolean
}

export default function UpgradeClient({ plans, currentPlanId }: { plans: Plan[]; currentPlanId: string }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showQRIS, setShowQRIS] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedPlan) return

    setUploading(true)
    const supabase = createClient()

    // Upload proof to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { data: upload } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file)

    if (!upload) {
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName)

    const plan = plans.find(p => p.id === selectedPlan)

    // Get current user ID for the payment record
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setUploading(false)
      return
    }

    // Create payment record
    await supabase.from('Payment').insert({
      userId: user.id,
      planId: selectedPlan,
      amount: plan?.price || 0,
      proof_url: publicUrl,
    })

    setUploading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Bukti Pembayaran Terkirim!</h3>
        <p className="text-slate-500 text-sm mb-6">
          Admin kami akan memverifikasi pembayaran Anda dalam 1x24 jam.
          Paket akan aktif setelah disetujui.
        </p>
        <button
          onClick={() => router.push('/dashboard/payments')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Lihat Status Pembayaran
        </button>
      </div>
    )
  }

  if (showQRIS && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
          Pembayaran Paket {plan?.name}
        </h3>
        <p className="text-2xl font-black text-indigo-600 text-center mb-4">
          Rp {plan?.price.toLocaleString('id-ID')}/bulan
        </p>

        <div className="bg-slate-50 rounded-xl p-6 text-center mb-4">
          <p className="text-sm text-slate-500 mb-3">Scan QRIS di bawah untuk membayar:</p>
          {/* Placeholder QRIS — replace with actual QRIS image */}
          <div className="w-48 h-48 bg-slate-200 rounded-xl mx-auto flex items-center justify-center text-slate-400 text-sm">
            QRIS Image
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Pastikan nominal sesuai: <strong>Rp {plan?.price.toLocaleString('id-ID')}</strong>
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-blue-800 text-sm font-semibold mb-2">Langkah pembayaran:</p>
          <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
            <li>Scan QRIS di atas dengan e-wallet atau mobile banking</li>
            <li>Bayar sesuai nominal</li>
            <li>Screenshot bukti pembayaran</li>
            <li>Upload bukti di bawah</li>
          </ol>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Upload Bukti Pembayaran
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {uploading && (
            <p className="text-indigo-600 text-sm mt-2">Mengunggah bukti pembayaran...</p>
          )}
        </div>

        <button
          onClick={() => { setShowQRIS(false); setSelectedPlan(null) }}
          className="w-full mt-4 text-slate-500 text-sm hover:underline"
        >
          Kembali ke pilihan paket
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => {
        const isCurrent = plan.id === currentPlanId
        const isDowngrade = plans.findIndex(p => p.id === plan.id) <= plans.findIndex(p => p.id === currentPlanId)

        return (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl shadow-sm border-2 p-6 relative ${
              isCurrent ? 'border-indigo-500' : 'border-slate-200'
            }`}
          >
            {isCurrent && (
              <span className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Paket Anda
              </span>
            )}

            <h3 className="text-lg font-bold text-slate-800 mt-2">{plan.name}</h3>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {plan.price === 0 ? 'Gratis' : `Rp ${plan.price.toLocaleString('id-ID')}`}
              {plan.price > 0 && <span className="text-sm font-normal text-slate-400">/bulan</span>}
            </p>

            <ul className="mt-4 space-y-2">
              {plan.features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-500 shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (!isCurrent && !isDowngrade) {
                  setSelectedPlan(plan.id)
                  setShowQRIS(true)
                }
              }}
              disabled={isCurrent || (isDowngrade && !isCurrent)}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-sm transition-colors ${
                isCurrent
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : isDowngrade
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isCurrent ? 'Paket Aktif' : isDowngrade ? '-' : 'Upgrade Sekarang'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
