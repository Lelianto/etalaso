'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  business: { id: string; name: string; address: string | null; category: string | null }
  userId: string
}

export default function ClaimForm({ business, userId }: Props) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('Claim').insert({
      businessId: business.id,
      userId,
      message: message || null,
    })

    if (err) {
      setError('Gagal mengirim klaim. Silakan coba lagi.')
      setLoading(false)
      return
    }

    router.push('/claim/success')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🏪</div>
            <h1 className="text-xl font-bold text-slate-800">Klaim Bisnis Anda</h1>
            <p className="text-slate-500 text-sm mt-1">
              Pastikan Anda adalah pemilik bisnis ini
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="font-bold text-slate-800">{business.name}</p>
            {business.address && (
              <p className="text-slate-500 text-sm mt-1">{business.address}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Pesan (opsional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contoh: Saya pemilik warung ini sejak 2020..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Mengirim...' : 'Kirim Klaim'}
            </button>

            <p className="text-xs text-slate-400 text-center">
              Admin akan meninjau klaim Anda dalam 1-2 hari kerja
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
