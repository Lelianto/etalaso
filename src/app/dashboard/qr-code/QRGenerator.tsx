'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRGeneratorProps {
  baseUrl: string
  businessName: string
}

export default function QRGenerator({ baseUrl, businessName }: QRGeneratorProps) {
  const [tableCount, setTableCount] = useState(5)
  const [qrCodes, setQrCodes] = useState<{ table: number; dataUrl: string }[]>([])
  const [generating, setGenerating] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    const codes: { table: number; dataUrl: string }[] = []
    for (let i = 1; i <= tableCount; i++) {
      const url = `${baseUrl}?table=${i}`
      const dataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 })
      codes.push({ table: i, dataUrl })
    }
    setQrCodes(codes)
    setGenerating(false)
  }

  const handlePrint = () => {
    if (!printRef.current) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Meja - ${businessName}</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; break-inside: avoid; }
          .card img { width: 180px; height: 180px; }
          .card h3 { margin: 8px 0 4px; font-size: 18px; }
          .card p { margin: 0; font-size: 12px; color: #64748b; }
          .title { text-align: center; margin-bottom: 20px; }
          @media print { .grid { grid-template-columns: repeat(3, 1fr); } }
        </style>
      </head>
      <body>
        <div class="title">
          <h1>${businessName}</h1>
          <p>Scan untuk pesan langsung dari meja Anda</p>
        </div>
        <div class="grid">
          ${qrCodes.map(qr => `
            <div class="card">
              <img src="${qr.dataUrl}" alt="QR Meja ${qr.table}" />
              <h3>Meja ${qr.table}</h3>
              <p>Scan untuk pesan</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Generate QR Code Meja</h2>

        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Jumlah Meja
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={tableCount}
              onChange={(e) => setTableCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold px-6 py-3 rounded-xl text-sm"
          >
            {generating ? 'Generating...' : 'Generate QR'}
          </button>
        </div>

        {qrCodes.length > 0 && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handlePrint}
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                Cetak Semua QR
              </button>
            </div>

            <div ref={printRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {qrCodes.map(qr => (
                <div
                  key={qr.table}
                  className="border border-slate-200 rounded-xl p-4 text-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr.dataUrl} alt={`QR Meja ${qr.table}`} className="w-full" />
                  <p className="font-bold text-sm mt-2">Meja {qr.table}</p>
                  <p className="text-[10px] text-slate-400">Scan untuk pesan</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
