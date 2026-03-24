import { chromium } from 'playwright'

async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  // Scrape "Lawasan Ciputat" as a sample
  const url = 'https://www.google.com/maps/place/Lawasan+Ciputat/data=!4m7!3m6!1s0x2e69ef16921657cf:0x2217e411124f57c9!8m2!3d-6.3090748!4d106.74567!16s%2Fg%2F11t7snmcyk!19sChIJz1cskhblaS4RyVdPEhHkFyI?authuser=0&hl=id&rclk=1'
  
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('h1', { timeout: 10000 })
  
  const name = await page.$eval('h1', el => el.textContent?.trim() || '')
  const address = await page.evaluate(() => {
    const addrButton = document.querySelector('button[data-item-id="address"]')
    return addrButton?.textContent?.trim() || ''
  })
  const website = await page.evaluate(() => {
    const websiteLink = document.querySelector('a[data-item-id="authority"]') as HTMLAnchorElement
    return websiteLink ? websiteLink.href : null
  })
  const openingHours = await page.evaluate(() => {
    const hoursEl = document.querySelector('div[aria-label*="Hours"] , div[aria-label*="Jam operasional"] , button[aria-label*="Hours"] , button[aria-label*="Jam operasional"]')
    return hoursEl?.getAttribute('aria-label')?.replace(/^(Hours|Jam operasional):?\s*/i, '').trim() || null
  })

  const result = {
    name,
    address,
    website,
    opening_hours: openingHours,
    maps_url: url
  }

  console.log(JSON.stringify(result, null, 2))
  await browser.close()
}

run()
