import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { checkProfanity } from '@/lib/moderation'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

const RESERVED_SLUGS = new Set(['daftar', 'admin', 'api', 'dashboard', 'login', 'auth'])

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check user has UMKM+ tier
  const { data: profile } = await supabaseAdmin
    .from('UserProfile')
    .select('planId')
    .eq('id', user.id)
    .single()

  if (!profile || profile.planId === 'free') {
    return NextResponse.json({ error: 'Fitur ini memerlukan paket UMKM atau Business' }, { status: 403 })
  }

  // Get user's business
  const { data: business } = await supabaseAdmin
    .from('Business')
    .select('id, customSlug')
    .eq('ownerId', user.id)
    .limit(1)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Bisnis tidak ditemukan' }, { status: 404 })
  }

  const body = await request.json()
  const rawSlug = body.slug?.trim()

  if (!rawSlug) {
    return NextResponse.json({ error: 'Slug tidak boleh kosong' }, { status: 400 })
  }

  const slug = slugify(rawSlug)

  if (slug.length < 3) {
    return NextResponse.json({ error: 'Slug minimal 3 karakter' }, { status: 400 })
  }

  if (RESERVED_SLUGS.has(slug)) {
    return NextResponse.json({ error: 'Slug ini tidak tersedia' }, { status: 400 })
  }

  const badWord = checkProfanity(slug)
  if (badWord) {
    return NextResponse.json({ error: 'Slug mengandung kata yang tidak diperbolehkan' }, { status: 400 })
  }

  // Check uniqueness
  const { data: existing } = await supabaseAdmin
    .from('Business')
    .select('id')
    .eq('customSlug', slug)
    .neq('id', business.id)
    .limit(1)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Slug sudah digunakan bisnis lain' }, { status: 409 })
  }

  // Save
  const { error: updateError } = await supabaseAdmin
    .from('Business')
    .update({ customSlug: slug })
    .eq('id', business.id)

  if (updateError) {
    return NextResponse.json({ error: 'Gagal menyimpan slug' }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug })
}
