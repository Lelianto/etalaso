'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  business: {
    id: string
    name: string
    description: string | null
    whatsappNumber: string | null
    openingHours: string | null
  }
}

export default function EditProfileForm({ business }: Props) {
  const [form, setForm] = useState({
    description: business.description || '',
    whatsappNumber: business.whatsappNumber || '',
    openingHours: business.openingHours || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('Business')
      .update({
        description: form.description || null,
        whatsappNumber: form.whatsappNumber || null,
        openingHours: form.openingHours || null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', business.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Bisnis</label>
        <input
          value={business.name}
          disabled
          className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 text-slate-500"
        />
        <p className="text-xs text-slate-400 mt-1">Nama bisnis tidak dapat diubah</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Ceritakan tentang bisnis Anda..."
          className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
        <input
          value={form.whatsappNumber}
          onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
          placeholder="628xxxxxxxxxx"
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Jam Operasional</label>
        <input
          value={form.openingHours}
          onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
          placeholder="Senin-Sabtu, 08:00-17:00"
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold px-6 py-3 rounded-xl transition-colors"
      >
        {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Perubahan'}
      </button>
    </div>
  )
}
