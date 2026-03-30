import { supabaseAdmin } from '@/lib/supabase/admin'

export default async function OutreachPage() {
  // Get unclaimed businesses with their view counts
  const { data: businesses } = await supabaseAdmin
    .from('Business')
    .select('id, name, address, category, whatsappNumber, placeId, region')
    .is('ownerId', null)
    .order('name')
    .limit(200)

  // Get view counts for these businesses
  const businessIds = (businesses || []).map(b => b.id)

  let viewCounts: Record<string, number> = {}
  let clickCounts: Record<string, number> = {}

  if (businessIds.length > 0) {
    // Get page views count per business (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: views } = await supabaseAdmin
      .from('page_views')
      .select('business_id')
      .in('business_id', businessIds)
      .gte('created_at', thirtyDaysAgo.toISOString())

    const { data: clicks } = await supabaseAdmin
      .from('wa_clicks')
      .select('business_id')
      .in('business_id', businessIds)
      .gte('created_at', thirtyDaysAgo.toISOString())

    for (const v of views || []) {
      viewCounts[v.business_id] = (viewCounts[v.business_id] || 0) + 1
    }
    for (const c of clicks || []) {
      clickCounts[c.business_id] = (clickCounts[c.business_id] || 0) + 1
    }
  }

  // Sort by views descending
  const ranked = (businesses || [])
    .map(b => ({
      ...b,
      views: viewCounts[b.id] || 0,
      clicks: clickCounts[b.id] || 0,
    }))
    .sort((a, b) => b.views - a.views)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Outreach Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Bisnis belum diklaim dengan views tertinggi (30 hari terakhir). Hubungi pemilik via WhatsApp.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">#</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Bisnis</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Kategori</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Views</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">WA Clicks</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Telepon</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranked.map((b, i) => {
                const claimLink = `https://etalaso.com/claim/${b.id}`
                const waMessage = encodeURIComponent(
                  `Halo, saya dari Etalaso.com. Halaman bisnis *${b.name}* di Etalaso sudah dilihat ${b.views} orang minggu ini.\n\nKlaim halaman bisnis Anda gratis di:\n${claimLink}\n\nDengan klaim, Anda bisa edit profil, lihat statistik pengunjung, dan terima pesanan via WhatsApp.`
                )
                const phone = b.whatsappNumber?.replace(/\D/g, '') || ''

                return (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{b.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-xs">{b.address}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
                        {b.category || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600">{b.views}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{b.clicks}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{phone || '-'}</td>
                    <td className="px-4 py-3">
                      {phone ? (
                        <a
                          href={`https://wa.me/${phone}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Kirim WA
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No phone</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {ranked.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            Belum ada data bisnis unclaimed
          </div>
        )}
      </div>
    </div>
  )
}
