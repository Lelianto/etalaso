import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  // Verify auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user has a business
  const { data: business, error } = await supabaseAdmin
    .from('Business')
    .select('placeId')
    .eq('ownerId', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Check business error:', error)
    return NextResponse.json({ error: 'Gagal memeriksa profil bisnis' }, { status: 500 })
  }

  if (business) {
    return NextResponse.json({ hasBusinesses: true, placeId: business.placeId })
  }

  return NextResponse.json({ hasBusinesses: false })
}
