import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClaimForm from './ClaimForm'

export default async function ClaimPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?claim=${businessId}`)

  // Get business info
  const { data: business } = await supabase
    .from('Business')
    .select('id, name, address, category, isClaimed, ownerId')
    .eq('id', businessId)
    .single()

  if (!business) redirect('/')

  // Already claimed by this user
  if (business.ownerId === user.id) redirect('/dashboard')

  // Already claimed by someone else
  if (business.isClaimed && business.ownerId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-4xl mb-4">😔</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Bisnis Sudah Diklaim</h1>
          <p className="text-slate-500 text-sm">
            <strong>{business.name}</strong> sudah diklaim oleh pemilik lain.
            Jika Anda merasa ini salah, hubungi admin.
          </p>
        </div>
      </div>
    )
  }

  // Check existing pending claim
  const { data: existingClaim } = await supabase
    .from('Claim')
    .select('id, status')
    .eq('businessId', businessId)
    .eq('userId', user.id)
    .eq('status', 'pending')
    .single()

  if (existingClaim) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Klaim Sedang Diproses</h1>
          <p className="text-slate-500 text-sm">
            Klaim Anda untuk <strong>{business.name}</strong> sedang ditinjau admin.
            Kami akan menghubungi Anda melalui email.
          </p>
        </div>
      </div>
    )
  }

  return <ClaimForm business={business} userId={user.id} />
}
