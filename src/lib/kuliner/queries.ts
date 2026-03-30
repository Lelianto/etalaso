import supabase from '@/lib/db/supabase'

export async function getKulinerStore(slug: string) {
  const sanitized = slug.replace(/[,()]/g, '')

  // Try customSlug first (pretty URL)
  const { data: bySlug } = await supabase
    .from('Business')
    .select('*, products:Product(*)')
    .eq('customSlug', sanitized)
    .eq('businessType', 'kuliner_rumahan')
    .limit(1)
    .single()

  if (bySlug) return bySlug

  // Try placeId
  const { data: byPlaceId } = await supabase
    .from('Business')
    .select('*, products:Product(*)')
    .eq('placeId', sanitized)
    .eq('businessType', 'kuliner_rumahan')
    .limit(1)
    .single()

  if (byPlaceId) return byPlaceId

  // Fallback: search by id
  const { data: byId } = await supabase
    .from('Business')
    .select('*, products:Product(*)')
    .eq('id', sanitized)
    .eq('businessType', 'kuliner_rumahan')
    .limit(1)
    .single()

  return byId
}

export async function getKulinerStores(limit = 20) {
  const { data, error } = await supabase
    .from('Business')
    .select('id, placeId, customSlug, name, tagline, areaNote, imageUrl, operatingDays, deliveryMethods, category, kecamatan, region')
    .eq('businessType', 'kuliner_rumahan')
    .eq('isClaimed', true)
    .order('createdAt', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[getKulinerStores]', error)
  }

  return data || []
}
