'use client'

import { createClient } from '@/lib/supabase/browser'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number | null
  imageUrl: string | null
}

export default function ProductManager({ businessId, products, maxProducts }: {
  businessId: string
  products: Product[]
  maxProducts: number
}) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const canAdd = products.length < maxProducts

  const handleAdd = async () => {
    if (!name.trim()) return
    setSaving(true)
    const supabase = createClient()

    let imageUrl: string | null = null
    if (file) {
      const fileName = `${businessId}/${Date.now()}-${file.name}`
      const { data: upload } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (upload) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
        imageUrl = publicUrl
      }
    }

    await supabase.from('Product').insert({
      businessId,
      name: name.trim(),
      price: price ? parseInt(price) : null,
      imageUrl,
    })

    setName('')
    setPrice('')
    setFile(null)
    setShowForm(false)
    setSaving(false)
    router.refresh()
  }

  const handleDelete = async (productId: string) => {
    setDeleting(productId)
    const supabase = createClient()
    await supabase.from('Product').delete().eq('id', productId)
    setDeleting(null)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          {p.imageUrl ? (
            <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
              No img
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-slate-800">{p.name}</p>
            {p.price && (
              <p className="text-sm text-slate-500">Rp {p.price.toLocaleString('id-ID')}</p>
            )}
          </div>
          <button
            onClick={() => handleDelete(p.id)}
            disabled={deleting === p.id}
            className="text-xs text-red-500 hover:underline disabled:opacity-50"
          >
            {deleting === p.id ? '...' : 'Hapus'}
          </button>
        </div>
      ))}

      {showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama produk"
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
            placeholder="Harga (opsional)"
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving || !name.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold px-4 py-2 rounded-xl text-sm"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={() => { setShowForm(false); setName(''); setPrice(''); setFile(null) }}
              className="text-sm text-slate-500 hover:underline"
            >
              Batal
            </button>
          </div>
        </div>
      ) : canAdd ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-white rounded-xl border-2 border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        >
          + Tambah Produk
        </button>
      ) : (
        <p className="text-sm text-slate-400 text-center">Batas produk tercapai ({maxProducts} produk)</p>
      )}
    </div>
  )
}
