import { requireAuth, getUserBusiness, getUserProfile } from '@/lib/auth/helpers'
import EditProfileForm from './EditProfileForm'

export default async function DashboardPage() {
  await requireAuth()
  const business = await getUserBusiness()
  const profile = await getUserProfile()

  if (!business) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-slate-500">Belum ada bisnis yang diklaim.</p>
      </div>
    )
  }

  const canEdit = profile?.planId !== 'free'

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Profil Bisnis</h2>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase">
            {profile?.planId || 'free'}
          </span>
        </div>

        {canEdit ? (
          <EditProfileForm business={business} />
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Nama Bisnis</p>
              <p className="text-slate-800 font-medium">{business.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Alamat</p>
              <p className="text-slate-800">{business.address || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Deskripsi</p>
              <p className="text-slate-800">{business.description || '-'}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm">
                Upgrade ke paket <strong>UMKM</strong> untuk mengedit profil bisnis Anda.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Halaman Bisnis Anda</h2>
        <a
          href={`/p/${(business.region || 'tangsel').toLowerCase().replace(/\s+/g, '-')}/${business.category || 'kuliner'}/${business.placeId}`}
          target="_blank"
          className="text-indigo-600 font-semibold text-sm hover:underline"
        >
          Lihat halaman bisnis →
        </a>
      </div>
    </div>
  )
}
