'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  max_products: number
  has_analytics: boolean
  has_subdomain: boolean
}

interface Props {
  business: { id: string; name: string; address: string | null; category: string | null }
  userId: string
  plans: Plan[]
}

type Step = 'plan' | 'payment' | 'submitting' | 'done'

export default function ClaimWizard({ business, userId, plans }: Props) {
  const [step, setStep] = useState<Step>('plan')
  const [selectedPlan, setSelectedPlan] = useState<string>('free')
  const [uploading, setUploading] = useState(false)
  const [proofUrl, setProofUrl] = useState<string | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const plan = plans.find(p => p.id === selectedPlan)
  const isPaid = (plan?.price ?? 0) > 0

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleContinue = () => {
    if (isPaid) {
      setStep('payment')
    } else {
      submitClaim()
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (ev) => setProofPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    setError('')

    const supabase = createClient()
    const fileName = `${userId}-${Date.now()}-${file.name}`
    const { data: upload, error: uploadErr } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file)

    if (uploadErr || !upload) {
      setError('Gagal upload bukti. Silakan coba lagi.')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName)

    setProofUrl(publicUrl)
    setUploading(false)
  }

  const submitClaim = async () => {
    setStep('submitting')
    setError('')

    const supabase = createClient()

    // 1. Create claim
    const { error: claimErr } = await supabase.from('Claim').insert({
      businessId: business.id,
      userId,
      message: isPaid ? `Paket: ${plan?.name}` : null,
    })

    if (claimErr) {
      setError('Gagal mengirim klaim. Silakan coba lagi.')
      setStep(isPaid ? 'payment' : 'plan')
      return
    }

    // 2. If paid plan, create payment record
    if (isPaid && proofUrl) {
      const { error: payErr } = await supabase.from('Payment').insert({
        userId,
        planId: selectedPlan,
        amount: plan?.price || 0,
        proof_url: proofUrl,
      })

      if (payErr) {
        // Claim submitted but payment failed — still show success
        console.error('Payment record failed:', payErr.message)
      }
    }

    setStep('done')
  }

  // ─── Step: Done ───
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Klaim & {isPaid ? 'Bukti Pembayaran' : 'Pendaftaran'} Terkirim!
          </h1>
          <p className="text-slate-500 text-sm mb-2">
            Admin kami akan meninjau dalam <strong>1x24 jam</strong>.
          </p>
          <p className="text-slate-400 text-xs mb-6">
            Anda akan mendapat notifikasi via email setelah disetujui.
          </p>
          <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left text-sm">
            <p className="font-bold text-indigo-800 mb-2">Ringkasan:</p>
            <p className="text-indigo-700">Bisnis: <strong>{business.name}</strong></p>
            <p className="text-indigo-700">Paket: <strong>{plan?.name}</strong></p>
            {isPaid && (
              <p className="text-indigo-700">Pembayaran: <strong>Rp {plan?.price.toLocaleString('id-ID')}</strong></p>
            )}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ─── Step: Submitting ───
  if (step === 'submitting') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Mengirim klaim...</p>
        </div>
      </div>
    )
  }

  // ─── Step: Payment (QRIS) ───
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Progress */}
          <StepIndicator current={2} />

          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h2 className="text-lg font-bold text-slate-800 text-center mb-1">
              Pembayaran Paket {plan?.name}
            </h2>
            <p className="text-2xl font-black text-indigo-600 text-center mb-6">
              Rp {plan?.price.toLocaleString('id-ID')}<span className="text-sm font-normal text-slate-400">/bulan</span>
            </p>

            {/* QRIS */}
            <div className="bg-slate-50 rounded-xl p-6 text-center mb-5">
              <p className="text-sm text-slate-500 mb-3">Scan QRIS di bawah untuk membayar:</p>
              <Image
                src="/qris.jpeg"
                alt="QRIS Pembayaran Etalaso"
                width={300}
                height={400}
                className="mx-auto rounded-xl border border-slate-200"
              />
              <p className="text-xs text-slate-400 mt-3">
                Pastikan nominal sesuai: <strong className="text-slate-600">Rp {plan?.price.toLocaleString('id-ID')}</strong>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-4 mb-5">
              <p className="text-blue-800 text-sm font-semibold mb-2">Langkah pembayaran:</p>
              <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                <li>Scan QRIS di atas dengan e-wallet/m-banking</li>
                <li>Bayar sesuai nominal</li>
                <li>Screenshot bukti pembayaran</li>
                <li>Upload bukti di bawah</li>
              </ol>
            </div>

            {/* Upload */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload Bukti Pembayaran
              </label>

              {proofPreview ? (
                <div className="relative mb-3">
                  <Image
                    src={proofPreview}
                    alt="Bukti pembayaran"
                    width={400}
                    height={300}
                    className="w-full h-48 object-contain rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <button
                    onClick={() => { setProofPreview(null); setProofUrl(null) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
                  <span className="text-slate-400 text-sm">Klik untuk upload gambar</span>
                  <span className="text-slate-300 text-xs mt-1">JPG, PNG max 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}

              {uploading && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-indigo-600 text-sm">Mengunggah...</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>
            )}

            <button
              onClick={submitClaim}
              disabled={!proofUrl || uploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Kirim Klaim & Bukti Bayar
            </button>

            <button
              onClick={() => setStep('plan')}
              className="w-full mt-3 text-slate-500 text-sm hover:underline"
            >
              ← Kembali pilih paket
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Step: Plan Selection (default) ───
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <StepIndicator current={1} />

        {/* Business info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🏪</div>
            <h1 className="text-xl font-bold text-slate-800">Klaim Bisnis Anda</h1>
            <p className="text-slate-500 text-sm mt-1">Pilih paket yang sesuai kebutuhan Anda</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="font-bold text-slate-800">{business.name}</p>
            {business.address && (
              <p className="text-slate-500 text-sm mt-0.5">{business.address}</p>
            )}
            {business.category && (
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
                {business.category}
              </span>
            )}
          </div>

          {/* Kuliner-specific features highlight */}
          {business.category?.toLowerCase() === 'kuliner' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🍽️</span>
                <h3 className="font-bold text-amber-900 text-sm">Fitur Khusus Kuliner</h3>
              </div>
              <p className="text-amber-800 text-xs mb-3">
                Bisnis kuliner mendapat akses fitur ordering digital:
              </p>
              <div className="space-y-2.5">
                {/* QR Code Meja */}
                <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">QR Code Meja</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Generate QR code untuk setiap meja. Pelanggan scan &amp; langsung pesan dari HP — tanpa antre.
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">
                      Paket UMKM &amp; Business
                    </span>
                  </div>
                </div>
                {/* Pre-order */}
                <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Sistem Pre-order</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Pelanggan bisa pesan &amp; bayar di muka sebelum datang. Lengkap dengan konfirmasi via WhatsApp.
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
                      Paket Business
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plan cards */}
          <div className="space-y-3 mb-6">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlan(p.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800">{p.name}</h3>
                        {p.id === 'umkm' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                            POPULER
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-black text-slate-900 mt-0.5">
                        {p.price === 0 ? 'Gratis' : `Rp ${p.price.toLocaleString('id-ID')}`}
                        {p.price > 0 && <span className="text-xs font-normal text-slate-400"> /bulan</span>}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1">
                    {p.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                    {/* Kuliner-specific features on plan cards */}
                    {business.category?.toLowerCase() === 'kuliner' && (p.id === 'umkm' || p.id === 'business') && (
                      <li className="flex items-start gap-2 text-xs text-indigo-600 font-medium">
                        <span className="shrink-0 mt-0.5">🍽️</span>
                        QR Code Meja &amp; Dine-in
                      </li>
                    )}
                    {business.category?.toLowerCase() === 'kuliner' && p.id === 'business' && (
                      <li className="flex items-start gap-2 text-xs text-emerald-600 font-medium">
                        <span className="shrink-0 mt-0.5">📦</span>
                        Sistem Pre-order
                      </li>
                    )}
                  </ul>
                </button>
              )
            })}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>
          )}

          <button
            onClick={handleContinue}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            {isPaid ? 'Lanjut ke Pembayaran' : 'Klaim Gratis'}
          </button>

          <p className="text-xs text-slate-400 text-center mt-4">
            {isPaid
              ? 'Anda akan diminta upload bukti pembayaran QRIS di langkah selanjutnya'
              : 'Admin akan meninjau klaim Anda dalam 1x24 jam'}
          </p>
        </div>
      </div>
    </div>
  )
}

/** Step progress indicator */
function StepIndicator({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
        current >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
      }`}>
        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
        Pilih Paket
      </div>
      <div className="w-8 h-0.5 bg-slate-200" />
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
        current >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
      }`}>
        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
        Pembayaran
      </div>
    </div>
  )
}
