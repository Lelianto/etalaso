export interface BusinessData {
  name: string
  address: string | null
  description: string | null
  category: string | null
  openingHours: string | null
  whatsappNumber: string | null
  whatsappMessage: string | null
  mapsUrl: string | null
  latitude: number | null
  longitude: number | null
  subscriptionType: 'business' | 'umkm'
  products: Array<{
    id: string
    name: string
    price: string | null
    description: string | null
    imageUrl: string | null
  }>
  reviews: Array<{
    id: string
    author: string
    rating: number
    text: string | null
    date: string | null
  }>
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

/** Clean up opening hours — strip nonsensical times like "pukul 00.00", keep only day names */
export function getOpeningHours(business: BusinessData): string | null {
  if (!business.openingHours) return null
  const raw = business.openingHours

  // If it contains "pukul 00.00" or similar nonsensical patterns, extract just the day
  if (raw.match(/pukul\s*0{1,2}[.:]\s*0{1,2}/i)) {
    const foundDays = DAYS.filter(d => raw.toLowerCase().includes(d.toLowerCase()))
    if (foundDays.length > 0) {
      return `Buka setiap hari ${foundDays.join(', ')}`
    }
    return null
  }

  // If it looks like "Buka [Day]" without actual hours, just return the day info
  const dayMatch = raw.match(/^Buka\s+([\w]+)/i)
  if (dayMatch && !raw.match(/\d{1,2}[.:]\d{2}\s*[-–]\s*\d{1,2}[.:]\d{2}/)) {
    const foundDays = DAYS.filter(d => raw.toLowerCase().includes(d.toLowerCase()))
    if (foundDays.length > 0) {
      return `Buka setiap hari ${foundDays.join(', ')}`
    }
  }

  return raw
}

export function getWhatsAppLink(business: BusinessData): string {
  if (!business.whatsappNumber) return '#'
  const defaultMsg = `Halo, saya lihat ${business.name} di Etalaso.com. Hari ini buka?`
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(business.whatsappMessage || defaultMsg)}`
}

export function getMapsLink(business: BusinessData): string {
  if (business.mapsUrl) return business.mapsUrl
  if (business.latitude && business.longitude) {
    return `https://www.google.com/maps?q=${business.latitude},${business.longitude}`
  }
  if (business.address) {
    return `https://www.google.com/maps/search/${encodeURIComponent(business.address)}`
  }
  return '#'
}

export function renderStars(): string {
  return '★★★★★'
}

const DEFAULT_REVIEWS = [
  { id: 'default-1', author: 'Pelanggan Setia', rating: 5, text: 'Pelayanan sangat memuaskan, tempatnya nyaman dan bersih. Pasti akan kembali lagi!', date: 'Baru-baru ini' },
  { id: 'default-2', author: 'Pengunjung Baru', rating: 5, text: 'Pertama kali kesini dan langsung suka. Recommended banget untuk dicoba.', date: 'Baru-baru ini' },
  { id: 'default-3', author: 'Warga Sekitar', rating: 5, text: 'Sudah langganan dari lama. Kualitas selalu konsisten dan harga terjangkau.', date: 'Baru-baru ini' },
]

/** Always returns reviews with rating 5. Falls back to default reviews if empty. */
export function getReviews(business: BusinessData) {
  const reviews = business.reviews.length > 0 ? business.reviews : DEFAULT_REVIEWS
  return reviews.map(r => ({ ...r, rating: 5 }))
}
