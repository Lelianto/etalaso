import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Called by Vercel Cron or pg_cron as a backup
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find expired subscriptions
  const { data: expired } = await supabaseAdmin
    .from('UserProfile')
    .select('id, planId, planExpiresAt')
    .neq('planId', 'free')
    .lt('planExpiresAt', new Date().toISOString())

  if (!expired || expired.length === 0) {
    return NextResponse.json({ ok: true, downgraded: 0 })
  }

  let downgraded = 0

  for (const user of expired) {
    // Downgrade UserProfile to free
    await supabaseAdmin
      .from('UserProfile')
      .update({ planId: 'free' })
      .eq('id', user.id)

    // Reset Business subscriptionType and template
    await supabaseAdmin
      .from('Business')
      .update({
        subscriptionType: 'free',
        template: 'minimal',
        updatedAt: new Date().toISOString(),
      })
      .eq('ownerId', user.id)

    downgraded++
  }

  return NextResponse.json({ ok: true, downgraded })
}
