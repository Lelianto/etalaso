import type { CategoryConfig } from './category-config'

export interface CartItem {
  id: string
  name: string
  price: string | null
  quantity: number
}

function formatPrice(price: string | null): string {
  if (!price) return '-'
  const num = parseInt(price.replace(/\D/g, ''))
  if (isNaN(num)) return price
  return `Rp ${num.toLocaleString('id-ID')}`
}

function formatItemLines(items: CartItem[]): string {
  return items
    .map((item, i) => {
      const priceStr = formatPrice(item.price)
      return `${i + 1}. ${item.name} x${item.quantity} — ${priceStr}`
    })
    .join('\n')
}

function calculateTotal(items: CartItem[]): string {
  let total = 0
  let allParseable = true
  for (const item of items) {
    if (!item.price) { allParseable = false; continue }
    const num = parseInt(item.price.replace(/\D/g, ''))
    if (isNaN(num)) { allParseable = false; continue }
    total += num * item.quantity
  }
  if (!allParseable || total === 0) return 'Konfirmasi harga via chat'
  return `Rp ${total.toLocaleString('id-ID')}`
}

interface OrderMessageParams {
  config: CategoryConfig
  storeName: string
  items: CartItem[]
  customerName?: string
  tableNumber?: string
  preferredDate?: string
  notes?: string
  proofUrl?: string
  deliveryMethod?: string
}

export function generateOrderMessage({
  config,
  storeName,
  items,
  customerName,
  tableNumber,
  preferredDate,
  notes,
  proofUrl,
  deliveryMethod,
}: OrderMessageParams): string {
  const lines: string[] = []

  // Header
  if (tableNumber) {
    lines.push(`${config.messageEmoji} *${config.messageTitle} MEJA #${tableNumber}*`)
  } else {
    lines.push(`${config.messageEmoji} *${config.messageTitle}*`)
  }
  lines.push(`📍 ${storeName}`)

  // Customer info
  if (customerName) {
    lines.push('', `👤 Nama: ${customerName}`)
  }
  if (preferredDate) {
    lines.push(`📅 Kapan: ${preferredDate}`)
  }
  if (deliveryMethod) {
    const label = deliveryMethod === 'pickup' ? 'Ambil Sendiri'
      : deliveryMethod === 'delivery' ? 'Diantar ke Pembeli'
      : 'Kirim via Gojek/Grab (driver dipesan pembeli)'
    lines.push(`🚚 Pengiriman: ${label}`)
  }
  if (notes) {
    lines.push(`📝 Catatan: ${notes}`)
  }

  // Items
  lines.push('', '---', formatItemLines(items), '---')

  // Total
  lines.push('', `💰 *Total: ${calculateTotal(items)}*`)

  // Proof
  if (proofUrl) {
    lines.push('', `🧾 Bukti transfer: ${proofUrl}`)
  }

  lines.push('', '_Dikirim via Etalaso_')
  return lines.join('\n')
}

// Keep legacy exports for backward compatibility during migration
export function generateDineInMessage(
  storeName: string,
  tableNumber: string,
  items: CartItem[]
): string {
  return generateOrderMessage({
    config: { messageEmoji: '🍽️', messageTitle: 'PESANAN' } as CategoryConfig,
    storeName,
    items,
    tableNumber,
  })
}

export function generatePreOrderMessage(
  storeName: string,
  customerName: string,
  arrivalTime: string,
  items: CartItem[],
  proofUrl: string
): string {
  return generateOrderMessage({
    config: { messageEmoji: '📦', messageTitle: 'PRE-ORDER' } as CategoryConfig,
    storeName,
    items,
    customerName,
    preferredDate: arrivalTime ? `Waktu ambil: ${arrivalTime}` : undefined,
    proofUrl: proofUrl || undefined,
  })
}

export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
