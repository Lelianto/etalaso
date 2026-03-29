import { getUserProfile, getUser } from '@/lib/auth/helpers'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
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

    // Sync subscriptionType on Business table
    await supabaseAdmin
      .from('Business')
      .update({
        subscriptionType: planId,
        updatedAt: new Date().toISOString(),
      })
      .eq('ownerId', userId)
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
