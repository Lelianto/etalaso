import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { businessId, planId, proofUrl } = await request.json()
  if (!businessId) {
    return NextResponse.json({ error: 'businessId required' }, { status: 400 })
  }

  // Check business exists and is unclaimed
  const { data: business } = await supabaseAdmin
    .from('Business')
    .select('id, name, address, description, category, whatsappNumber, openingHours, imageUrl, isClaimed, ownerId')
    .eq('id', businessId)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  if (business.isClaimed && business.ownerId) {
    return NextResponse.json({ error: 'Business already claimed' }, { status: 409 })
  }

  // Check for existing pending claim
  const { data: existingClaim } = await supabaseAdmin
    .from('Claim')
    .select('id')
    .eq('businessId', businessId)
    .eq('userId', user.id)
    .eq('status', 'pending')
    .single()

  if (existingClaim) {
    return NextResponse.json({ error: 'Claim already pending' }, { status: 409 })
  }

  const isPaid = planId && planId !== 'free'
  const now = new Date().toISOString()

  // Save original business data before any changes
  const originalData = {
    name: business.name,
    address: business.address,
    description: business.description,
    category: business.category,
    whatsappNumber: business.whatsappNumber,
    openingHours: business.openingHours,
    imageUrl: business.imageUrl,
  }

  if (isPaid) {
    // Paid plan: create claim with pending status (needs admin review for payment)
    const { error: claimErr } = await supabaseAdmin.from('Claim').insert({
      businessId,
      userId: user.id,
      message: `Paket: ${planId}`,
      status: 'pending',
    })

    if (claimErr) {
      return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 })
    }

    // Create payment record if proof provided
    if (proofUrl) {
      const { data: planData } = await supabaseAdmin
        .from('Plan')
        .select('price')
        .eq('id', planId)
        .single()

      await supabaseAdmin.from('Payment').insert({
        userId: user.id,
        planId,
        amount: planData?.price || 0,
        proof_url: proofUrl,
      })
    }

    return NextResponse.json({ ok: true, autoApproved: false })
  }

  // FREE plan: auto-approve immediately
  // 1. Create claim as approved
  await supabaseAdmin.from('Claim').insert({
    businessId,
    userId: user.id,
    message: 'Paket: Gratis (auto-approved)',
    status: 'approved',
  })

  // 2. Set business owner + save original data
  await supabaseAdmin
    .from('Business')
    .update({
      ownerId: user.id,
      isClaimed: true,
      claimedAt: now,
      originalData,
      subscriptionType: 'umkm', // Free trial gives UMKM access
      updatedAt: now,
    })
    .eq('id', businessId)

  // 3. Set user plan to UMKM with 7-day trial
  const trialEnd = new Date()
  trialEnd.setDate(trialEnd.getDate() + 7)

  await supabaseAdmin
    .from('UserProfile')
    .update({
      planId: 'umkm',
      planExpiresAt: trialEnd.toISOString(),
    })
    .eq('id', user.id)

  // 4. Reject other pending claims for same business
  await supabaseAdmin
    .from('Claim')
    .update({ status: 'rejected', adminNote: 'Bisnis sudah diklaim (auto-approved)', updatedAt: now })
    .eq('businessId', businessId)
    .eq('status', 'pending')

  return NextResponse.json({ ok: true, autoApproved: true, trialEndsAt: trialEnd.toISOString() })
}
