'use client'

import { createClient } from '@/lib/supabase/browser'
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

          {/* Category-specific features highlight */}
          {(() => {
            const cat = business.category?.toLowerCase() || ''
            const catConfig = getCategoryConfig(cat)
            const isKuliner = cat === 'kuliner'
            return (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{catConfig.messageEmoji}</span>
                  <h3 className="font-bold text-amber-900 text-sm">Fitur Pemesanan via WhatsApp</h3>
                </div>
                <p className="text-amber-800 text-xs mb-3">
                  {catConfig.claimFeatureText}
                </p>
                <div className="space-y-2.5">
                  {/* QR Code */}
                  <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{isKuliner ? 'QR Code Meja' : 'QR Code Bisnis'}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {isKuliner
                          ? 'Generate QR code untuk setiap meja. Pelanggan scan & langsung pesan dari HP — tanpa antre.'
                          : 'QR code untuk kartu nama, brosur, atau stiker. Pelanggan scan & langsung lihat produk/jasa Anda.'}
                      </p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">
                        Paket UMKM &amp; Business
                      </span>
                    </div>
                  </div>
                  {/* WhatsApp ordering */}
                  <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Pemesanan via WhatsApp</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Pelanggan pilih {catConfig.itemLabel.toLowerCase()} langsung dari HP, lalu kirim pesanan via WhatsApp.
                      </p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
                        Paket UMKM &amp; Business
                      </span>
                    </div>
                  </div>
                  {/* Cetak Menu PDF */}
                  <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Cetak Lembaran Menu (PDF)</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Download daftar menu siap cetak dengan desain profesional. Tempel di meja, dinding, atau etalase toko.
                      </p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full">
                        Paket UMKM &amp; Business
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Promo counter */}
          <div className="mb-4">
            <PromoCounter variant="inline" />
          </div>

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
                      {p.price === 0 ? (
                        <p className="text-lg font-black text-slate-900 mt-0.5">Gratis</p>
                      ) : (
                        <div className="mt-0.5">
                          {p.discountPrice !== null && p.discountPrice > 0 && (
                            <p className="text-xs text-slate-400 line-through">Rp {p.price.toLocaleString('id-ID')}</p>
                          )}
                          <p className="text-lg font-black text-slate-900">
                            Rp {(p.discountPrice ?? p.price).toLocaleString('id-ID')}
                            <span className="text-xs font-normal text-slate-400"> /bulan</span>
                          </p>
                          {p.discountPrice !== null && p.discountPrice > 0 && (
                            <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                              Hemat {Math.round(((p.price - p.discountPrice) / p.price) * 100)}%
                            </span>
                          )}
                        </div>
                      )}
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
                    {/* Ordering features on plan cards */}
                    {(p.id === 'umkm' || p.id === 'business') && (
                      <>
                        <li className="flex items-start gap-2 text-xs text-indigo-600 font-medium">
                          <span className="shrink-0 mt-0.5">{getCategoryConfig(business.category?.toLowerCase() || '').messageEmoji}</span>
                          Pemesanan via WhatsApp
                        </li>
                        <li className="flex items-start gap-2 text-xs text-rose-600 font-medium">
                          <span className="shrink-0 mt-0.5">📄</span>
                          Cetak lembaran menu (PDF)
                        </li>
                      </>
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
