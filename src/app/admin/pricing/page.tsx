import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/helpers'
import PricingEditor from './PricingEditor'

export default async function AdminPricingPage() {
  await requireAdmin()

  const { data: plans } = await supabaseAdmin
    .from('Plan')
    .select('id, name, price, discountPrice, features')
    .order('price', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Pengaturan Harga</h1>
        <p className="text-slate-500 text-sm mt-1">Atur harga normal dan harga diskon untuk setiap paket.</p>
      </div>
      <PricingEditor plans={plans || []} />
    </div>
  )
}
