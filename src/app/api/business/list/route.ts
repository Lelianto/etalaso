import { NextResponse } from 'next/server'
import supabase from '@/lib/db/supabase'

const PAGE_SIZE = 30

function isCleanName(name: string): boolean {
  const letters = name.replace(/[^a-zA-Z0-9]/g, '')
  return letters.length >= 2
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const category = searchParams.get('category') || ''
  const kecamatan = searchParams.get('kecamatan') || ''
  const search = searchParams.get('q') || ''

  let query = supabase
    .from('Business')
    .select('placeId, name, address, category, kecamatan, region, whatsappNumber', { count: 'exact' })

  if (category) {
    query = query.eq('category', category)
  }
  if (kecamatan) {
    query = query.eq('kecamatan', kecamatan)
  }
  if (search.trim()) {
    query = query.ilike('name', `%${search.trim()}%`)
  }

  // Over-fetch to compensate for client-side dirty name filtering
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE + 9

  const { data, count, error } = await query
    .order('name')
    .range(from, to)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter out junk names (e.g. ".", ",,,,", single chars from scraping)
  const clean = (data || []).filter(b => isCleanName(b.name)).slice(0, PAGE_SIZE)

  return NextResponse.json({
    businesses: clean,
    total: count || 0,
    page,
    pageSize: PAGE_SIZE,
    hasMore: (count || 0) > from + PAGE_SIZE,
  })
}
