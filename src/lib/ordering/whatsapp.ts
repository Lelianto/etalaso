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

export function generateDineInMessage(
  storeName: string,
  tableNumber: string,
  items: CartItem[]
): string {
  const lines = [
    `🍽️ *PESANAN MEJA #${tableNumber}*`,
    `📍 ${storeName}`,
    '',
    '---',
    formatItemLines(items),
    '---',
    '',
    `💰 *Total: ${calculateTotal(items)}*`,
    '',
    '_Dikirim via Etalaso_',
  ]
  return lines.join('\n')
}

export function generatePreOrderMessage(
  storeName: string,
  customerName: string,
  arrivalTime: string,
  items: CartItem[],
  proofUrl: string
): string {
  const lines = [
    `📦 *PRE-ORDER*`,
    `📍 ${storeName}`,
    '',
    `👤 Nama: ${customerName}`,
    `🕐 Waktu ambil: ${arrivalTime}`,
    '',
    '---',
    formatItemLines(items),
    '---',
    '',
    `💰 *Total: ${calculateTotal(items)}*`,
    '',
    `🧾 Bukti transfer: ${proofUrl}`,
    '',
    '_Dikirim via Etalaso_',
  ]
  return lines.join('\n')
}

export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
