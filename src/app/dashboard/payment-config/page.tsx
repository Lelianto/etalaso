import { requireAuth, getUserBusiness, getUserProfile } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import PaymentConfigForm from './PaymentConfigForm'

export default async function PaymentConfigPage() {
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

  // Only business-tier can configure payment
  if (profile?.planId !== 'business') {
    redirect('/dashboard/upgrade')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Info Pembayaran</h1>
        <p className="text-sm text-slate-500 mt-1">
          Konfigurasi rekening bank dan QRIS untuk menerima pembayaran pre-order.
        </p>
      </div>
      <PaymentConfigForm
        businessId={business.id}
        initial={{
          bankName: business.bankName || null,
          bankAccountNumber: business.bankAccountNumber || null,
          bankAccountName: business.bankAccountName || null,
          qrisImageUrl: business.qrisImageUrl || null,
        }}
      />
    </div>
  )
}
