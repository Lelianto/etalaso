import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { VALID_CATEGORIES, VALID_KECAMATAN, KECAMATAN_LIST } from '@/lib/constants/regions'

export async function POST(request: Request) {
  // Verify auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, category, kecamatan, whatsappNumber } = body

  // Validate required fields
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Nama bisnis wajib diisi' }, { status: 400 })
  }
  if (!category || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: 'Kategori tidak valid' }, { status: 400 })
  }
  if (!whatsappNumber || typeof whatsappNumber !== 'string' || !whatsappNumber.trim()) {
    return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi' }, { status: 400 })
  }

  // Validate kecamatan if provided
  if (kecamatan && !VALID_KECAMATAN.has(kecamatan)) {
    return NextResponse.json({ error: 'Kecamatan tidak valid' }, { status: 400 })
  }

  // Resolve region from kecamatan
  let region = 'kab_tangerang' // Default region
  if (kecamatan) {
    const kecData = KECAMATAN_LIST.find(k => k.name === kecamatan)
    region = kecData?.region || 'kab_tangerang'
  }

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
      kecamatan: kecamatan?.trim() || null,
      region,
      googleMapsUrl: null,
      whatsappNumber: whatsappNumber.trim(),
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
    return NextResponse.json({ error: 'Gagal mendaftarkan bisnis' }, { status: 500 })
  }

  return NextResponse.json({ placeId: business.placeId })
}
