'use client'

import { useState } from 'react'
import Link from 'next/link'

const COLORS = {
  amber: '#c8691b',
  charcoal: '#2a2a2a',
  cream: '#faf7f2',
  warmGray: '#6b5e54',
  lightBorder: '#e8e0d6',
}

interface Product {
  id: string
  name: string
  price: number | null
  imageUrl: string | null
}

interface MenuPDFConfig {
  showWhatsApp: boolean
  showOrderText: boolean
  showPrices: boolean
}

// ─── PDF icon SVG shared across states ───
const PdfIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
)

// ═══════════════════════════════════════════════
// LOCKED STATE — shown when tier is free
// ═══════════════════════════════════════════════
function LockedMenuPDF() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-4">
      <div className="flex items-start gap-4">
        {/* Blurred preview thumbnail */}
        <div className="shrink-0 w-20 h-28 rounded-lg overflow-hidden relative" style={{ background: COLORS.cream }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 blur-[2px] select-none pointer-events-none">
            <div className="w-full h-1 rounded-full mb-2" style={{ background: COLORS.amber }} />
            <div className="text-[6px] font-bold text-center" style={{ color: COLORS.charcoal }}>Warung ABC</div>
            <div className="w-6 h-[0.5px] my-1" style={{ background: COLORS.amber }} />
            <div className="w-full space-y-0.5 mt-1">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="flex items-center gap-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS.amber }} />
                  <div className="flex-1 h-1.5 rounded bg-slate-200" />
                </div>
              ))}
            </div>
            <div className="text-[4px] mt-auto" style={{ color: COLORS.warmGray }}>Powered by Etalaso</div>
          </div>
          {/* Lock overlay */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-sm">Cetak Lembaran Menu (PDF)</h3>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full shrink-0">
              UMKM
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Download menu siap cetak dengan desain Etalaso. Cocok untuk ditempel di meja, dinding, atau etalase toko Anda.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Upgrade ke UMKM
          </Link>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// UNLOCKED STATE — shown when tier is umkm/business
// ═══════════════════════════════════════════════
export default function MenuPDFDownload({ businessName, whatsappNumber, products, planId }: {
  businessName: string
  whatsappNumber: string | null
  products: Product[]
  planId: string
}) {
  const isFree = planId === 'free'

  // If free tier, show locked CTA
  if (isFree) return <LockedMenuPDF />

  // If no products, show nothing
  if (products.length === 0) return null

  return <MenuPDFButton businessName={businessName} whatsappNumber={whatsappNumber} products={products} />
}

function MenuPDFButton({ businessName, whatsappNumber, products }: {
  businessName: string
  whatsappNumber: string | null
  products: Product[]
}) {
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [config, setConfig] = useState<MenuPDFConfig>({
    showWhatsApp: false,
    showOrderText: false,
    showPrices: true,
  })

  const handleDownload = async () => {
    setGenerating(true)
    setError('')

    try {
      const res = await fetch('/api/menu-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Gagal membuat PDF')
        setGenerating(false)
        return
      }

      // Download the PDF blob
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName = businessName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 30)
      a.download = `Menu_${safeName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setOpen(false)
    } catch {
      setError('Gagal membuat PDF. Coba lagi.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
      >
        <PdfIcon />
        Cetak Menu PDF
      </button>

      {/* Config Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => !generating && setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Cetak Lembaran Menu</h3>
            <p className="text-slate-500 text-xs mb-5">Atur apa yang ditampilkan di lembaran menu cetak Anda</p>

            <div className="space-y-3">
              {/* Live preview card */}
              <div className="rounded-xl border border-amber-200 p-4" style={{ background: COLORS.cream }}>
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ fontFamily: 'serif', color: COLORS.charcoal }}>{businessName}</p>
                  <div className="flex items-center justify-center gap-2 my-2">
                    <div className="w-8 h-[1px]" style={{ background: COLORS.amber }} />
                    <div className="w-1.5 h-1.5 rotate-45" style={{ background: COLORS.amber }} />
                    <div className="w-8 h-[1px]" style={{ background: COLORS.amber }} />
                  </div>
                  {config.showWhatsApp && whatsappNumber && (
                    <p className="text-[10px]" style={{ color: COLORS.warmGray }}>WhatsApp: {whatsappNumber}</p>
                  )}
                  {config.showOrderText && (
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-white text-[9px] font-bold" style={{ background: COLORS.amber }}>
                      MENERIMA PESANAN
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-[0.5px]" style={{ background: COLORS.lightBorder }} />
                  <span className="text-[8px] font-bold tracking-[3px]" style={{ fontFamily: 'serif', color: COLORS.amber }}>MENU</span>
                  <div className="flex-1 h-[0.5px]" style={{ background: COLORS.lightBorder }} />
                </div>

                <div className="grid grid-cols-2 gap-1">
                  {products.slice(0, 4).map((p, i) => (
                    <div key={p.id} className="bg-white rounded px-1.5 py-1 flex items-center gap-1 border" style={{ borderColor: COLORS.lightBorder }}>
                      <span className="w-3.5 h-3.5 rounded-full text-white text-[7px] flex items-center justify-center font-bold shrink-0" style={{ background: COLORS.amber }}>
                        {i + 1}
                      </span>
                      <span className="text-[8px] font-semibold truncate" style={{ color: COLORS.charcoal }}>
                        {p.name}
                      </span>
                      {config.showPrices && p.price != null && (
                        <>
                          <span className="flex-1 border-b border-dotted" style={{ borderColor: COLORS.lightBorder, minWidth: 4 }} />
                          <span className="text-[7px] font-bold shrink-0" style={{ color: COLORS.amber }}>
                            {p.price.toLocaleString('id-ID')}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {products.length > 4 && (
                  <p className="text-center text-[8px] mt-1" style={{ color: COLORS.warmGray }}>+{products.length - 4} item lainnya</p>
                )}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-[7px]" style={{ color: COLORS.warmGray }}>Supported & Powered by</span>
                  <span className="text-[7px] font-bold" style={{ color: COLORS.amber }}>Etalaso</span>
                  <span className="w-1 h-1 rounded-full" style={{ background: COLORS.amber }} />
                </div>
              </div>

              {/* Toggle options */}
              <div className="space-y-2">
                <ToggleOption
                  label="Tampilkan nomor WhatsApp"
                  description={whatsappNumber || 'Belum ada nomor WA'}
                  checked={config.showWhatsApp}
                  disabled={!whatsappNumber}
                  onChange={(v) => setConfig({ ...config, showWhatsApp: v })}
                />
                <ToggleOption
                  label='Tampilkan "Menerima Pesanan"'
                  description="Badge di bawah nama bisnis"
                  checked={config.showOrderText}
                  onChange={(v) => setConfig({ ...config, showOrderText: v })}
                />
                <ToggleOption
                  label="Tampilkan harga"
                  description="Harga di samping nama menu"
                  checked={config.showPrices}
                  onChange={(v) => setConfig({ ...config, showPrices: v })}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3 mt-3">{error}</div>
            )}

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleDownload}
                disabled={generating}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Membuat PDF...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                disabled={generating}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ToggleOption({ label, description, checked, disabled, onChange }: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
      disabled ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50' :
      checked ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
    }`}>
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <div className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
      </div>
    </label>
  )
}
