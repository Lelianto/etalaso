import { supabaseAdmin } from '@/lib/supabase/admin'
import ClaimActions from './ClaimActions'

export default async function AdminClaimsPage() {
  const { data: claims } = await supabaseAdmin
    .from('Claim')
    .select('*, user:UserProfile(name, email), business:Business(id, name, address, kecamatan, category)')
    .order('createdAt', { ascending: false })

  const statusLabel: Record<string, { text: string; color: string }> = {
    pending: { text: 'Menunggu', color: 'bg-amber-50 text-amber-700' },
    approved: { text: 'Disetujui', color: 'bg-green-50 text-green-700' },
    rejected: { text: 'Ditolak', color: 'bg-red-50 text-red-700' },
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Klaim Bisnis</h1>

      {!claims || claims.length === 0 ? (
        <p className="text-slate-400 text-sm">Belum ada klaim</p>
      ) : (
        <div className="space-y-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {claims.map((claim: any) => {
            const status = statusLabel[claim.status] || statusLabel.pending
            return (
              <div key={claim.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-800">{claim.business?.name}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {claim.business?.address} — {claim.business?.kecamatan}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Diklaim oleh: <strong>{claim.user?.name || claim.user?.email}</strong>
                    </p>
                    {claim.message && (
                      <p className="text-sm text-slate-500 mt-1 italic">&quot;{claim.message}&quot;</p>
                    )}
                    {claim.adminNote && (
                      <p className="text-sm text-red-600 mt-1">Catatan: {claim.adminNote}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(claim.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {claim.status === 'pending' && (
                    <ClaimActions claimId={claim.id} businessId={claim.businessId} userId={claim.userId} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
