import { requireAuth, getUserProfile } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import UpgradeClient from './UpgradeClient'

export default async function UpgradePage() {
  await requireAuth()
  const profile = await getUserProfile()

  const supabase = await createClient()
  const { data: plans } = await supabase
    .from('Plan')
    .select('*')
    .order('price', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Pilih Paket</h2>
        <p className="text-slate-500 text-sm mt-1">
          Upgrade untuk membuka fitur premium dan mengembangkan bisnis Anda
        </p>
      </div>

      <UpgradeClient
        plans={plans || []}
        currentPlanId={profile?.planId || 'free'}
      />
    </div>
  )
}
