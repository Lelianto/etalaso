import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { businessId } = await request.json()
    if (!businessId) {
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
