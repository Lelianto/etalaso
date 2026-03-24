import { getUserProfile } from '@/lib/auth/helpers'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { claimId, businessId, userId, action, note } = await request.json()

  if (action === 'approve') {
    // Update claim status
    await supabaseAdmin
      .from('Claim')
      .update({ status: 'approved', updatedAt: new Date().toISOString() })
      .eq('id', claimId)

    // Set business owner + isClaimed flag
    await supabaseAdmin
      .from('Business')
      .update({ ownerId: userId, isClaimed: true, updatedAt: new Date().toISOString() })
      .eq('id', businessId)

    // Reject other pending claims for the same business
    await supabaseAdmin
      .from('Claim')
      .update({ status: 'rejected', adminNote: 'Bisnis sudah diklaim oleh pengguna lain', updatedAt: new Date().toISOString() })
      .eq('businessId', businessId)
      .eq('status', 'pending')
      .neq('id', claimId)
  } else if (action === 'reject') {
    await supabaseAdmin
      .from('Claim')
      .update({ status: 'rejected', adminNote: note || null, updatedAt: new Date().toISOString() })
      .eq('id', claimId)
  }

  return NextResponse.json({ ok: true })
}
