/**
 * Generate a sample Menu PDF using Playwright.
 * Run: npx tsx scripts/generate-menu-pdf.ts
 */
import { chromium } from 'playwright'
import path from 'path'
import { buildMenuHTML } from '../src/lib/menu-pdf-html'

const SAMPLE_PRODUCTS = [
  { name: 'Nasi Goreng Spesial', price: 18000 },
  { name: 'Mie Ayam Bakso', price: 15000 },
  { name: 'Soto Betawi', price: 22000 },
  { name: 'Ayam Bakar Madu', price: 28000 },
  { name: 'Nasi Uduk Komplit', price: 16000 },
  { name: 'Gado-Gado', price: 14000 },
  { name: 'Rendang Sapi', price: 32000 },
  { name: 'Ikan Bakar Jimbaran', price: 35000 },
  { name: 'Sate Ayam (10 tusuk)', price: 20000 },
  { name: 'Bakso Urat Spesial', price: 18000 },
  { name: 'Pecel Lele Lamongan', price: 17000 },
  { name: 'Nasi Campur Bali', price: 25000 },
  { name: 'Es Teh Manis', price: 5000 },
  { name: 'Es Jeruk Segar', price: 7000 },
  { name: 'Jus Alpukat', price: 12000 },
  { name: 'Kopi Susu Gula Aren', price: 15000 },
]

async function main() {
  console.log('Launching browser...')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Full version (all options shown)
  const htmlFull = buildMenuHTML({
    businessName: 'Warung Nusantara',
    whatsappNumber: '6281234567890',
    showWhatsApp: true,
    showOrderText: true,
    showPrices: true,
    products: SAMPLE_PRODUCTS,
  })

  await page.setContent(htmlFull, { waitUntil: 'networkidle' })
  const outFull = path.join(process.cwd(), 'sample-menu-full.pdf')
  await page.pdf({ path: outFull, format: 'A4', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } })
  console.log(`PDF saved: ${outFull}`)

  // Minimal version (no WA, no order text)
  const htmlMinimal = buildMenuHTML({
    businessName: 'Warung Nusantara',
    whatsappNumber: null,
    showWhatsApp: false,
    showOrderText: false,
    showPrices: true,
    products: SAMPLE_PRODUCTS,
  })

  await page.setContent(htmlMinimal, { waitUntil: 'networkidle' })
  const outMinimal = path.join(process.cwd(), 'sample-menu-minimal.pdf')
  await page.pdf({ path: outMinimal, format: 'A4', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } })
  console.log(`PDF saved: ${outMinimal}`)

  await browser.close()
  console.log('Done!')
}

main().catch(console.error)
