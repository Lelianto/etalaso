'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/lib/constants/regions'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    category: '',
    whatsappNumber: '',
  })

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
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 pr-10 text-sm focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors bg-transparent"
            >
              <option value="">Pilih kategori</option>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
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
            <p className="mt-1 text-xs text-neutral-400">Mulai dari 0 atau 62 (tanpa + atau spasi)</p>
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
