/**
 * import-via-api.ts
 * Import scraped places to Supabase.
 *
 * Usage:
 *   npx tsx tools/scraper/import-via-api.ts                          # Import ALL seed-data
 *   npx tsx tools/scraper/import-via-api.ts --path=kab_tangerang/balaraja  # Specific folder
 *   npx tsx tools/scraper/import-via-api.ts --region=tangsel          # One region
 *   npx tsx tools/scraper/import-via-api.ts --dry-run                 # Preview only
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, lstatSync, existsSync } from 'fs'
import { join } from 'path'
import 'dotenv/config'

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

let importedCount = 0
let skippedCount = 0
let errorCount = 0

async function importPlace(place: ScrapedPlace, dryRun: boolean) {
  if (dryRun) {
    console.log(`  [DRY] ${place.name} (${place.kecamatan}, ${place.category})`)
    importedCount++
    return
  }

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
      updatedAt: new Date().toISOString(),
    }, { onConflict: 'placeId' })
    .select('id')

  if (businessError) {
    console.error(`  ❌ ${place.name}: ${businessError.message}`)
    errorCount++
    return
  }

  const businessId = businessData[0]?.id
  if (!businessId) {
    console.error(`  ❌ ${place.name}: no ID returned`)
    errorCount++
    return
  }

  // 2. Upsert Reviews — delete old ones first to avoid duplicates
  if (place.reviews && place.reviews.length > 0) {
    await supabase.from('Review').delete().eq('businessId', businessId)

    const { error: reviewsError } = await supabase
      .from('Review')
      .insert(place.reviews.map(r => ({
        author: r.author,
        rating: r.rating,
        text: r.text,
        date: r.date,
        businessId,
      })))

    if (reviewsError) {
      console.warn(`  ⚠️ Reviews for ${place.name}: ${reviewsError.message}`)
    }
  }

  importedCount++
}

async function importFile(filePath: string, dryRun: boolean) {
  const content = JSON.parse(readFileSync(filePath, 'utf-8'))
  const places = (content.places as ScrapedPlace[]).filter(p => !p.website)

  console.log(`\n📄 ${filePath}`)
  console.log(`   ${content.places.length} total, ${places.length} tanpa website (UMKM)`)

  // Batch in groups of 10 for rate limiting
  for (let i = 0; i < places.length; i++) {
    await importPlace(places[i], dryRun)

    if (!dryRun && (i + 1) % 50 === 0) {
      console.log(`   ... ${i + 1}/${places.length}`)
    }
  }
}

function findPlacesFiles(dir: string): string[] {
  const results: string[] = []
  if (!existsSync(dir)) return results

  const files = readdirSync(dir)
  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = lstatSync(fullPath)

    if (stat.isDirectory()) {
      results.push(...findPlacesFiles(fullPath))
    } else if (file === 'places.json') {
      results.push(fullPath)
    }
  }
  return results
}

function parseArgs() {
  const args = process.argv.slice(2)
  let path: string | null = null
  let region: string | null = null
  let dryRun = false

  for (const arg of args) {
    if (arg === '--dry-run') dryRun = true
    else if (arg.startsWith('--path=')) path = arg.replace('--path=', '')
    else if (arg.startsWith('--region=')) region = arg.replace('--region=', '')
  }

  return { path, region, dryRun }
}

async function main() {
  const args = parseArgs()
  const seedDir = join(process.cwd(), 'tools/scraper/seed-data')

  let targetDir = seedDir
  if (args.path) {
    targetDir = join(seedDir, args.path)
  } else if (args.region) {
    targetDir = join(seedDir, args.region)
  }

  if (!existsSync(targetDir)) {
    console.error(`❌ Directory not found: ${targetDir}`)
    process.exit(1)
  }

  const files = findPlacesFiles(targetDir)
  if (files.length === 0) {
    console.error(`❌ No places.json files found in: ${targetDir}`)
    process.exit(1)
  }

  console.log(`🚀 Import to Supabase${args.dryRun ? ' (DRY RUN)' : ''}`)
  console.log(`   Target: ${targetDir}`)
  console.log(`   Files: ${files.length} places.json found`)

  for (const file of files) {
    await importFile(file, args.dryRun)
  }

  console.log(`\n✅ Done!`)
  console.log(`   Imported: ${importedCount}`)
  console.log(`   Skipped:  ${skippedCount}`)
  console.log(`   Errors:   ${errorCount}`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
