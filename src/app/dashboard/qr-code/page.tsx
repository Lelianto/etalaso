import { requireAuth, getUserBusiness, getUserProfile } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import { canonicalUrl } from '@/lib/seo/utils'
import QRGenerator from './QRGenerator'

export default async function QRCodePage() {
  await requireAuth()
  const profile = await getUserProfile()
  const business = await getUserBusiness()

  if (!business) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-slate-500">Belum ada bisnis yang diklaim.</p>
      </div>
    )
  }

  // Only UMKM and business tiers can generate QR codes
  if (!profile?.planId || profile.planId === 'free') {
    redirect('/dashboard/upgrade')
  }

  const businessUrl = canonicalUrl(
    `/p/${(business.region || 'tangsel').toLowerCase().replace(/\s+/g, '-')}/${business.category || 'kuliner'}/${business.placeId}`
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">QR Code Meja</h1>
        <p className="text-sm text-slate-500 mt-1">
          Generate QR code untuk setiap meja. Pelanggan scan untuk langsung pesan dari meja mereka.
        </p>
      </div>
      <QRGenerator baseUrl={businessUrl} businessName={business.name} />
    </div>
  )
}
