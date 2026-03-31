'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KECAMATAN_LIST, REGION_LABELS } from '@/lib/constants/regions'
import { KULINER_SUBCATEGORIES, DELIVERY_METHODS, OPERATING_DAYS } from '@/lib/kuliner/constants'

export default function KulinerRegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    whatsappNumber: '',
    kecamatan: '',
    address: '',
    defaultSubcategory: [] as string[],
    deliveryMethods: [] as string[],
    operatingDays: [] as string[],
    description: '',
  })

  const selectedKec = KECAMATAN_LIST.find(k => k.name === form.kecamatan)
  const regionLabel = selectedKec ? REGION_LABELS[selectedKec.region] : ''

  const update = (field: string, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const toggleArray = (field: 'deliveryMethods' | 'operatingDays', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.defaultSubcategory.length === 0) {
      setError('Pilih minimal 1 jenis makanan')
      setLoading(false)
      return
    }
    if (form.deliveryMethods.length === 0) {
      setError('Pilih minimal 1 metode pengiriman')
      setLoading(false)
      return
    }
    if (form.operatingDays.length === 0) {
      setError('Pilih minimal 1 hari operasional')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/kuliner/register', {
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
          <Link href="/kuliner" className="text-sm text-neutral-500 hover:text-charcoal transition-colors">
            Kuliner Rumahan
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-amber font-semibold mb-3">
            <span className="text-lg">🍳</span> Kuliner Rumahan
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-charcoal">
            Daftarkan Usaha Kuliner Anda
          </h1>
          <p className="mt-3 text-neutral-500">
            Terima pesanan via WhatsApp langsung dari halaman katalog makanan Anda.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">&#10003;</span>
              Katalog makanan online
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">&#10003;</span>
              Pesan via WhatsApp
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">&#10003;</span>
              Link kustom (etalaso.id/kuliner/nama-toko)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">&#10003;</span>
              Gratis selamanya
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Usaha */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Nama Usaha <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Contoh: Dapur Bu Sari"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Tagline <span className="text-neutral-400 font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={e => update('tagline', e.target.value)}
              placeholder="Contoh: Masakan rumahan, fresh setiap hari"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors"
            />
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
              placeholder="08xxxxxxxxxx atau 628xxxxxxxxxx"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors"
            />
            <p className="mt-1 text-xs text-neutral-400">Bisa pakai format 08xxx atau 628xxx</p>
          </div>

          {/* Kategori Makanan */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Jenis Makanan <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-neutral-400 mb-2">Boleh pilih lebih dari satu</p>
            <div className="flex flex-wrap gap-2">
              {KULINER_SUBCATEGORIES.map(s => {
                const selected = form.defaultSubcategory.includes(s.value)
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? form.defaultSubcategory.filter((v: string) => v !== s.value)
                        : [...form.defaultSubcategory, s.value]
                      update('defaultSubcategory', next)
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selected
                        ? 'bg-amber/10 border-amber text-charcoal font-medium'
                        : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Kecamatan */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Kecamatan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.kecamatan}
                onChange={e => update('kecamatan', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 pr-10 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors bg-transparent"
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

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Alamat <span className="text-neutral-400 font-normal">(opsional, bisa diisi nanti)</span>
            </label>
            <textarea
              value={form.address}
              onChange={e => update('address', e.target.value)}
              placeholder="Jl. Raya Ciputat No. 123"
              rows={2}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors resize-none"
            />
          </div>

          {/* Metode Pengiriman */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Metode Pengiriman <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {DELIVERY_METHODS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => toggleArray('deliveryMethods', m.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.deliveryMethods.includes(m.value)
                      ? 'border-amber bg-amber/5'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-xl mb-1">{m.icon}</div>
                  <div className="text-sm font-semibold text-charcoal">{m.label}</div>
                  {'note' in m && (
                    <div className="text-xs text-neutral-400 mt-0.5">{m.note}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hari Operasional */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Hari Buka <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {OPERATING_DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleArray('operatingDays', day)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    form.operatingDays.includes(day)
                      ? 'bg-amber text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const allDays = [...OPERATING_DAYS]
                setForm(prev => ({
                  ...prev,
                  operatingDays: prev.operatingDays.length === OPERATING_DAYS.length ? [] : allDays,
                }))
              }}
              className="mt-2 text-xs text-amber font-medium hover:underline"
            >
              {form.operatingDays.length === OPERATING_DAYS.length ? 'Hapus Semua' : 'Pilih Semua Hari'}
            </button>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              Deskripsi <span className="text-neutral-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Ceritakan sedikit tentang usaha kuliner Anda"
              rows={3}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang — Gratis'}
          </button>

          <p className="text-center text-xs text-neutral-400">
            Setelah mendaftar, Anda bisa langsung menambahkan menu dan menerima pesanan via WhatsApp.
          </p>
        </form>
      </main>
    </div>
  )
}
