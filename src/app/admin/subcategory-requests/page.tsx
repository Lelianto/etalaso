import { supabaseAdmin } from '@/lib/supabase/admin'

export default async function SubcategoryRequestsPage() {
  const { data: requests } = await supabaseAdmin
    .from('SubcategoryRequest')
    .select('*, Business:businessId(name), UserProfile:userId(name, email)')
    .order('createdAt', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Pengajuan Subkategori Baru</h1>

      {!requests || requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          Belum ada pengajuan.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const biz = req.Business as unknown as { name: string } | null
            const user = req.UserProfile as unknown as { name: string; email: string } | null
            return (
              <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">{req.name}</span>
                    {req.description && (
                      <span className="text-slate-400 text-sm ml-2">— {req.description}</span>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    req.status === 'approved' ? 'bg-green-100 text-green-700' :
                    req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  oleh {user?.name || user?.email || 'Unknown'} • {biz?.name || req.businessId} • {new Date(req.createdAt).toLocaleDateString('id-ID')}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
