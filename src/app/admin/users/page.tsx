import { supabaseAdmin } from '@/lib/supabase/admin'
import Image from 'next/image'

export default async function AdminUsersPage() {
  const { data: users } = await supabaseAdmin
    .from('UserProfile')
    .select('*, plan:Plan(name)')
    .order('createdAt', { ascending: false })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Pengguna</h1>

      {!users || users.length === 0 ? (
        <p className="text-slate-400 text-sm">Belum ada pengguna</p>
      ) : (
        <>
          <p className="text-sm text-slate-500">{users.length} pengguna terdaftar</p>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {users.map((u: any) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {u.avatar_url ? (
                    <Image src={u.avatar_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                      {(u.name || u.email || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{u.name || '-'}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-50 text-slate-600'
                  }`}>
                    {u.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">Paket {u.plan?.name || 'Gratis'}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
