'use client'

import { useState } from 'react'

export default function ReportButton({ businessId }: { businessId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) return
    setSending(true)
    await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, reason: reason.trim() }),
    }).catch(() => {})
    setSending(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <button
        className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm shadow-lg"
        title="Laporan terkirim"
      >
        ✓
      </button>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur text-slate-500 flex items-center justify-center text-sm shadow-lg hover:bg-white transition-colors"
        title="Laporkan halaman ini"
      >
        ⚑
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-3 w-64">
      <p className="text-xs font-semibold text-slate-700 mb-2">Laporkan halaman ini</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Alasan laporan..."
        className="w-full text-xs border border-slate-200 rounded-lg p-2 h-16 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSubmit}
          disabled={!reason.trim() || sending}
          className="flex-1 bg-red-600 text-white text-xs font-bold py-1.5 rounded-lg disabled:opacity-50"
        >
          {sending ? '...' : 'Kirim'}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-1.5 rounded-lg"
        >
          Batal
        </button>
      </div>
    </div>
  )
}
