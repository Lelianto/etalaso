import { createClient } from '@/lib/supabase/server'
import { buildMenuHTML } from '@/lib/menu-pdf-html'
import { NextResponse } from 'next/server'
import { chromium } from 'playwright'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check tier — must be umkm or business
  const { data: profile } = await supabase
    .from('UserProfile')
    .select('planId')
    .eq('id', user.id)
    .single()

  if (!profile || profile.planId === 'free') {
    return NextResponse.json({ error: 'Upgrade ke paket UMKM untuk menggunakan fitur ini' }, { status: 403 })
  }

  // Get user's business + products
  const { data: business } = await supabase
    .from('Business')
    .select('id, name, whatsappNumber, products:Product(name, price)')
    .eq('ownerId', user.id)
    .limit(1)
    .single()

  if (!business || !business.products || business.products.length === 0) {
    return NextResponse.json({ error: 'Tidak ada produk untuk dicetak' }, { status: 400 })
  }

  // Parse config from request body
  const { showWhatsApp = false, showOrderText = false, showPrices = true } = await request.json()

  const html = buildMenuHTML({
    businessName: business.name,
    whatsappNumber: business.whatsappNumber,
    showWhatsApp,
    showOrderText,
    showPrices,
    products: business.products.map((p: { name: string; price: number | null }) => ({
      name: p.name,
      price: p.price,
    })),
  })

  // Generate PDF with Playwright
  let browser
  try {
    browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    })

    const safeName = business.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 30)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Menu_${safeName}.pdf"`,
      },
    })
  } catch (err) {
    console.error('PDF generation failed:', err)
    return NextResponse.json({ error: 'Gagal membuat PDF' }, { status: 500 })
  } finally {
    await browser?.close()
  }
}
