import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const PROMO_TOTAL_SLOTS = 50

export async function GET() {
  // Count businesses with paid subscriptions (these are the ones who "took" a slot)
  const { count } = await supabaseAdmin
    .from('Business')
    .select('*', { count: 'exact', head: true })
    .eq('isClaimed', true)
    .neq('subscriptionType', 'free')

  // Get plan prices from database
  const { data: plans } = await supabaseAdmin
    .from('Plan')
    .select('id, price, discountPrice')
    .in('id', ['umkm', 'business'])

  const umkm = plans?.find(p => p.id === 'umkm')
  const business = plans?.find(p => p.id === 'business')

  const taken = count || 0
  const remaining = Math.max(0, PROMO_TOTAL_SLOTS - taken)

  return NextResponse.json({
    total: PROMO_TOTAL_SLOTS,
    taken,
    remaining,
    promoActive: remaining > 0,
    plans: {
      umkm: {
        price: umkm?.price ?? 0,
        discountPrice: umkm?.discountPrice ?? null,
      },
      business: {
        price: business?.price ?? 0,
        discountPrice: business?.discountPrice ?? null,
      },
    },
  })
}
