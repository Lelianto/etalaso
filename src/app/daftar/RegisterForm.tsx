'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES, KECAMATAN_LIST, REGION_LABELS } from '@/lib/constants/regions'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    category: '',
    address: '',
    kecamatan: '',
    googleMapsUrl: '',
    whatsappNumber: '',
    openingHours: '',
    description: '',
  })

  const selectedKec = KECAMATAN_LIST.find(k => k.name === form.kecamatan)
  const regionLabel = selectedKec ? REGION_LABELS[selectedKec.region] : ''

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/business/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Gagal menghubungi server')
      setLoading(false)
    }
  }

  // Group kecamatan by region for the dropdown
  const kecByRegion = Object.entries(REGION_LABELS).map(([key, label]) => ({
    region: key,
    label,
    kecamatans: KECAMATAN_LIST.filter(k => k.region === key),
  }))

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="border-b border-neutral-200/60 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-charcoal">
            Etalaso<span className="text-amber">.</span>
          </Link>
          <Link href="/bisnis" className="text-sm text-neutral-500 hover:text-charcoal transition-colors">
            Jelajahi Bisnis
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-charcoal">
            Daftarkan Bisnis Anda
          </h1>
          <p className="mt-3 text-neutral-500">
            Isi form di bawah untuk mendapatkan halaman bisnis online gratis di Etalaso.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">&#10003;</span>
              Halaman bisnis otomatis
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">&#10003;</span>
              Template dasar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">&#10003;</span>
              Tombol WhatsApp
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Bisnis */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Nama Bisnis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Contoh: Warung Makan Pak Joko"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors bg-white"
            >
              <option value="">Pilih kategori</option>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.address}
              onChange={e => update('address', e.target.value)}
              placeholder="Jl. Raya Ciputat No. 123, RT 01/RW 02"
              rows={2}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors resize-none"
            />
          </div>

          {/* Kecamatan + Region */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Kecamatan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.kecamatan}
                onChange={e => update('kecamatan', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors bg-white"
              >
                <option value="">Pilih kecamatan</option>
                {kecByRegion.map(group => (
                  <optgroup key={group.region} label={group.label}>
                    {group.kecamatans.map(k => (
                      <option key={k.name} value={k.name}>{k.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Region
              </label>
              <input
                type="text"
                readOnly
                value={regionLabel}
                placeholder="Otomatis dari kecamatan"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm bg-neutral-50 text-neutral-500"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.whatsappNumber}
              onChange={e => update('whatsappNumber', e.target.value)}
              placeholder="628xxxxxxxxxx"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors"
            />
            <p className="mt-1 text-xs text-neutral-400">Format: 628xxx (tanpa + atau spasi)</p>
          </div>

          {/* Google Maps URL */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Link Google Maps <span className="text-neutral-400 font-normal">(opsional)</span>
            </label>
            <input
              type="url"
              value={form.googleMapsUrl}
              onChange={e => update('googleMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors"
            />
          </div>

          {/* Jam Buka */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Jam Buka <span className="text-neutral-400 font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={form.openingHours}
              onChange={e => update('openingHours', e.target.value)}
              placeholder="Senin-Sabtu, 08:00-21:00"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Deskripsi <span className="text-neutral-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Deskripsi singkat tentang bisnis Anda"
              rows={3}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mendaftarkan...' : 'Daftarkan Bisnis — Gratis'}
          </button>

        </form>
      </main>
    </div>
  )
}
