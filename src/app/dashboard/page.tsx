export const dynamic = 'force-dynamic'

import { requireAuth, getUserBusiness, getUserProfile } from '@/lib/auth/helpers'
import { canOrder, canPreOrder } from '@/lib/ordering/tier'
import EditProfileForm from './EditProfileForm'
import UpgradeNudge from '@/components/ordering/UpgradeNudge'
import VisitorStats from '@/components/dashboard/VisitorStats'
import TrialCountdown from '@/components/dashboard/TrialCountdown'
import ShareButtons from '@/components/ui/ShareButtons'
import SlugEditor from '@/components/dashboard/SlugEditor'
import Link from 'next/link'

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

  const planId = profile?.planId || 'free'
  const isKulinerRumahan = business.businessType === 'kuliner_rumahan' || business.category === 'kuliner_rumahan'
  const canEdit = true

  // Setup completeness check for all businesses with paid plans
  const setupIssues: { label: string; href: string; icon: string }[] = []
  if (canOrder(planId)) {
    if (!business.whatsappNumber) {
      setupIssues.push({ label: 'Nomor WhatsApp belum diisi — pesanan tidak bisa dikirim', href: '/dashboard', icon: '📱' })
    }
    if (!business.products || business.products.length === 0) {
      setupIssues.push({ label: 'Belum ada produk/layanan — pelanggan tidak bisa memesan', href: '/dashboard/products', icon: '📦' })
    }
    if (!business.openingHours) {
      setupIssues.push({ label: 'Jam operasional belum diisi', href: '/dashboard', icon: '🕐' })
    }
    if (canPreOrder(planId) && !business.bankName && !business.qrisImageUrl) {
      setupIssues.push({ label: 'Info pembayaran belum diisi — pelanggan tidak bisa transfer', href: '/dashboard/payment-config', icon: '🏦' })
    }
  }

  const planExpiresAt = profile?.planExpiresAt || null
  const businessUrl = isKulinerRumahan
    ? `/kuliner/${business.customSlug || business.placeId}`
    : `/p/${(business.region || 'tangsel').toLowerCase().replace(/\s+/g, '-')}/${business.category || 'kuliner'}/${business.placeId}`

  return (
    <div className="space-y-6">
      {/* Trial countdown */}
      {planExpiresAt && planId !== 'free' && (
        <TrialCountdown expiresAt={planExpiresAt} planId={planId} />
      )}

      {/* Visitor stats */}
      <VisitorStats planId={planId} />

      {/* Setup completeness warning */}
      {setupIssues.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-amber-900 text-sm mb-3">
            Lengkapi data berikut agar pemesanan via WhatsApp aktif:
          </h3>
          <div className="space-y-2">
            {setupIssues.map((issue, i) => (
              <Link
                key={i}
                href={issue.href}
                className="flex items-start gap-2.5 text-sm text-amber-800 hover:text-amber-950 transition-colors"
              >
                <span>{issue.icon}</span>
                <span>{issue.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Profil Bisnis</h2>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase">
            {planId}
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

      {/* Upgrade nudge for UMKM tier */}
      {planId === 'umkm' && <UpgradeNudge />}

      {/* Business page link + share */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Halaman Bisnis Anda</h2>
        <div className="flex items-center gap-3">
          <a
            href={businessUrl}
            target="_blank"
            className="text-indigo-600 font-semibold text-sm hover:underline"
          >
            Lihat halaman bisnis →
          </a>
          <div className="flex gap-1.5">
            <ShareButtons url={businessUrl} title={business.name} />
          </div>
        </div>

        {isKulinerRumahan && (
          <SlugEditor currentSlug={business.customSlug || null} planId={planId} />
        )}
      </div>
    </div>
  )
}
