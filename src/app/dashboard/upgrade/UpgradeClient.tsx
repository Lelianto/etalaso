'use client'

import { createClient } from '@/lib/supabase/browser'
import { compressImage } from '@/lib/utils/compress-image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Plan {
  id: string
  name: string
  price: number
  discountPrice: number | null
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
  const [error, setError] = useState('')
  const router = useRouter()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedPlan) return

    setUploading(true)
    const supabase = createClient()

    // Compress & upload proof to Supabase Storage
    const compressed = await compressImage(file)
    const fileName = `${Date.now()}-${compressed.name}`
    const { data: upload } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, compressed, { contentType: compressed.type })

    if (!upload) {
      setUploading(false)
      setError('Gagal mengunggah bukti pembayaran. Silakan coba lagi.')
      return
    }
    setError('')

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
    const { error: paymentError } = await supabase.from('Payment').insert({
      userId: user.id,
      planId: selectedPlan,
      amount: plan?.discountPrice ?? plan?.price ?? 0,
      proof_url: publicUrl,
    })

    setUploading(false)
    if (paymentError) {
      setError('Gagal mengirim bukti pembayaran. Silakan coba lagi.')
      return
    }
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
    const effectivePrice = plan?.discountPrice ?? plan?.price ?? 0
    const hasDiscount = plan?.discountPrice !== null && plan?.discountPrice !== undefined && plan.discountPrice > 0
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
          Pembayaran Paket {plan?.name}
        </h3>
        <div className="text-center mb-4">
          {hasDiscount && (
            <p className="text-sm text-slate-400 line-through">Rp {plan?.price.toLocaleString('id-ID')}/bulan</p>
          )}
          <p className="text-2xl font-black text-indigo-600">
            Rp {effectivePrice.toLocaleString('id-ID')}/bulan
          </p>
          {hasDiscount && (
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              Hemat {Math.round(((plan!.price - effectivePrice) / plan!.price) * 100)}%
            </span>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-6 text-center mb-4">
          <p className="text-sm text-slate-500 mb-3">Scan QRIS di bawah untuk membayar:</p>
          <img
            src="/qris.jpeg"
            alt="QRIS Promptwear Studio"
            className="w-64 mx-auto rounded-xl"
          />
          <p className="text-xs text-slate-400 mt-3">
            Pastikan nominal sesuai: <strong>Rp {effectivePrice.toLocaleString('id-ID')}</strong>
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

        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <p className="text-green-800 text-sm font-semibold mb-2">Konfirmasi lebih cepat?</p>
          <p className="text-green-700 text-sm mb-3">
            Hubungi admin via WhatsApp untuk konfirmasi pembayaran lebih cepat
            atau diskusi jika Anda menginginkan custom website.
          </p>
          <a
            href="https://wa.me/6281578777654?text=Halo%20admin%2C%20saya%20ingin%20konfirmasi%20pembayaran%20upgrade%20paket%20Etalase."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat Admin WhatsApp
          </a>
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
          {error && (
            <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
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
            {plan.price === 0 ? (
              <p className="text-3xl font-black text-slate-900 mt-1">Gratis</p>
            ) : (
              <div className="mt-1">
                {plan.discountPrice !== null && plan.discountPrice > 0 && (
                  <p className="text-sm text-slate-400 line-through">Rp {plan.price.toLocaleString('id-ID')}</p>
                )}
                <p className="text-3xl font-black text-slate-900">
                  Rp {(plan.discountPrice ?? plan.price).toLocaleString('id-ID')}
                  <span className="text-sm font-normal text-slate-400">/bulan</span>
                </p>
                {plan.discountPrice !== null && plan.discountPrice > 0 && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[11px] font-bold rounded-full">
                    Hemat {Math.round(((plan.price - plan.discountPrice) / plan.price) * 100)}%
                  </span>
                )}
              </div>
            )}

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
