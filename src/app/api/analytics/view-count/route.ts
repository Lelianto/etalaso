import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { rateLimit, getIP } from '@/lib/rate-limit'

export async function GET(request: Request) {
  const limited = rateLimit(getIP(request), 'view-count', { limit: 60, windowMs: 60_000 })
  if (limited) return limited

  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('businessId')

  if (!businessId) {
    return NextResponse.json({ error: 'businessId required' }, { status: 400 })
  }

  const { count } = await supabaseAdmin
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', businessId)

  return NextResponse.json({ count: count || 0 })
}
