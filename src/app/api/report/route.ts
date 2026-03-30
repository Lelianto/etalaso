import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { businessId, reason } = await request.json()
    if (!businessId || !reason) {
      return NextResponse.json({ error: 'businessId and reason required' }, { status: 400 })
    }

    await supabaseAdmin.from('reports').insert({
      business_id: businessId,
      reason,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
