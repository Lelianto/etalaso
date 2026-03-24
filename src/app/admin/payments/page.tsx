import { supabaseAdmin } from '@/lib/supabase/admin'
import PaymentActions from './PaymentActions'

export default async function AdminPaymentsPage() {
  const { data: payments } = await supabaseAdmin
    .from('Payment')
    .select('*, user:UserProfile(name, email), plan:Plan(name)')
    .order('createdAt', { ascending: false })

  const statusLabel: Record<string, { text: string; color: string }> = {
    pending: { text: 'Menunggu', color: 'bg-amber-50 text-amber-700' },
    verified: { text: 'Disetujui', color: 'bg-green-50 text-green-700' },
    rejected: { text: 'Ditolak', color: 'bg-red-50 text-red-700' },
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Verifikasi Pembayaran</h1>

      {!payments || payments.length === 0 ? (
        <p className="text-slate-400 text-sm">Belum ada pembayaran</p>
      ) : (
        <div className="space-y-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {payments.map((p: any) => {
            const status = statusLabel[p.status] || statusLabel.pending
            return (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-800">{p.user?.name || p.user?.email}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Paket <strong>{p.plan?.name}</strong> — Rp {p.amount?.toLocaleString('id-ID')}
                    </p>
                    {p.proof_url && (
                      <a
                        href={p.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-indigo-600 hover:underline"
                      >
                        Lihat Bukti Pembayaran →
                      </a>
                    )}
                    {p.adminNote && (
                      <p className="text-sm text-red-600 mt-1">Catatan: {p.adminNote}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {p.status === 'pending' && (
                    <PaymentActions paymentId={p.id} userId={p.userId} planId={p.planId} />
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
