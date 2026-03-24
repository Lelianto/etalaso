import { requireAuth } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'

export default async function PaymentsPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('Payment')
    .select('*, plan:Plan(name)')
    .eq('userId', user.id)
    .order('createdAt', { ascending: false })

  const statusLabel: Record<string, { text: string; color: string }> = {
    pending: { text: 'Menunggu Verifikasi', color: 'bg-amber-50 text-amber-700' },
    verified: { text: 'Disetujui', color: 'bg-green-50 text-green-700' },
    rejected: { text: 'Ditolak', color: 'bg-red-50 text-red-700' },
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Riwayat Pembayaran</h2>

      {!payments || payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-400">Belum ada pembayaran</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {payments.map((p: any) => {
            const status = statusLabel[p.status] || statusLabel.pending
            return (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-slate-800">Paket {p.plan?.name}</p>
                    <p className="text-sm text-slate-500">
                      Rp {p.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                {p.proof_url && (
                  <a href={p.proof_url} target="_blank" className="text-indigo-600 text-sm hover:underline">
                    Lihat bukti pembayaran →
                  </a>
                )}
                {p.adminNote && (
                  <p className="text-sm text-red-600 mt-1">Catatan admin: {p.adminNote}</p>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
