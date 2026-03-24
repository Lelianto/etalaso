/**
 * scrape-places.ts
 * Scrapes Google Maps for places across Tangerang Raya (per kecamatan).
 *
 * Usage:
 *   npx tsx scrape-places.ts                          # All regions, all categories
 *   npx tsx scrape-places.ts --region=kota_tangerang   # One region only
 *   npx tsx scrape-places.ts --region=tangsel           # Kota Tangerang Selatan
 *   npx tsx scrape-places.ts --region=kab_tangerang     # Kabupaten Tangerang
 *   npx tsx scrape-places.ts --kecamatan=ciputat        # Single kecamatan
 *   npx tsx scrape-places.ts --category=kafe,restoran   # Filter categories
 *   npx tsx scrape-places.ts --list                     # List all kecamatan
 */

import { chromium, type Browser, type Page } from 'playwright'
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// ─── Types ─────────────────────────────────────────────────
type PlaceCategory =
  | 'kuliner' | 'jasa' | 'otomotif' | 'kecantikan'
  | 'retail' | 'kesehatan' | 'mall' | 'rumah_sakit'
  | 'klinik' | 'taman' | 'tempat_ibadah' | 'lainnya'

type RegionKey = 'kab_tangerang' | 'kota_tangerang' | 'tangsel'

interface Kecamatan {
  name: string
  region: RegionKey
  lat: number
  lng: number
}

interface ScrapedPlace {
  place_id: string
  name: string
  address: string
  maps_url: string
  website: string | null // NEW: business website
  opening_hours: string | null // NEW: jam operasional
  category: PlaceCategory
  kecamatan: string
  region: RegionKey
  latitude: number | null
  longitude: number | null
  google_types: string
  reviews: Array<{
    author: string
    rating: number
    text: string
    date: string
  }>
  category_conflict: boolean
}

interface SeedOutput {
  _meta: {
    scraped_at: string
    total_places: number
    region?: string
    kecamatan?: string
    by_category: Record<string, number>
    potential_duplicates: Array<{ a: string; b: string; distance_m: number }>
  }
  places: ScrapedPlace[]
}

// ─── Kecamatan Data ────────────────────────────────────────
const REGION_LABELS: Record<RegionKey, string> = {
  kab_tangerang: 'Kabupaten Tangerang',
  kota_tangerang: 'Kota Tangerang',
  tangsel: 'Kota Tangerang Selatan',
}

