import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const PROMO_TOTAL_SLOTS = 50
const PROMO_PRICE = 9900 // Rp 9.900/bulan

export async function GET() {
  // Count businesses with paid subscriptions (these are the ones who "took" a slot)
  const { count } = await supabaseAdmin
    .from('Business')
    .select('*', { count: 'exact', head: true })
    .eq('isClaimed', true)
    .neq('subscriptionType', 'free')

  const taken = count || 0
  const remaining = Math.max(0, PROMO_TOTAL_SLOTS - taken)

  return NextResponse.json({
    total: PROMO_TOTAL_SLOTS,
    taken,
    remaining,
    promoPrice: PROMO_PRICE,
    promoActive: remaining > 0,
  })
}
