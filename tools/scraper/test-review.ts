/**
 * Quick test: scrape reviews from a single Google Maps place
 * Copies Chrome Profile 4 cookies to a fresh Playwright context
 *
 * Usage: npx tsx tools/scraper/test-review.ts
 */
import { chromium } from 'playwright'
import { writeFileSync, cpSync, mkdtempSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const TEST_URL = 'https://www.google.com/maps/place/Sambalado+Nusantara/@-6.3358333,106.7522257,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69ef2131a711a1:0x54bf284ab4279c09!8m2!3d-6.3358333!4d106.7522257!16s%2Fg%2F11mt2xzgdr'

function delay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min) + min)
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  // Copy Chrome profile to a temp dir so Playwright can use it without conflicts
  const sourceProfile = '/Users/leliantopradana/Library/Application Support/Google/Chrome'
  const tempDir = mkdtempSync(join(tmpdir(), 'chrome-pw-'))

  console.log('📂 Copying Chrome profile to temp dir...')
  // Only copy the essential profile data (cookies, login state)
  cpSync(join(sourceProfile, 'Profile 4'), join(tempDir, 'Default'), { recursive: true })
  cpSync(join(sourceProfile, 'Local State'), join(tempDir, 'Local State'))
  console.log(`✅ Profile copied to ${tempDir}`)

  const browser = await chromium.launchPersistentContext(tempDir, {
    headless: false,
    channel: 'chrome',
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
    ],
    viewport: { width: 1280, height: 800 },
  })
  console.log('✅ Chrome launched with copied profile')

  const page = await browser.newPage()

  console.log('🔗 Opening place page...')
  await page.goto(TEST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await delay(3000, 5000)

  const name = await page.$eval('h1', (el: HTMLElement) => el.textContent?.trim() || '')
  console.log(`📍 Place: ${name}`)

  await page.screenshot({ path: join(__dirname, 'debug-01-initial.png') })
  console.log('📸 debug-01-initial.png')

  // Scroll side panel to find reviews section
  console.log('📜 Scrolling side panel...')
  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => {
      const scrollable = document.querySelector('div.m6QErb.DxyBCb.kA9KIf.dS8AEf') ||
        document.querySelector('div[role="main"] div.m6QErb') ||
        document.querySelector('div.m6QErb')
      if (scrollable) scrollable.scrollTop += 500
    })
    await delay(600, 1000)
  }

  await page.screenshot({ path: join(__dirname, 'debug-02-scrolled.png') })
  console.log('📸 debug-02-scrolled.png')

  // Check page state
  const pageState = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]')).map(t => ({
      text: t.textContent?.trim()?.slice(0, 50),
      ariaLabel: t.getAttribute('aria-label')?.slice(0, 50),
    }))
    const reviewContainers = document.querySelectorAll('div.jftiEf').length
    const limitedView = document.body.innerText.includes('tampilan terbatas')
    return { tabs, reviewContainers, limitedView }
  })
  console.log('📊 Page state:', JSON.stringify(pageState, null, 2))

  // Click reviews tab if found
  const reviewsTab = await page.$('button[role="tab"][aria-label*="Review"], button[role="tab"][aria-label*="Ulasan"]')
  if (reviewsTab) {
    console.log('✅ Found reviews tab, clicking...')
    await reviewsTab.click()
    await delay(3000, 4000)
  } else {
    console.log('⚠️ No reviews tab — trying review count link...')
    const reviewCount = await page.$('span:has-text("ulasan"), button:has-text("ulasan")')
    if (reviewCount) {
      await reviewCount.click()
      await delay(3000, 4000)
    }
  }

  await page.screenshot({ path: join(__dirname, 'debug-03-reviews.png') })
  console.log('📸 debug-03-reviews.png')

  // Scroll reviews section
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      const scrollable = document.querySelector('div.m6QErb.DxyBCb.kA9KIf.dS8AEf') ||
        document.querySelector('div.m6QErb')
      if (scrollable) scrollable.scrollTop += 500
    })
    await delay(800, 1200)
  }

  await page.screenshot({ path: join(__dirname, 'debug-04-loaded.png') })
  console.log('📸 debug-04-loaded.png')

  // Debug review containers
  const debugReviews = await page.evaluate(() => {
    const items = document.querySelectorAll('div.jftiEf')
    const samples: Array<{
      stars: string[]
      authorText: string
      bodyText: string
      dateText: string
    }> = []

    for (let i = 0; i < Math.min(items.length, 5); i++) {
      const item = items[i]
      const stars = Array.from(item.querySelectorAll('span[aria-label]'))
        .map(el => el.getAttribute('aria-label') || '')
        .filter(l => l.includes('bintang') || l.includes('star'))

      const authorText = item.querySelector('a[href*="/contrib/"], .d4r55, .d4r5ac')?.textContent?.trim() || ''
      const bodyText = item.querySelector('.wiI7pd, .MyEned')?.textContent?.trim()?.slice(0, 100) || ''
      const dateText = item.querySelector('.rsqaEd, .rsqa0f')?.textContent?.trim() || ''

      samples.push({ stars, authorText, bodyText, dateText })
    }

    return { total: items.length, samples }
  })
  console.log('📊 Review containers:', JSON.stringify(debugReviews, null, 2))

  // Extract 5-star reviews
  const reviews = await page.evaluate(() => {
    const items = document.querySelectorAll('div.jftiEf')
    const results: Array<{ author: string, rating: number, text: string, date: string }> = []

    for (const item of items) {
      if (results.length >= 5) break

      const ratingEl = item.querySelector('span[role="img"][aria-label], span[aria-label*="bintang"], span[aria-label*="star"]')
      const ratingLabel = ratingEl?.getAttribute('aria-label') || ''
      const ratingMatch = ratingLabel.match(/(\d)/)
      const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0

      if (rating !== 5) continue

      const author = (
        item.querySelector('a[href*="/contrib/"]')?.textContent?.trim() ||
        item.querySelector('.d4r55, .d4r5ac')?.textContent?.trim() ||
        'Anonymous'
      )
      const text = (
        item.querySelector('.wiI7pd, .MyEned span, .review-full-text')?.textContent?.trim() || ''
      )
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

  console.log(`\n⭐ Extracted ${reviews.length} five-star reviews:`)
  for (const r of reviews) {
    console.log(`  - ${r.author} (${r.date}): "${r.text.slice(0, 100)}..."`)
  }

  writeFileSync(join(__dirname, 'test-review-result.json'), JSON.stringify({ name, reviews, debug: debugReviews }, null, 2))
  console.log('\n💾 Saved to test-review-result.json')

  await page.close()
  await browser.close()
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
