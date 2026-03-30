import { getUserProfile } from '@/lib/auth/helpers'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { businessId } = await request.json()
  if (!businessId) {
    return NextResponse.json({ error: 'businessId required' }, { status: 400 })
  }

  // Get business with original data
  const { data: business } = await supabaseAdmin
    .from('Business')
    .select('id, ownerId, originalData')
    .eq('id', businessId)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  const now = new Date().toISOString()

  // Rollback business to original data if available
  const rollbackData: Record<string, unknown> = {
    ownerId: null,
    isClaimed: false,
    claimedAt: null,
    subscriptionType: 'free',
    template: 'minimal',
    updatedAt: now,
  }

  // Restore original fields if we saved them
  if (business.originalData) {
    const orig = business.originalData as Record<string, unknown>
    if (orig.name) rollbackData.name = orig.name
    if (orig.description !== undefined) rollbackData.description = orig.description
    if (orig.address !== undefined) rollbackData.address = orig.address
    if (orig.whatsappNumber !== undefined) rollbackData.whatsappNumber = orig.whatsappNumber
    if (orig.openingHours !== undefined) rollbackData.openingHours = orig.openingHours
    if (orig.imageUrl !== undefined) rollbackData.imageUrl = orig.imageUrl
  }

  await supabaseAdmin
    .from('Business')
    .update(rollbackData)
    .eq('id', businessId)

  // Downgrade user's plan if they have one
  if (business.ownerId) {
    await supabaseAdmin
      .from('UserProfile')
      .update({ planId: 'free', planExpiresAt: null })
      .eq('id', business.ownerId)

    // Mark their claims as rejected
    await supabaseAdmin
      .from('Claim')
      .update({ status: 'rejected', adminNote: 'Klaim dicabut oleh admin', updatedAt: now })
      .eq('businessId', businessId)
      .eq('userId', business.ownerId)
      .eq('status', 'approved')
  }

  return NextResponse.json({ ok: true })
}
