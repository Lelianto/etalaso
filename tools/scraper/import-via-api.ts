import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, lstatSync } from 'fs'
import { join } from 'path'
import 'dotenv/config'

// Initialize Supabase Client (Over HTTP/S - Port 443)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ScrapedPlace {
  place_id: string
  name: string
  address: string
  maps_url: string
  website: string | null
  opening_hours: string | null
  category: string
  kecamatan: string
  region: string
  latitude: number | null
  longitude: number | null
  google_types: string
  reviews: Array<{
    author: string
    rating: number
    text: string
    date: string
  }>
}

async function importToSupabase(place: ScrapedPlace) {
  // 1. Upsert Business
  const { data: businessData, error: businessError } = await supabase
    .from('Business')
    .upsert({
      placeId: place.place_id,
      name: place.name,
      address: place.address,
      mapsUrl: place.maps_url,
      category: place.category,
      openingHours: place.opening_hours,
      kecamatan: place.kecamatan,
      region: place.region,
      latitude: place.latitude,
      longitude: place.longitude,
      googleTypes: place.google_types,
      updatedAt: new Date().toISOString()
    }, { onConflict: 'placeId' })
    .select()

  if (businessError) {
    console.error(`❌ Error importing ${place.name}:`, businessError.message)
    return
  }

  const businessId = (businessData[0] as { id: string }).id

  // 2. Import Reviews
  if (place.reviews && place.reviews.length > 0) {
    const reviewsToInsert = place.reviews.map(r => ({
      author: r.author,
      rating: r.rating,
      text: r.text,
      date: r.date,
      businessId: businessId
    }))

    const { error: reviewsError } = await supabase
      .from('Review')
      .insert(reviewsToInsert)

    if (reviewsError) {
      console.warn(`      ⚠️ Warning: Could not import reviews for ${place.name}:`, reviewsError.message)
    }
  }

  console.log(`✅ Successfully imported ${place.name}`)
}

async function walkAndImport(dir: string) {
  const files = readdirSync(dir)
  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = lstatSync(fullPath)

    if (stat.isDirectory()) {
      await walkAndImport(fullPath)
    } else if (file === 'places.json') {
      const content = JSON.parse(readFileSync(fullPath, 'utf-8'))
      const places = content.places as ScrapedPlace[]
      for (const place of places) {
        if (!place.website) { // Only UMKM without website
          await importToSupabase(place)
        }
      }
    }
  }
}

async function main() {
  const seedDir = join(process.cwd(), 'tools/scraper/seed-data')
  console.log('🚀 Starting import to Supabase (via API)...')
  try {
    await walkAndImport(seedDir)
    console.log('🎉 ALL DONE!')
  } catch (error) {
    console.error('💥 Global import error:', error)
  }
}

main()