const KECAMATAN_LIST: Kecamatan[] = [
  // ── Kabupaten Tangerang (29 kecamatan) ──
  { name: 'Balaraja', region: 'kab_tangerang', lat: -6.2356, lng: 106.5350 },
  { name: 'Cikupa', region: 'kab_tangerang', lat: -6.2550, lng: 106.5080 },
  { name: 'Cisauk', region: 'kab_tangerang', lat: -6.3350, lng: 106.6300 },
  { name: 'Cisoka', region: 'kab_tangerang', lat: -6.2200, lng: 106.4700 },
  { name: 'Curug', region: 'kab_tangerang', lat: -6.2480, lng: 106.5680 },
  { name: 'Gunung Kaler', region: 'kab_tangerang', lat: -6.1750, lng: 106.4530 },
  { name: 'Jambe', region: 'kab_tangerang', lat: -6.3050, lng: 106.5100 },
  { name: 'Jayanti', region: 'kab_tangerang', lat: -6.2400, lng: 106.4500 },
  { name: 'Kelapa Dua', region: 'kab_tangerang', lat: -6.2800, lng: 106.6050 },
  { name: 'Kemiri', region: 'kab_tangerang', lat: -6.1700, lng: 106.5100 },
  { name: 'Kosambi', region: 'kab_tangerang', lat: -6.1150, lng: 106.6750 },
  { name: 'Kresek', region: 'kab_tangerang', lat: -6.1850, lng: 106.4370 },
  { name: 'Kronjo', region: 'kab_tangerang', lat: -6.1250, lng: 106.4700 },
  { name: 'Legok', region: 'kab_tangerang', lat: -6.3100, lng: 106.5800 },
  { name: 'Mauk', region: 'kab_tangerang', lat: -6.1000, lng: 106.5400 },
  { name: 'Mekar Baru', region: 'kab_tangerang', lat: -6.1150, lng: 106.4900 },
  { name: 'Pagedangan', region: 'kab_tangerang', lat: -6.3000, lng: 106.6300 },
  { name: 'Pakuhaji', region: 'kab_tangerang', lat: -6.1050, lng: 106.5850 },
  { name: 'Panongan', region: 'kab_tangerang', lat: -6.2550, lng: 106.5700 },
  { name: 'Pasar Kemis', region: 'kab_tangerang', lat: -6.2200, lng: 106.5550 },
  { name: 'Rajeg', region: 'kab_tangerang', lat: -6.1600, lng: 106.5650 },
  { name: 'Sepatan', region: 'kab_tangerang', lat: -6.1350, lng: 106.5900 },
  { name: 'Sepatan Timur', region: 'kab_tangerang', lat: -6.1500, lng: 106.6150 },
  { name: 'Sindang Jaya', region: 'kab_tangerang', lat: -6.2050, lng: 106.5250 },
  { name: 'Solear', region: 'kab_tangerang', lat: -6.2700, lng: 106.4900 },
  { name: 'Sukadiri', region: 'kab_tangerang', lat: -6.1200, lng: 106.5550 },
  { name: 'Sukamulya', region: 'kab_tangerang', lat: -6.1900, lng: 106.4850 },
  { name: 'Teluknaga', region: 'kab_tangerang', lat: -6.1000, lng: 106.6200 },
  { name: 'Tigaraksa', region: 'kab_tangerang', lat: -6.2800, lng: 106.5100 },

  // ── Kota Tangerang (13 kecamatan) ──
  { name: 'Batuceper', region: 'kota_tangerang', lat: -6.1700, lng: 106.6550 },
  { name: 'Benda', region: 'kota_tangerang', lat: -6.1500, lng: 106.6700 },
  { name: 'Cibodas', region: 'kota_tangerang', lat: -6.2200, lng: 106.6050 },
  { name: 'Ciledug', region: 'kota_tangerang', lat: -6.2350, lng: 106.7100 },
  { name: 'Cipondoh', region: 'kota_tangerang', lat: -6.2100, lng: 106.6550 },
  { name: 'Jatiuwung', region: 'kota_tangerang', lat: -6.2100, lng: 106.5800 },
  { name: 'Karang Tengah', region: 'kota_tangerang', lat: -6.2300, lng: 106.6800 },
  { name: 'Karawaci', region: 'kota_tangerang', lat: -6.2400, lng: 106.6150 },
  { name: 'Larangan', region: 'kota_tangerang', lat: -6.2450, lng: 106.7300 },
  { name: 'Neglasari', region: 'kota_tangerang', lat: -6.1700, lng: 106.6250 },
  { name: 'Periuk', region: 'kota_tangerang', lat: -6.1900, lng: 106.6050 },
  { name: 'Pinang', region: 'kota_tangerang', lat: -6.2500, lng: 106.6700 },
  { name: 'Tangerang', region: 'kota_tangerang', lat: -6.1950, lng: 106.6350 },

  // ── Kota Tangerang Selatan (7 kecamatan) ──
  { name: 'Ciputat', region: 'tangsel', lat: -6.3100, lng: 106.7400 },
  { name: 'Ciputat Timur', region: 'tangsel', lat: -6.3000, lng: 106.7600 },
  { name: 'Pamulang', region: 'tangsel', lat: -6.3400, lng: 106.7300 },
  { name: 'Pondok Aren', region: 'tangsel', lat: -6.2700, lng: 106.7100 },
  { name: 'Serpong', region: 'tangsel', lat: -6.3100, lng: 106.6600 },
  { name: 'Serpong Utara', region: 'tangsel', lat: -6.2750, lng: 106.6500 },
  { name: 'Setu', region: 'tangsel', lat: -6.3450, lng: 106.6800 },
]

