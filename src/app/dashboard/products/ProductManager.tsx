'use client'

import { createClient } from '@/lib/supabase/browser'
import { compressImage } from '@/lib/utils/compress-image'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { KULINER_SUBCATEGORIES } from '@/lib/kuliner/constants'

interface Product {
  id: string
  name: string
  price: number | null
  imageUrl: string | null
  subcategory?: string | null
  availabilityNote?: string | null
}

export default function ProductManager({ businessId, products, maxProducts, isKulinerRumahan = false }: {
  businessId: string
  products: Product[]
  maxProducts: number
  isKulinerRumahan?: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [subcategory, setSubcategory] = useState('')
  const [availabilityNote, setAvailabilityNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const canAdd = products.length < maxProducts

  const handleAdd = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const supabase = createClient()

      let imageUrl: string | null = null
      if (file) {
        const compressed = await compressImage(file)
        const fileName = `${businessId}/${Date.now()}-${compressed.name}`
        const { data: upload } = await supabase.storage
          .from('product-images')
          .upload(fileName, compressed, { contentType: compressed.type })

        if (upload) {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)
          imageUrl = publicUrl
        }
      }

      const { error } = await supabase.from('Product').insert({
        businessId,
        name: name.trim(),
        price: price ? parseInt(price) : null,
        imageUrl,
        ...(isKulinerRumahan && subcategory ? { subcategory } : {}),
        ...(isKulinerRumahan && availabilityNote.trim() ? { availabilityNote: availabilityNote.trim() } : {}),
      })

      if (error) {
        alert('Gagal menyimpan produk. Silakan coba lagi.')
        return
      }

      setName('')
      setPrice('')
      setFile(null)
      setFilePreview(null)
      setSubcategory('')
      setAvailabilityNote('')
      setShowForm(false)
      router.refresh()
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId: string) => {
    setDeleting(productId)
    try {
      const supabase = createClient()
      await supabase.from('Product').delete().eq('id', productId)
      router.refresh()
    } catch {
      alert('Gagal menghapus produk.')
    } finally {
      setDeleting(null)
    }
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
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800">{p.name}</p>
            {p.price && (
              <p className="text-sm text-slate-500">Rp {p.price.toLocaleString('id-ID')}</p>
            )}
            {p.availabilityNote && (
              <span className="inline-block mt-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {p.availabilityNote}
              </span>
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
          {isKulinerRumahan && (
            <>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Kategori menu (opsional)</option>
                {KULINER_SUBCATEGORIES.map(s => (
                  <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
                ))}
              </select>
              <input
                value={availabilityNote}
                onChange={(e) => setAvailabilityNote(e.target.value)}
                placeholder="Ketersediaan (contoh: PO besok, Ready jam 17:00)"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                setFile(f)
                if (f) {
                  const url = URL.createObjectURL(f)
                  setFilePreview(url)
                } else {
                  setFilePreview(null)
                }
              }}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {filePreview && (
              <div className="mt-2 flex items-center gap-3">
                <Image src={filePreview} alt="Preview" width={80} height={80} className="w-20 h-20 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setFilePreview(null) }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Hapus foto
                </button>
              </div>
            )}
          </div>

          {/* Preview seperti yang dilihat pembeli */}
          {name.trim() && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Preview pembeli</p>
              <div className="bg-white rounded-xl border border-neutral-100 p-3 flex gap-3">
                {filePreview ? (
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
                    <Image src={filePreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{name.trim()}</p>
                  {availabilityNote.trim() && (
                    <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      {availabilityNote.trim()}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-slate-800">
                      {price ? `Rp ${parseInt(price).toLocaleString('id-ID')}` : 'Hubungi'}
                    </span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                      + Tambah
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving || !name.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold px-4 py-2 rounded-xl text-sm"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={() => { setShowForm(false); setName(''); setPrice(''); setFile(null); setFilePreview(null); setSubcategory(''); setAvailabilityNote('') }}
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
