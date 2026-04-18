import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { rateLimit, getIP } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = rateLimit(getIP(request), 'wa-click', { limit: 20, windowMs: 60_000 })
  if (limited) return limited

  try {
    const { businessId } = await request.json()
    if (!businessId || typeof businessId !== 'string') {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    await supabaseAdmin.from('wa_clicks').insert({
      business_id: businessId,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
