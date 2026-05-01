import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { VALID_CATEGORIES } from '@/lib/constants/regions'

export async function POST(request: Request) {
  // Verify auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, category, whatsappNumber } = body

  // Validate required fields
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Nama bisnis wajib diisi' }, { status: 400 })
  }
  if (!category || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: 'Kategori tidak valid' }, { status: 400 })
  }
  // Validate and normalize WhatsApp number
  if (!whatsappNumber || typeof whatsappNumber !== 'string' || !whatsappNumber.trim()) {
    return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi' }, { status: 400 })
  }

  // Normalize phone number: remove spaces and special characters
  let normalizedPhone = whatsappNumber.trim().replace(/[^0-9]/g, '')

  // Convert 0 prefix to 62
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = '62' + normalizedPhone.slice(1)
  }

  // Validate format (should be 62 + 9-12 digits for Indonesia)
  if (!/^62\d{9,12}$/.test(normalizedPhone)) {
    return NextResponse.json({ error: 'Nomor WhatsApp tidak valid' }, { status: 400 })
  }

  // Default region
  const region = 'kab_tangerang'

  // Generate unique placeId
  const placeId = `self-${crypto.randomUUID()}`

  // Insert business
  const { data: business, error } = await supabaseAdmin
    .from('Business')
    .insert({
      placeId,
      name: name.trim(),
      category,
      address: null,
      kecamatan: null,
      region,
      mapsUrl: null,
      whatsappNumber: normalizedPhone,
      openingHours: null,
      description: null,
      isClaimed: true,
      ownerId: user.id,
      template: 'minimal',
      subscriptionType: 'free',
    })
    .select('placeId')
    .single()

  if (error) {
    console.error('Business registration error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json({ 
      error: 'Gagal mendaftarkan bisnis',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }

  return NextResponse.json({ placeId: business.placeId })
}