// ─── Category Config ───────────────────────────────────────
const CATEGORIES: Array<{ category: PlaceCategory; queryTemplates: string[] }> = [
  // UMKM Focus
  { category: 'kuliner', queryTemplates: ['warung makan di {area}', 'depot makan {area}', 'mie ayam {area}', 'bakso {area}', 'kafe di {area}', 'cafe {area}', 'restoran di {area}'] },
  { category: 'jasa', queryTemplates: ['laundry di {area}', 'penjahit {area}', 'fotokopi {area}', 'sol sepatu {area}'] },
  { category: 'otomotif', queryTemplates: ['bengkel motor di {area}', 'bengkel mobil {area}', 'cuci motor {area}'] },
  { category: 'kecantikan', queryTemplates: ['salon di {area}', 'barbershop {area}', 'pangkas rambut {area}'] },
  { category: 'retail', queryTemplates: ['toko kelontong di {area}', 'kios {area}', 'butik {area}'] },
  
  // Big & Public Categories (Restored)
  { category: 'kesehatan', queryTemplates: ['apotek di {area}', 'klinik umum {area}'] },
  { category: 'rumah_sakit', queryTemplates: ['rumah sakit di {area}'] },
  { category: 'mall', queryTemplates: ['mall di {area}', 'pusat perbelanjaan {area}'] },
  { category: 'klinik', queryTemplates: ['klinik di {area}', 'klinik anak {area}'] },
  { category: 'taman', queryTemplates: ['taman di {area}', 'playground {area}'] },
  { category: 'tempat_ibadah', queryTemplates: ['masjid di {area}', 'gereja {area}'] },
  { category: 'lainnya', queryTemplates: ['toko pakan ternak {area}', 'toko bangunan {area}'] },
]

const SEED_DIR = join(__dirname, 'seed-data')

// ─── Utilities ─────────────────────────────────────────────
function delay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min) + min)
  return new Promise(resolve => setTimeout(resolve, ms))
}

function extractPlaceIdFromUrl(url: string): string | null {
  const chijMatch = url.match(/(ChIJ[A-Za-z0-9_-]+)/)
  if (chijMatch) return chijMatch[1]

  const hexMatch = url.match(/0x[0-9a-f]+:0x[0-9a-f]+/i)
  if (hexMatch) return hexMatch[0]

  return null
}

function extractLatLngFromUrl(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }

  const dMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
  if (dMatch) return { lat: parseFloat(dMatch[1]), lng: parseFloat(dMatch[2]) }

  return null
}

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function findDuplicates(places: ScrapedPlace[]): Array<{ a: string; b: string; distance_m: number }> {
  const dupes: Array<{ a: string; b: string; distance_m: number }> = []
  for (let i = 0; i < places.length; i++) {
    for (let j = i + 1; j < places.length; j++) {
      const a = places[i], b = places[j]
      if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) continue

      const dist = haversineDistance(a.latitude, a.longitude, b.latitude, b.longitude)
      if (dist < 100) {
        const nameA = a.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        const nameB = b.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (nameA.slice(0, 5) === nameB.slice(0, 5) || nameA.includes(nameB) || nameB.includes(nameA)) {
          dupes.push({ a: a.place_id, b: b.place_id, distance_m: Math.round(dist) })
        }
      }
    }
  }
  return dupes
}

