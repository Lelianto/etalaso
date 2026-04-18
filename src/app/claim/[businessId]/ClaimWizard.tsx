'use client'

import { createClient } from '@/lib/supabase/browser'
import { compressImage } from '@/lib/utils/compress-image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { getCategoryConfig } from '@/lib/ordering/category-config'
import PromoCounter from '@/components/ui/PromoCounter'

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

interface Props {
  business: { id: string; name: string; address: string | null; category: string | null }
  userId: string
  plans: Plan[]
}

type Step = 'plan' | 'payment' | 'submitting' | 'done'

/** Build the complete feature list for each plan tier based on category */
function buildPlanFeatures(plan: Plan, category: string) {
  const cat = category.toLowerCase()
  const cfg = getCategoryConfig(cat)
  const isKuliner = cat === 'kuliner' || cat === 'kuliner_rumahan'

  // Base features from the plan itself
  const base = plan.features.map(f => ({ label: f, included: true }))

  // Bonus features for paid plans (UMKM & Business)
  if (plan.id === 'umkm' || plan.id === 'business') {
    base.push(
      { label: cfg.whatsappFeatureLabel, included: true },
      { label: isKuliner ? 'QR code per meja (1–50 meja)' : 'QR code bisnis', included: true },
      { label: isKuliner ? 'Cetak lembaran menu (PDF)' : `Cetak katalog ${cfg.itemLabel.toLowerCase()} (PDF)`, included: true },
      { label: 'Link kustom (etalaso.biz.id/nama-toko)', included: true },
    )
  }

  // Extra features for Business tier
  if (plan.id === 'business') {
    base.push(
      { label: cfg.preOrderLabel, included: true },
      { label: 'Statistik pengunjung', included: true },
      { label: 'Subdomain .etalaso.biz.id', included: true },
    )
  }

  return base
}

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
  const cat = business.category?.toLowerCase() || ''
  const catConfig = getCategoryConfig(cat)

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
    const compressed = await compressImage(file)
    const fileName = `${userId}-${Date.now()}-${compressed.name}`
    const { data: upload, error: uploadErr } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, compressed, { contentType: compressed.type })

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

  const [autoApproved, setAutoApproved] = useState(false)
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)

  const submitClaim = async () => {
    setStep('submitting')
    setError('')

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          planId: selectedPlan,
          proofUrl: isPaid ? proofUrl : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal mengirim klaim. Silakan coba lagi.')
        setStep(isPaid ? 'payment' : 'plan')
        return
      }

      setAutoApproved(data.autoApproved || false)
      setTrialEndsAt(data.trialEndsAt || null)
      setStep('done')
    } catch {
      setError('Gagal mengirim klaim. Silakan coba lagi.')
      setStep(isPaid ? 'payment' : 'plan')
    }
  }

  // ─── Step: Done ───
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">{autoApproved ? '🎉' : '📨'}</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            {autoApproved
              ? 'Selamat! Bisnis Anda Berhasil Diklaim!'
              : `Klaim & ${isPaid ? 'Bukti Pembayaran' : 'Pendaftaran'} Terkirim!`
            }
          </h1>
          {autoApproved ? (
            <>
              <p className="text-slate-500 text-sm mb-2">
                Anda mendapat <strong>trial UMKM 7 hari gratis</strong> — akses semua fitur premium!
              </p>
              {trialEndsAt && (
                <p className="text-indigo-600 text-xs font-semibold mb-4">
                  Trial berakhir: {new Date(trialEndsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-slate-500 text-sm mb-2">
                Admin kami akan meninjau dalam <strong>1x24 jam</strong>.
              </p>
              <p className="text-slate-400 text-xs mb-4">
                Anda akan mendapat notifikasi via email setelah disetujui.
              </p>
            </>
          )}
          <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left text-sm">
            <p className="font-bold text-indigo-800 mb-2">Ringkasan:</p>
            <p className="text-indigo-700">Bisnis: <strong>{business.name}</strong></p>
            <p className="text-indigo-700">Paket: <strong>{autoApproved ? 'UMKM (Trial 7 Hari)' : plan?.name}</strong></p>
            {isPaid && (
              <p className="text-indigo-700">Pembayaran: <strong>Rp {(plan?.discountPrice ?? plan?.price ?? 0).toLocaleString('id-ID')}</strong></p>
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
            <div className="text-center mb-6">
              {plan?.discountPrice !== null && plan?.discountPrice !== undefined && plan.discountPrice > 0 && (
                <p className="text-sm text-slate-400 line-through">Rp {plan.price.toLocaleString('id-ID')}/bulan</p>
              )}
              <p className="text-2xl font-black text-indigo-600">
                Rp {(plan?.discountPrice ?? plan?.price ?? 0).toLocaleString('id-ID')}<span className="text-sm font-normal text-slate-400">/bulan</span>
              </p>
              {plan?.discountPrice !== null && plan?.discountPrice !== undefined && plan.discountPrice > 0 && (
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                  Hemat {Math.round(((plan.price - plan.discountPrice) / plan.price) * 100)}%
                </span>
              )}
            </div>

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
                Pastikan nominal sesuai: <strong className="text-slate-600">Rp {(plan?.discountPrice ?? plan?.price ?? 0).toLocaleString('id-ID')}</strong>
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

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          {/* Header */}
          <div className="text-center mb-5">
            <span className="text-3xl">{catConfig.messageEmoji}</span>
            <h1 className="text-xl font-bold text-slate-800 mt-2">Klaim Bisnis Anda</h1>
            <p className="text-slate-500 text-sm mt-1">Pilih paket yang sesuai kebutuhan Anda</p>
          </div>

          {/* Business info */}
          <div className="bg-slate-50 rounded-xl p-4 mb-5">
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

          {/* Promo counter */}
          <div className="mb-5">
            <PromoCounter variant="inline" />
          </div>

          {/* Plan cards */}
          <div className="space-y-3 mb-5">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id
              const features = buildPlanFeatures(p, cat)
              const isBest = p.id === 'umkm'

              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlan(p.id)}
                  className={`relative w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Popular badge */}
                  {isBest && (
                    <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                      POPULER
                    </span>
                  )}

                  {/* Plan header: name + price + radio */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800">{p.name}</h3>
                      {p.price === 0 ? (
                        <p className="text-lg font-black text-slate-900">Gratis</p>
                      ) : (
                        <div>
                          {p.discountPrice !== null && p.discountPrice > 0 && (
                            <span className="text-xs text-slate-400 line-through mr-1.5">Rp {p.price.toLocaleString('id-ID')}</span>
                          )}
                          <span className="text-lg font-black text-slate-900">
                            Rp {(p.discountPrice ?? p.price).toLocaleString('id-ID')}
                          </span>
                          <span className="text-xs text-slate-400"> /bulan</span>
                          {p.discountPrice !== null && p.discountPrice > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                              -{Math.round(((p.price - p.discountPrice) / p.price) * 100)}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-3" />

                  {/* Feature list */}
                  <ul className="space-y-1.5">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <svg className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f.label}
                      </li>
                    ))}
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

          {!isPaid && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-4">
              <p className="text-green-800 text-xs text-center font-medium">
                Klaim gratis langsung disetujui + <strong>trial UMKM 7 hari</strong> (edit profil, template, QR code, analytics)
              </p>
            </div>
          )}

          <p className="text-xs text-slate-400 text-center mt-3">
            {isPaid
              ? 'Anda akan diminta upload bukti pembayaran QRIS di langkah selanjutnya'
              : 'Langsung aktif tanpa menunggu review admin'}
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
