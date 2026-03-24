import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('UserProfile')
    .select('*, plan:Plan(*)')
    .eq('id', user.id)
    .single()

  return profile
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/auth/login')
  return user
}

export async function requireAdmin() {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'admin') redirect('/')
  return profile
}

/** Get the business claimed by the current user */
export async function getUserBusiness() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: business } = await supabase
    .from('Business')
    .select('*, products:Product(*), reviews:Review(*)')
    .eq('ownerId', user.id)
    .limit(1)
    .single()

  return business
}
