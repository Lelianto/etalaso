import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { VALID_KECAMATAN, KECAMATAN_LIST } from '@/lib/constants/regions'
import { VALID_SUBCATEGORIES } from '@/lib/kuliner/constants'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user already has a business
  const { data: existing } = await supabaseAdmin
    .from('Business')
    .select('id')
    .eq('ownerId', user.id)
    .limit(1)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Anda sudah memiliki bisnis terdaftar' }, { status: 400 })
  }

  const body = await request.json()
  const { name, tagline, whatsappNumber, kecamatan, address, defaultSubcategory, deliveryMethods, operatingDays, description } = body

  // Validate required fields
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Nama usaha wajib diisi' }, { status: 400 })
  }
  if (!whatsappNumber || typeof whatsappNumber !== 'string' || !whatsappNumber.trim()) {
    return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi' }, { status: 400 })
  }
  // Normalize: 08xx → 628xx, +628xx → 628xx
  let normalizedWa = whatsappNumber.trim().replace(/[\s\-+]/g, '')
  if (normalizedWa.startsWith('08')) {
    normalizedWa = '62' + normalizedWa.slice(1)
  }
  if (!kecamatan || !VALID_KECAMATAN.has(kecamatan)) {
    return NextResponse.json({ error: 'Kecamatan tidak valid' }, { status: 400 })
  }
  const subcategories = Array.isArray(defaultSubcategory) ? defaultSubcategory : (defaultSubcategory ? [defaultSubcategory] : [])
  if (subcategories.length === 0) {
    return NextResponse.json({ error: 'Pilih minimal 1 jenis makanan' }, { status: 400 })
  }
  if (subcategories.some((s: string) => !VALID_SUBCATEGORIES.has(s))) {
    return NextResponse.json({ error: 'Jenis makanan tidak valid' }, { status: 400 })
  }
  if (!Array.isArray(deliveryMethods) || deliveryMethods.length === 0) {
    return NextResponse.json({ error: 'Pilih minimal 1 metode pengiriman' }, { status: 400 })
  }
  if (!Array.isArray(operatingDays) || operatingDays.length === 0) {
    return NextResponse.json({ error: 'Pilih minimal 1 hari operasional' }, { status: 400 })
  }

  const kecData = KECAMATAN_LIST.find(k => k.name === kecamatan)
  const region = kecData?.region || 'kab_tangerang'
  const placeId = `kuliner-${crypto.randomUUID()}`

  // Create business with kuliner_rumahan type and auto-assign UMKM tier
  const { error: insertError } = await supabaseAdmin
    .from('Business')
    .insert({
      placeId,
      name: name.trim(),
      category: 'kuliner_rumahan',
      businessType: 'kuliner_rumahan',
      tagline: tagline?.trim() || null,
      address: address?.trim() || null,
      kecamatan,
      region,
      whatsappNumber: normalizedWa,
      description: description?.trim() || null,
      deliveryMethods,
      operatingDays,
      defaultSubcategory: subcategories.length > 0 ? subcategories.join(',') : null,
      isClaimed: true,
      ownerId: user.id,
      template: 'minimal',
      subscriptionType: 'umkm',
    })

  if (insertError) {
    console.error('Kuliner registration error:', insertError)
    return NextResponse.json({ error: 'Gagal mendaftarkan usaha' }, { status: 500 })
  }

  // Update user profile to UMKM plan
  await supabaseAdmin
    .from('UserProfile')
    .update({ planId: 'umkm' })
    .eq('id', user.id)

  return NextResponse.json({ success: true })
}
