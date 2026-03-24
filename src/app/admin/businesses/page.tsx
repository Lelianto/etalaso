import { supabaseAdmin } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function AdminBusinessesPage() {
  const { data: businesses, error } = await supabaseAdmin
    .from('Business')
    .select('id, name, kecamatan, region, category, address, ownerId, template')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching businesses:', error)
  }

  // Fetch owner info separately for claimed businesses
  const ownerIds = [...new Set((businesses || []).filter(b => b.ownerId).map(b => b.ownerId))]
  const ownerMap: Record<string, { name: string | null; email: string }> = {}

  if (ownerIds.length > 0) {
    const { data: owners } = await supabaseAdmin
      .from('UserProfile')
      .select('id, name, email')
      .in('id', ownerIds)

    owners?.forEach(o => { ownerMap[o.id] = { name: o.name, email: o.email } })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Bisnis</h1>

      {!businesses || businesses.length === 0 ? (
        <p className="text-slate-400 text-sm">Belum ada bisnis</p>
      ) : (
        <>
          <p className="text-sm text-slate-500">{businesses.length} bisnis terdaftar</p>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {businesses.map((b: any) => (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{b.name}</p>
                  <p className="text-xs text-slate-500">
                    {b.kecamatan}{b.region ? `, ${b.region}` : ''} — {b.category} — {b.template || 'minimal'}
                  </p>
                  {b.ownerId && ownerMap[b.ownerId] ? (
                    <p className="text-xs text-green-600 mt-1">
                      Diklaim oleh {ownerMap[b.ownerId].name || ownerMap[b.ownerId].email}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1">Belum diklaim</p>
                  )}
                </div>
                <Link
                  href={`/p/${(b.kecamatan || 'unknown').toLowerCase().replace(/\s+/g, '-')}/${(b.category || 'bisnis').toLowerCase().replace(/\s+/g, '-')}/${b.name.toLowerCase().replace(/\s+/g, '-')}`}
                  target="_blank"
                  className="text-xs text-indigo-600 hover:underline shrink-0"
                >
                  Lihat →
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
