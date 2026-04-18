'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SlugEditorProps {
  currentSlug: string | null
  planId: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export default function SlugEditor({ currentSlug, planId }: SlugEditorProps) {
  const isLocked = planId === 'free'
  const [slug, setSlug] = useState(currentSlug || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const preview = slugify(slug)

  const handleSave = async () => {
    if (!preview || preview.length < 3) {
      setMessage({ type: 'error', text: 'Slug minimal 3 karakter' })
      return
    }
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/kuliner/slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: preview }),
      })

      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error })
      } else {
        setMessage({ type: 'success', text: 'Slug berhasil disimpan!' })
        setSlug(data.slug)
        router.refresh()
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal menyimpan' })
    } finally {
      setSaving(false)
    }
  }

  if (isLocked) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Link Toko Kustom</p>
            <p className="text-xs text-slate-400 mt-0.5">Upgrade ke UMKM untuk custom URL</p>
          </div>
          <Link href="/dashboard/upgrade" className="text-xs font-semibold text-indigo-600 hover:underline">
            Upgrade →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Link Toko Kustom</label>
        <p className="text-xs text-slate-400 mb-2">Buat link yang mudah diingat untuk toko Anda</p>
      </div>

      <div className="flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
        <span className="bg-slate-50 text-slate-400 text-sm px-3 py-3 border-r border-slate-200 shrink-0">
          etalaso.biz.id/kuliner/
        </span>
        <input
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setMessage(null) }}
          placeholder="dapur-bu-sari"
          className="flex-1 px-3 py-3 text-sm focus:outline-none min-w-0"
        />
      </div>

      {preview && preview !== slug && (
        <p className="text-xs text-slate-400">
          Akan disimpan sebagai: <span className="font-mono text-slate-600">{preview}</span>
        </p>
      )}

      {preview && (
        <p className="text-xs text-slate-500">
          Preview: <span className="font-mono text-indigo-600">etalaso.biz.id/kuliner/{preview}</span>
        </p>
      )}

      {message && (
        <p className={`text-xs font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !preview || preview.length < 3 || preview === currentSlug}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
      >
        {saving ? 'Menyimpan...' : 'Simpan Slug'}
      </button>
    </div>
  )
}
