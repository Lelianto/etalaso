/**
 * Generates the HTML for the printable menu PDF.
 * Used by both the API route (Playwright) and the sample generation script.
 */

export interface MenuPDFData {
  businessName: string
  whatsappNumber: string | null
  showWhatsApp: boolean
  showOrderText: boolean
  showPrices: boolean
  products: Array<{ name: string; price: number | null }>
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')}`
}

export function buildMenuHTML(data: MenuPDFData): string {
  const { businessName, whatsappNumber, showWhatsApp, showOrderText, showPrices, products } = data

  const waDisplay = whatsappNumber?.startsWith('62')
    ? `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 5)}-${whatsappNumber.slice(5, 9)}-${whatsappNumber.slice(9)}`
    : whatsappNumber || ''

  const menuItems = products.map((p, i) => `
    <div class="menu-item">
      <span class="item-num">${i + 1}</span>
      <span class="item-name">${escapeHtml(p.name)}</span>
      ${showPrices && p.price ? `<span class="item-dots"></span><span class="item-price">${formatPrice(p.price)}</span>` : ''}
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --amber: #c8691b;
    --amber-light: #e8a44a;
    --amber-pale: #f5e6d0;
    --cream: #faf7f2;
    --charcoal: #2a2a2a;
    --warm-gray: #6b5e54;
    --light-border: #e8e0d6;
    --white: #ffffff;
  }

  @page {
    size: A4;
    margin: 0;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--cream);
    color: var(--charcoal);
    width: 210mm;
    min-height: 297mm;
    position: relative;
    padding: 0;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    position: relative;
    padding: 20mm 18mm 22mm;
    background: var(--cream);
  }

  .top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4mm;
    background: linear-gradient(90deg, var(--amber), var(--amber-light));
  }

  .bottom-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 4mm;
    background: linear-gradient(90deg, var(--amber-light), var(--amber));
  }

  .corner {
    position: absolute;
    width: 16mm;
    height: 16mm;
    border: 1.5px solid var(--amber-pale);
  }
  .corner-tl { top: 10mm; left: 12mm; border-right: none; border-bottom: none; }
  .corner-tr { top: 10mm; right: 12mm; border-left: none; border-bottom: none; }
  .corner-bl { bottom: 10mm; left: 12mm; border-right: none; border-top: none; }
  .corner-br { bottom: 10mm; right: 12mm; border-left: none; border-top: none; }

  .header {
    text-align: center;
    margin-bottom: 8mm;
  }

  .business-name {
    font-family: 'Playfair Display', serif;
    font-size: 28pt;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: 0.5px;
    margin-bottom: 3mm;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3mm;
    margin: 3mm 0;
  }

  .divider-line {
    width: 20mm;
    height: 1px;
    background: var(--amber);
  }

  .divider-diamond {
    width: 6px;
    height: 6px;
    background: var(--amber);
    transform: rotate(45deg);
  }

  .wa-number {
    font-size: 8pt;
    color: var(--warm-gray);
    margin-top: 2mm;
  }

  .order-badge {
    display: inline-block;
    background: var(--amber);
    color: white;
    font-size: 7pt;
    font-weight: 700;
    padding: 1.5mm 5mm;
    border-radius: 10mm;
    margin-top: 3mm;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .menu-title-wrap {
    display: flex;
    align-items: center;
    gap: 4mm;
    margin: 6mm 0 5mm;
  }

  .menu-title-line {
    flex: 1;
    height: 1px;
    background: var(--light-border);
  }

  .menu-title {
    font-family: 'Playfair Display', serif;
    font-size: 12pt;
    font-weight: 700;
    color: var(--amber);
    letter-spacing: 5px;
    text-transform: uppercase;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5mm 5mm;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 2.5mm;
    background: var(--white);
    border: 0.5px solid var(--light-border);
    border-radius: 2.5mm;
    padding: 3mm 3.5mm;
    min-height: 10mm;
  }

  .item-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 6mm;
    height: 6mm;
    border-radius: 50%;
    background: var(--amber);
    color: white;
    font-size: 7pt;
    font-weight: 700;
    flex-shrink: 0;
  }

  .item-name {
    font-size: 8.5pt;
    font-weight: 600;
    color: var(--charcoal);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-dots {
    flex: 1;
    border-bottom: 1px dotted var(--light-border);
    min-width: 4mm;
    margin-bottom: 1mm;
  }

  .item-price {
    font-size: 8pt;
    font-weight: 700;
    color: var(--amber);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .footer {
    position: absolute;
    bottom: 8mm;
    left: 0; right: 0;
    text-align: center;
  }

  .footer-line {
    width: calc(100% - 36mm);
    height: 0.5px;
    background: var(--light-border);
    margin: 0 auto 3mm;
  }

  .footer-text {
    font-size: 7pt;
    color: var(--warm-gray);
  }

  .footer-brand {
    font-weight: 700;
    color: var(--amber);
  }

  .footer-dot {
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--amber);
    vertical-align: middle;
    margin-left: 1mm;
  }
</style>
</head>
<body>
  <div class="page">
    <div class="top-bar"></div>
    <div class="bottom-bar"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="header">
      <div class="business-name">${escapeHtml(businessName)}</div>
      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-diamond"></div>
        <div class="divider-line"></div>
      </div>
      ${showWhatsApp && whatsappNumber ? `<div class="wa-number">WhatsApp: ${escapeHtml(waDisplay)}</div>` : ''}
      ${showOrderText ? `<div class="order-badge">Menerima Pesanan</div>` : ''}
    </div>

    <div class="menu-title-wrap">
      <div class="menu-title-line"></div>
      <div class="menu-title">Menu</div>
      <div class="menu-title-line"></div>
    </div>

    <div class="menu-grid">
      ${menuItems}
    </div>

    <div class="footer">
      <div class="footer-line"></div>
      <div class="footer-text">
        Supported &amp; Powered by <span class="footer-brand">Etalaso</span><span class="footer-dot"></span>
      </div>
    </div>
  </div>
</body>
</html>`
}