function countByCategory(places: ScrapedPlace[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const p of places) {
    counts[p.category] = (counts[p.category] || 0) + 1
  }
  return counts
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

function kecamatanOutputDir(kec: Kecamatan): string {
  return join(SEED_DIR, kec.region, slugify(kec.name))
}

function savePartial(places: ScrapedPlace[], partialPath: string) {
  const output: SeedOutput = {
    _meta: {
      scraped_at: new Date().toISOString(),
      total_places: places.length,
      by_category: countByCategory(places),
      potential_duplicates: [],
    },
    places,
  }
  writeFileSync(partialPath, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`  💾 Partial save: ${places.length} places`)
}

function loadPartialIfExists(partialPath: string): ScrapedPlace[] {
  if (existsSync(partialPath)) {
    try {
      const data = JSON.parse(readFileSync(partialPath, 'utf-8')) as SeedOutput
      console.log(`📂 Loaded ${data.places.length} places from partial save`)
      return data.places
    } catch { /* ignore corrupt file */ }
  }
  return []
}

function buildQueries(kec: Kecamatan, categories: typeof CATEGORIES): Array<{ category: PlaceCategory; queries: string[] }> {
  // Use "Kecamatan Name, Region" as the area string for more specific results
  const regionLabel = REGION_LABELS[kec.region]
  const area = `${kec.name}, ${regionLabel}`

  return categories.map(({ category, queryTemplates }) => ({
    category,
    queries: queryTemplates.map(t => t.replace('{area}', area)),
  }))
}

// ─── CLI Argument Parsing ──────────────────────────────────
function parseArgs(): {
  regions: RegionKey[] | null
  kecamatanFilter: string[] | null
  categoryFilter: PlaceCategory[] | null
  listMode: boolean
} {
  const args = process.argv.slice(2)
  let regions: RegionKey[] | null = null
  let kecamatanFilter: string[] | null = null
  let categoryFilter: PlaceCategory[] | null = null
  let listMode = false

  for (const arg of args) {
    if (arg === '--list') {
      listMode = true
    } else if (arg.startsWith('--region=')) {
      regions = arg.replace('--region=', '').split(',').map(s => s.trim()) as RegionKey[]
    } else if (arg.startsWith('--kecamatan=')) {
      kecamatanFilter = arg.replace('--kecamatan=', '').split(',').map(s => s.trim().toLowerCase())
    } else if (arg.startsWith('--category=')) {
      categoryFilter = arg.replace('--category=', '').split(',').map(s => s.trim()) as PlaceCategory[]
    } else if (!arg.startsWith('--')) {
      // Legacy: treat bare arg as category filter
      categoryFilter = arg.split(',').map(s => s.trim()) as PlaceCategory[]
    }
  }

  return { regions, kecamatanFilter, categoryFilter, listMode }
}

function filterKecamatan(args: ReturnType<typeof parseArgs>): Kecamatan[] {
  let result = KECAMATAN_LIST

  if (args.regions) {
    result = result.filter(k => args.regions!.includes(k.region))
  }

  if (args.kecamatanFilter) {
    result = result.filter(k =>
      args.kecamatanFilter!.some(f => {
        const sf = slugify(f)
        return slugify(k.name).includes(sf) || slugify(k.name) === sf || k.name.toLowerCase().includes(f)
      })
    )
  }

  return result
}

// ─── Scraper ───────────────────────────────────────────────
async function scrollFeed(page: Page): Promise<string[]> {
  const links: Set<string> = new Set()

  const feedSelector = 'div[role="feed"]'
  try {
    await page.waitForSelector(feedSelector, { timeout: 10000 })
  } catch {
    try {
      await page.waitForSelector('div[role="main"]', { timeout: 5000 })
    } catch {
      return []
    }
  }

  let prevCount = 0
  let noNewResultsCount = 0
  const maxScrollAttempts = 30

  for (let i = 0; i < maxScrollAttempts; i++) {
    const newLinks = await page.$$eval(
      'a[href*="/maps/place/"]',
      (anchors: HTMLAnchorElement[]) => anchors.map(a => a.href)
    )
    for (const link of newLinks) links.add(link)

    if (links.size === prevCount) {
      noNewResultsCount++
      if (noNewResultsCount >= 3) break
    } else {
      noNewResultsCount = 0
    }
    prevCount = links.size

    await page.evaluate(() => {
      const feed = document.querySelector('div[role="feed"]') ||
        document.querySelector('div[role="main"] div[tabindex="-1"]')
      if (feed) feed.scrollTop = feed.scrollHeight
    })

    await page.keyboard.press('End')
    await delay(1500, 2500)

    const endReached = await page.evaluate(() => {
      const els = document.querySelectorAll('span, p, div')
      for (const el of els) {
        const text = (el as HTMLElement).innerText?.toLowerCase() || ''
        if (text.includes("you've reached the end") || text.includes('anda telah mencapai')) {
          return true
        }
      }
      return false
    })
    if (endReached) {
      console.log('    ✅ Reached end of results')
      break
    }
  }

  return Array.from(links)
}

async function scrapePlaceDetail(
  page: Page,
  url: string,
  category: PlaceCategory,
  kec: Kecamatan
): Promise<ScrapedPlace | null> {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await delay(1500, 3000)

    const hasCaptcha = await page.evaluate(() => {
      return document.body.innerText.includes('unusual traffic') ||
        document.body.innerText.includes('captcha') ||
        document.querySelector('iframe[src*="recaptcha"]') !== null
    })
    if (hasCaptcha) {
      console.log('    🚨 CAPTCHA detected! Stopping.')
      return null
    }

    await page.waitForSelector('h1', { timeout: 10000 })

    const name = await page.$eval('h1', (el: HTMLElement) => el.textContent?.trim() || '')
    if (!name) return null

    const address = await page.evaluate(() => {
      const addrButton = document.querySelector('button[data-item-id="address"]')
      if (addrButton) {
        const text = addrButton.querySelector('.fontBodyMedium')?.textContent?.trim()
        if (text) return text
      }

      const addrEl = document.querySelector('[data-item-id="address"] .fontBodyMedium') ||
        document.querySelector('button[aria-label*="Alamat"]') ||
        document.querySelector('button[aria-label*="Address"]')
      if (addrEl) {
        const label = addrEl.getAttribute('aria-label') || addrEl.textContent || ''
        return label.replace(/^(Alamat|Address):?\s*/i, '').trim()
      }

      const allButtons = document.querySelectorAll('button[data-item-id]')
      for (const btn of allButtons) {
        const id = btn.getAttribute('data-item-id') || ''
        if (id.startsWith('address') || id.includes('oloc')) {
          return btn.textContent?.trim() || ''
        }
      }

      return ''
    })

    const googleTypes = await page.evaluate(() => {
      const categoryBtn = document.querySelector('button[jsaction*="category"]')
      if (categoryBtn) return categoryBtn.textContent?.trim() || ''

      const spans = document.querySelectorAll('button.DkEaL')
      return Array.from(spans).map(s => s.textContent?.trim()).filter(Boolean).join(', ') || ''
    })

    const website = await page.evaluate(() => {
      const websiteLink = document.querySelector('a[data-item-id="authority"]') as HTMLAnchorElement
      return websiteLink ? websiteLink.href : null
    })

    const openingHours = await page.evaluate(() => {
      // Look for the hours button/div
      const hoursEl = document.querySelector('div[aria-label*="Hours"], div[aria-label*="Jam operasional"], button[aria-label*="Hours"], button[aria-label*="Jam operasional"], [data-item-id="oh"]')
      if (hoursEl) return hoursEl.getAttribute('aria-label')?.replace(/^(Hours|Jam operasional):?\s*/i, '').trim() || hoursEl.textContent?.trim() || null
      
      const table = document.querySelector('table.e26vgc')
      if (table) return table.textContent?.trim() || null
      
      const omEl = document.querySelector('div.OMl5r')
      if (omEl) return omEl.textContent?.trim() || null

      return null
    })

    const currentUrl = page.url()

    // ─── Scrape Reviews ─────────────────────────────────────
    let reviews: ScrapedPlace['reviews'] = []
    try {
      // Sort reviews by highest rating first
      const sortButton = await page.$('button[aria-label*="Sort"], button[aria-label*="Urutkan"], button[data-value="Sort"]')
      if (sortButton) {
        await sortButton.click()
        await delay(1000, 1500)
        // Click "Highest rating" / "Rating tertinggi"
        const highestOption = await page.$('li[data-index="2"], div[data-index="2"], [role="menuitemradio"]:nth-child(3)')
        if (highestOption) {
          await highestOption.click()
          await delay(2000, 3000)
        }
      }

      // Find and click the reviews tab (handle English and Indonesian)
      const reviewsTab = await page.$('button[role="tab"][aria-label*="Review"], button[role="tab"][aria-label*="Ulasan"]')
      if (reviewsTab) {
        await reviewsTab.click()
        await delay(2000, 3000)

        reviews = await page.evaluate(() => {
          // Google Maps review containers — use multiple selectors for resilience
          const items = document.querySelectorAll('div.jftiEf, div[jsaction*="review"], div[data-review-id]')
          const results: Array<{ author: string, rating: number, text: string, date: string }> = []

          for (const item of items) {
            if (results.length >= 5) break

            // Extract rating from any span with aria-label containing star info
            // Google uses formats like: "5 bintang", "5 stars", "Rated 5.0 out of 5"
            const ratingEl = item.querySelector('span[role="img"][aria-label], span[aria-label*="bintang"], span[aria-label*="star"]')
            const ratingLabel = ratingEl?.getAttribute('aria-label') || ''
            const ratingMatch = ratingLabel.match(/(\d)/)
            const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0

            if (rating !== 5) continue

            // Author — look for link to contributor profile or prominent name element
            const author = (
              item.querySelector('a[href*="/contrib/"]')?.textContent?.trim() ||
              item.querySelector('button[data-review-id] div, .d4r55, .d4r5ac')?.textContent?.trim() ||
              'Anonymous'
            )

            // Review text — multiple possible class names
            const text = (
              item.querySelector('.wiI7pd, .MyEned span, .review-full-text')?.textContent?.trim() || ''
            )

            // Date
            const date = (
              item.querySelector('.rsqaEd, .rsqa0f, span[class*="rsq"]')?.textContent?.trim() ||
              item.querySelector('.DU9Pgb')?.textContent?.trim() ||
              ''
            )

            if (text) {
              results.push({ author, rating: 5, text, date })
            }
          }
          return results
        })
      }
    } catch {
      console.log(`      ⚠️ Warning: Could not scrape reviews for ${name}`)
    }

    const latLng = extractLatLngFromUrl(currentUrl)
    const placeId = extractPlaceIdFromUrl(currentUrl) || `scraped_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}`

    return {
      place_id: placeId,
      name,
      address: address || '',
      maps_url: currentUrl,
      website, // NEW
      opening_hours: openingHours, // NEW
      category,
      kecamatan: kec.name,
      region: kec.region,
      latitude: latLng?.lat ?? null,
      longitude: latLng?.lng ?? null,
      google_types: googleTypes,
      reviews, // NEW
      category_conflict: false,
    }
  } catch (err) {
    console.log(`    ❌ Error scraping ${url}: ${(err as Error).message}`)
    return null
  }
}

