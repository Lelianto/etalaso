import { requireAuth } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import DashboardNav from './DashboardNav'

export const metadata: Metadata = {
  title: 'Dashboard | Etalaso',
  robots: { index: false, follow: false },
}

async function PendingOrNoClaim({ userId }: { userId: string }) {
  const supabase = await createClient()

  // Check if user has a pending claim
  const { data: pendingClaim } = await supabase
    .from('Claim')
    .select('id, status, businessId, Business:businessId(name)')
    .eq('userId', userId)
    .eq('status', 'pending')
    .limit(1)
    .single()

  if (pendingClaim) {
    const biz = pendingClaim.Business as unknown as { name: string } | null
    const businessName = biz?.name
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl">⏳</span>
          <div>
            <p className="text-blue-800 text-sm font-semibold">
              Klaim Anda sedang ditinjau admin
            </p>
            <p className="text-blue-700 text-xs mt-1">
              {businessName
                ? <>Klaim untuk <strong>{businessName}</strong> sedang diproses. </>
                : <>Klaim bisnis Anda sedang diproses. </>
              }
              Anda akan mendapat akses dashboard setelah admin menyetujui klaim dan pembayaran Anda.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <p className="text-amber-800 text-sm font-medium">
        Anda belum mengklaim bisnis. Cari bisnis Anda di halaman utama dan klik &quot;Klaim bisnis ini&quot;.
      </p>
    </div>
  )
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('UserProfile')
    .select('name, avatar_url, planId, role')
    .eq('id', user.id)
    .single()

  const { data: business } = await supabase
    .from('Business')
    .select('id, name')
    .eq('ownerId', user.id)
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-black tracking-tight text-slate-900">
            etalaso
          </Link>
          <div className="flex items-center gap-3">
            {profile?.role === 'admin' && (
              <Link href="/admin" className="text-xs font-semibold text-indigo-600 hover:underline">
                Admin
              </Link>
            )}
            <div className="flex items-center gap-2">
              {profile?.avatar_url && (
                <Image src={profile.avatar_url} alt="" width={28} height={28} className="w-7 h-7 rounded-full" />
              )}
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {profile?.name || user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {!business ? (
          <PendingOrNoClaim userId={user.id} />
        ) : (
          <DashboardNav businessId={business.id} planId={profile?.planId || 'free'} />
        )}
        {children}
      </div>
    </div>
  )
}
