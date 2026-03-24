'use client'

import { createClient } from '@/lib/supabase/browser'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const BANK_OPTIONS = [
  'BCA', 'BNI', 'BRI', 'Mandiri', 'BSI', 'CIMB Niaga', 'Danamon',
  'Permata', 'OCBC NISP', 'BTN', 'Mega', 'Jago', 'Sea Bank', 'Lainnya',
]

interface PaymentConfigFormProps {
  businessId: string
  initial: {
    bankName: string | null
    bankAccountNumber: string | null
    bankAccountName: string | null
    qrisImageUrl: string | null
  }
}

export default function PaymentConfigForm({ businessId, initial }: PaymentConfigFormProps) {
  const [bankName, setBankName] = useState(initial.bankName || '')
  const [bankAccountNumber, setBankAccountNumber] = useState(initial.bankAccountNumber || '')
  const [bankAccountName, setBankAccountName] = useState(initial.bankAccountName || '')
  const [qrisImageUrl, setQrisImageUrl] = useState(initial.qrisImageUrl || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleQrisUpload = async (file: File) => {
    setUploading(true)
    const supabase = createClient()
    const fileName = `qris/${businessId}/${Date.now()}-${file.name}`
    const { data: upload } = await supabase.storage
      .from('product-images')
      .upload(fileName, file)

    if (upload) {
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      setQrisImageUrl(publicUrl)
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    const supabase = createClient()
    await supabase
      .from('Business')
      .update({
        bankName: bankName || null,
        bankAccountNumber: bankAccountNumber || null,
        bankAccountName: bankAccountName || null,
        qrisImageUrl: qrisImageUrl || null,
      })
      .eq('id', businessId)

    setSaving(false)
    setSuccess(true)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Transfer Bank</h2>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Nama Bank</label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Pilih Bank</option>
            {BANK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Nomor Rekening</label>
          <input
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="1234567890"
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Nama Pemilik Rekening</label>
          <input
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            placeholder="Nama sesuai rekening"
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800 mb-2">QRIS</h2>
        {qrisImageUrl ? (
          <div className="space-y-3">
            <Image src={qrisImageUrl} alt="QRIS" width={200} height={200} className="rounded-lg mx-auto" />
            <button
              onClick={() => setQrisImageUrl('')}
              className="text-xs text-red-500 hover:underline block mx-auto"
            >
              Hapus gambar QRIS
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-2 p-8 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-indigo-400 transition-colors">
            <span className="text-sm text-slate-500">
              {uploading ? 'Mengunggah...' : 'Upload gambar QRIS'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleQrisUpload(f)
              }}
            />
          </label>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl text-sm"
      >
        {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
      </button>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-green-700 text-sm font-semibold">Konfigurasi berhasil disimpan!</p>
        </div>
      )}
    </div>
  )
}
