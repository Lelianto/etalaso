import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { rateLimit, getIP } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = rateLimit(getIP(request), 'report', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  try {
    const { businessId, reason } = await request.json()
    if (!businessId || !reason || typeof businessId !== 'string' || typeof reason !== 'string') {
      return NextResponse.json({ error: 'businessId and reason required' }, { status: 400 })
    }

    // Truncate reason to prevent abuse
    const safeReason = reason.slice(0, 1000)

    await supabaseAdmin.from('reports').insert({
      business_id: businessId,
      reason: safeReason,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