// ─── Scrape One Kecamatan ──────────────────────────────────
async function scrapeKecamatan(
  page: Page,
  kec: Kecamatan,
  searchQueries: Array<{ category: PlaceCategory; queries: string[] }>
): Promise<{ places: ScrapedPlace[]; captchaHit: boolean }> {
  const outDir = kecamatanOutputDir(kec)
  mkdirSync(outDir, { recursive: true })

  const partialPath = join(outDir, 'places-partial.json')
  const allPlaces: ScrapedPlace[] = loadPartialIfExists(partialPath)
  const visitedUrls = new Set(allPlaces.map(p => p.maps_url))
  const visitedIds = new Set(allPlaces.map(p => p.place_id))

  let captchaHit = false

  for (const { category, queries: categoryQueries } of searchQueries) {
    if (captchaHit) break

    for (const query of categoryQueries) {
      if (captchaHit) break

      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${kec.lat},${kec.lng},14z`
      console.log(`\n🔍 [${kec.name} / ${category}] "${query}"`)
      console.log(`   URL: ${searchUrl}`)

      try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
        await delay(2000, 4000)

        try {
          const consentBtn = await page.$('button[aria-label*="Accept"], button[aria-label*="Terima"], form[action*="consent"] button')
          if (consentBtn) await consentBtn.click()
        } catch { /* no consent banner */ }

        const placeLinks = await scrollFeed(page)
        console.log(`   📍 Found ${placeLinks.length} place links`)

        let newCount = 0
        for (const link of placeLinks) {
          if (captchaHit) break
          if (visitedUrls.has(link)) continue

          const linkId = extractPlaceIdFromUrl(link)
          if (linkId && visitedIds.has(linkId)) {
            visitedUrls.add(link)
            continue
          }

          const place = await scrapePlaceDetail(page, link, category, kec)

          if (place === null) {
            const isCaptcha = await page.evaluate(() =>
              document.body.innerText.includes('unusual traffic')
            ).catch(() => false)
            if (isCaptcha) {
              captchaHit = true
              console.log('\n🚨 CAPTCHA hit — saving partial results and exiting.')
              break
            }
            continue
          }

          // NEW: Skip businesses that already have a website
          if (place.website) {
            console.log(`   ⏭️ Skipping ${place.name} (Already has website: ${place.website})`)
            visitedUrls.add(link)
            visitedIds.add(place.place_id)
            continue
          }

          if (visitedIds.has(place.place_id)) {
            visitedUrls.add(link)
            continue
          }

          visitedIds.add(place.place_id)
          visitedUrls.add(link)
          visitedUrls.add(place.maps_url)
          allPlaces.push(place)
          newCount++
          console.log(`   ✅ ${place.name} (${place.place_id.slice(0, 12)}...)`)

          if (allPlaces.length % 1 === 0) {
            savePartial(allPlaces, partialPath)
          }

          await delay(2000, 5000)
        }

        console.log(`   ➕ ${newCount} new places added (total: ${allPlaces.length})`)
      } catch (err) {
        console.log(`   ❌ Error with query "${query}": ${(err as Error).message}`)
      }

      await delay(10000, 20000)

      // Incremental save after each place
      saveIncremental(allPlaces, outDir, kec)
    }
  }

  // Save kecamatan results
  const duplicates = findDuplicates(allPlaces)

  // Per-category files
  const categoriesInResult = [...new Set(allPlaces.map(p => p.category))] as PlaceCategory[]
  for (const cat of categoriesInResult) {
    const catPlaces = allPlaces.filter(p => p.category === cat)
    const catDupes = findDuplicates(catPlaces)
    const catOutput: SeedOutput = {
      _meta: {
        scraped_at: new Date().toISOString(),
        total_places: catPlaces.length,
        kecamatan: kec.name,
        region: REGION_LABELS[kec.region],
        by_category: { [cat]: catPlaces.length },
        potential_duplicates: catDupes,
      },
      places: catPlaces,
    }
    writeFileSync(join(outDir, `places-${cat}.json`), JSON.stringify(catOutput, null, 2), 'utf-8')
  }

  // Combined kecamatan file
  const output: SeedOutput = {
    _meta: {
      scraped_at: new Date().toISOString(),
      total_places: allPlaces.length,
      kecamatan: kec.name,
      region: REGION_LABELS[kec.region],
      by_category: countByCategory(allPlaces),
      potential_duplicates: duplicates,
    },
    places: allPlaces,
  }
  writeFileSync(join(outDir, 'places.json'), JSON.stringify(output, null, 2), 'utf-8')

  if (duplicates.length > 0) {
    console.log(`   ⚠️  ${duplicates.length} potential duplicates in ${kec.name}`)
  }

  return { places: allPlaces, captchaHit }
}

function saveIncremental(allPlaces: ScrapedPlace[], outDir: string, kec: Kecamatan) {
  const duplicates = findDuplicates(allPlaces)
  const output: SeedOutput = {
    _meta: {
      scraped_at: new Date().toISOString(),
      total_places: allPlaces.length,
      kecamatan: kec.name,
      region: REGION_LABELS[kec.region],
      by_category: countByCategory(allPlaces),
      potential_duplicates: duplicates,
    },
    places: allPlaces,
  }
  writeFileSync(join(outDir, 'places.json'), JSON.stringify(output, null, 2), 'utf-8')
}

// ─── Main ──────────────────────────────────────────────────
async function main() {
  const args = parseArgs()

  // List mode
  if (args.listMode) {
    console.log('\n📋 Daftar Kecamatan Tangerang Raya:\n')
    for (const regionKey of Object.keys(REGION_LABELS) as RegionKey[]) {
      const kecs = KECAMATAN_LIST.filter(k => k.region === regionKey)
      console.log(`  ${REGION_LABELS[regionKey]} (${kecs.length} kecamatan):`)
      for (const k of kecs) {
        console.log(`    - ${k.name} (${k.lat}, ${k.lng})`)
      }
      console.log()
    }
    console.log(`Total: ${KECAMATAN_LIST.length} kecamatan`)
    return
  }

  // Filter kecamatan
  const targetKecamatan = filterKecamatan(args)
  if (targetKecamatan.length === 0) {
    console.error('❌ No kecamatan matched your filter.')
    console.error('   Use --list to see available kecamatan.')
    process.exit(1)
  }

  // Filter categories
  const categories = args.categoryFilter
    ? CATEGORIES.filter(c => args.categoryFilter!.includes(c.category))
    : CATEGORIES

  if (categories.length === 0) {
    console.error(`❌ No matching categories.`)
    console.error(`   Available: ${CATEGORIES.map(c => c.category).join(', ')}`)
    process.exit(1)
  }

  console.log(`🚀 Google Maps Scraper — Tangerang Raya`)
  console.log(`   Kecamatan: ${targetKecamatan.length} target(s)`)
  console.log(`   Categories: ${categories.map(c => c.category).join(', ')}`)
  console.log(`   Target list: ${targetKecamatan.map(k => k.name).join(', ')}\n`)

  mkdirSync(SEED_DIR, { recursive: true })

  const browser: Browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  })

  const allScrapedPlaces: ScrapedPlace[] = []
  let globalCaptcha = false

  for (const kec of targetKecamatan) {
    if (globalCaptcha) break

    console.log(`\n${'═'.repeat(60)}`)
    console.log(`📍 Kecamatan: ${kec.name} — ${REGION_LABELS[kec.region]}`)
    console.log(`   Center: ${kec.lat}, ${kec.lng}`)
    console.log(`${'═'.repeat(60)}`)

    const context = await browser.newContext({
      locale: 'id-ID',
      geolocation: { latitude: kec.lat, longitude: kec.lng },
      permissions: ['geolocation'],
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    })

    const page = await context.newPage()
    page.on('dialog', async (dialog) => { await dialog.accept() })

    const queries = buildQueries(kec, categories)
    const { places, captchaHit } = await scrapeKecamatan(page, kec, queries)
    allScrapedPlaces.push(...places)

    await context.close()

    if (captchaHit) {
      globalCaptcha = true
      console.log('\n🚨 CAPTCHA — stopping. Run again to resume from partial saves.')
    }

    // Delay between kecamatan to avoid detection
    if (!globalCaptcha && targetKecamatan.indexOf(kec) < targetKecamatan.length - 1) {
      console.log('\n⏳ Waiting before next kecamatan...')
      await delay(15000, 30000)
    }
  }

  await browser.close()

  // ─── Save regional summary files ────────────────────────
  const regionsInResult = [...new Set(allScrapedPlaces.map(p => p.region))] as RegionKey[]
  for (const regionKey of regionsInResult) {
    const regionPlaces = allScrapedPlaces.filter(p => p.region === regionKey)
    const regionDupes = findDuplicates(regionPlaces)
    const regionOutput: SeedOutput = {
      _meta: {
        scraped_at: new Date().toISOString(),
        total_places: regionPlaces.length,
        region: REGION_LABELS[regionKey],
        by_category: countByCategory(regionPlaces),
        potential_duplicates: regionDupes,
      },
      places: regionPlaces,
    }
    const regionDir = join(SEED_DIR, regionKey)
    mkdirSync(regionDir, { recursive: true })
    writeFileSync(join(regionDir, 'places-all.json'), JSON.stringify(regionOutput, null, 2), 'utf-8')
    console.log(`\n📁 ${REGION_LABELS[regionKey]}: ${regionPlaces.length} places → ${regionKey}/places-all.json`)
  }

  // Global combined
  const globalDupes = findDuplicates(allScrapedPlaces)
  const globalOutput: SeedOutput = {
    _meta: {
      scraped_at: new Date().toISOString(),
      total_places: allScrapedPlaces.length,
      by_category: countByCategory(allScrapedPlaces),
      potential_duplicates: globalDupes,
    },
    places: allScrapedPlaces,
  }
  writeFileSync(join(SEED_DIR, 'places-all.json'), JSON.stringify(globalOutput, null, 2), 'utf-8')

  console.log(`\n✅ Done! ${allScrapedPlaces.length} places total across ${targetKecamatan.length} kecamatan`)
  console.log('   Combined → seed-data/places-all.json')
  console.log('   By category:', JSON.stringify(globalOutput._meta.by_category, null, 2))
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
