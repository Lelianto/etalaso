import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * Check if user's subscription has expired and downgrade if needed.
 * Call this on dashboard access for instant feedback.
 * Returns the effective planId.
 */
export async function checkAndDowngradeIfExpired(userId: string): Promise<string> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('UserProfile')
    .select('planId, planExpiresAt')
    .eq('id', userId)
    .single()

  if (!profile || profile.planId === 'free') return profile?.planId || 'free'

  // Not expired yet
  if (!profile.planExpiresAt || new Date(profile.planExpiresAt) > new Date()) {
    return profile.planId
  }

  // Expired — downgrade
  await supabaseAdmin
    .from('UserProfile')
    .update({ planId: 'free', planExpiresAt: null })
    .eq('id', userId)

  await supabaseAdmin
    .from('Business')
    .update({
      subscriptionType: 'free',
      template: 'minimal',
      updatedAt: new Date().toISOString(),
    })
    .eq('ownerId', userId)

  return 'free'
}
