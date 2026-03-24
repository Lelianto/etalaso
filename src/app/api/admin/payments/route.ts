import { requireAdmin, getUser } from '@/lib/auth/helpers'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  await requireAdmin()
  const admin = await getUser()

  const { paymentId, userId, planId, action, note } = await request.json()

  if (action === 'verify') {
    // Update payment status
    await supabaseAdmin
      .from('Payment')
      .update({
        status: 'verified',
        verifiedBy: admin!.id,
        verifiedAt: new Date().toISOString(),
      })
      .eq('id', paymentId)

    // Upgrade user plan
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month from now

    await supabaseAdmin
      .from('UserProfile')
      .update({
        planId: planId,
        planExpiresAt: expiresAt.toISOString(),
      })
      .eq('id', userId)
  } else if (action === 'reject') {
    await supabaseAdmin
      .from('Payment')
      .update({
        status: 'rejected',
        adminNote: note || null,
        verifiedBy: admin!.id,
        verifiedAt: new Date().toISOString(),
      })
      .eq('id', paymentId)
  }

  return NextResponse.json({ ok: true })
}
