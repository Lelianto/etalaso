import { supabaseAdmin } from '@/lib/supabase/admin'

export default async function AdminDashboard() {
  const [
    { count: totalUsers },
    { count: totalBusinesses },
    { count: claimedBusinesses },
    { count: pendingClaims },
    { count: pendingPayments },
    { data: recentPayments },
  ] = await Promise.all([
    supabaseAdmin.from('UserProfile').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('Business').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('Business').select('*', { count: 'exact', head: true }).not('ownerId', 'is', null),
    supabaseAdmin.from('Claim').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('Payment').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin
      .from('Payment')
      .select('*, user:UserProfile(name, email), plan:Plan(name)')
      .order('createdAt', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: 'Total Pengguna', value: totalUsers || 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Bisnis', value: totalBusinesses || 0, color: 'bg-slate-50 text-slate-700' },
    { label: 'Bisnis Terklaim', value: claimedBusinesses || 0, color: 'bg-green-50 text-green-700' },
    { label: 'Klaim Pending', value: pendingClaims || 0, color: 'bg-amber-50 text-amber-700' },
    { label: 'Bayar Pending', value: pendingPayments || 0, color: 'bg-red-50 text-red-700' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Pembayaran Terbaru</h2>
        {!recentPayments || recentPayments.length === 0 ? (
          <p className="text-slate-400 text-sm">Belum ada pembayaran</p>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {recentPayments.map((p: any) => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{p.user?.name || p.user?.email}</p>
                  <p className="text-xs text-slate-500">Paket {p.plan?.name} — Rp {p.amount?.toLocaleString('id-ID')}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  p.status === 'verified' ? 'bg-green-50 text-green-700' :
                  p.status === 'rejected' ? 'bg-red-50 text-red-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {p.status === 'verified' ? 'Verified' : p.status === 'rejected' ? 'Rejected' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
