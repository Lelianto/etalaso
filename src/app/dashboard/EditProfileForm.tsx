'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { checkProfanity } from '@/lib/moderation'
import { DELIVERY_METHODS, OPERATING_DAYS } from '@/lib/kuliner/constants'

interface Props {
  business: {
    id: string
    name: string
    description: string | null
    whatsappNumber: string | null
    openingHours: string | null
    tagline?: string | null
    areaNote?: string | null
    deliveryMethods?: string[]
    operatingDays?: string[]
    businessType?: string | null
    category?: string | null
  }
}

export default function EditProfileForm({ business }: Props) {
  const isKulinerRumahan = business.businessType === 'kuliner_rumahan' || business.category === 'kuliner_rumahan'
  const [form, setForm] = useState({
    description: business.description || '',
    whatsappNumber: business.whatsappNumber || '',
    openingHours: business.openingHours || '',
    tagline: business.tagline || '',
    areaNote: business.areaNote || '',
    deliveryMethods: business.deliveryMethods || [],
    operatingDays: business.operatingDays || [],
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSave = async () => {
    // Check for profanity in editable fields
    const textToCheck = `${form.description} ${form.openingHours} ${form.tagline} ${form.areaNote}`
    const badWord = checkProfanity(textToCheck)
    if (badWord) {
      setError('Konten mengandung kata yang tidak diperbolehkan. Silakan ubah dan coba lagi.')
      return
    }
    setError('')
    setSaving(true)
    const supabase = createClient()
    // Normalize WA: 08xx → 628xx, +628xx → 628xx
    let normalizedWa = (form.whatsappNumber || '').replace(/[\s\-+]/g, '')
    if (normalizedWa.startsWith('08')) {
      normalizedWa = '62' + normalizedWa.slice(1)
    }
    const updateData: Record<string, unknown> = {
      description: form.description || null,
      whatsappNumber: normalizedWa || null,
      openingHours: form.openingHours || null,
      updatedAt: new Date().toISOString(),
    }

    if (isKulinerRumahan) {
      updateData.tagline = form.tagline || null
      updateData.areaNote = form.areaNote || null
      updateData.deliveryMethods = form.deliveryMethods
      updateData.operatingDays = form.operatingDays
    }

    const { error: saveErr } = await supabase
      .from('Business')
      .update(updateData)
      .eq('id', business.id)

    setSaving(false)
    if (saveErr) {
      setError('Gagal menyimpan perubahan. Silakan coba lagi.')
      return
    }
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

      {isKulinerRumahan && (
        <>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Contoh: Masakan rumahan, fresh setiap hari"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Area Layanan</label>
            <input
              value={form.areaNote}
              onChange={(e) => setForm({ ...form, areaNote: e.target.value })}
              placeholder="Contoh: Pagedangan & sekitar"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Metode Pengiriman</label>
            <div className="flex flex-wrap gap-2">
              {DELIVERY_METHODS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    deliveryMethods: prev.deliveryMethods.includes(m.value)
                      ? prev.deliveryMethods.filter(v => v !== m.value)
                      : [...prev.deliveryMethods, m.value],
                  }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    form.deliveryMethods.includes(m.value)
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-slate-50 text-slate-600 border-2 border-slate-200'
                  }`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Hari Buka</label>
            <div className="flex flex-wrap gap-2">
              {OPERATING_DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    operatingDays: prev.operatingDays.includes(day)
                      ? prev.operatingDays.filter(d => d !== day)
                      : [...prev.operatingDays, day],
                  }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    form.operatingDays.includes(day)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

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

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3">{error}</div>
      )}

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
