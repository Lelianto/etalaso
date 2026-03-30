export const KULINER_SUBCATEGORIES = [
  { value: 'makanan_berat', label: 'Makanan Berat', icon: '🍛' },
  { value: 'makanan_ringan', label: 'Makanan Ringan / Snack', icon: '🍿' },
  { value: 'minuman', label: 'Minuman', icon: '🥤' },
  { value: 'frozen_food', label: 'Frozen Food', icon: '🧊' },
  { value: 'catering', label: 'Catering Harian', icon: '🍱' },
  { value: 'preorder', label: 'PO / Preorder', icon: '📦' },
  { value: 'jastip', label: 'Jastip Makanan', icon: '🛍️' },
  { value: 'kue_roti', label: 'Kue & Roti', icon: '🍰' },
  { value: 'lainnya', label: 'Lainnya', icon: '🍽️' },
] as const

export type KulinerSubcategory = (typeof KULINER_SUBCATEGORIES)[number]['value']

export const VALID_SUBCATEGORIES = new Set<string>(
  KULINER_SUBCATEGORIES.map(s => s.value)
)

export const DELIVERY_METHODS = [
  { value: 'pickup', label: 'Ambil Sendiri', icon: '🏃' },
  { value: 'delivery', label: 'Diantar ke Pembeli', icon: '📦', note: 'Penjual mengantar langsung' },
  { value: 'gojek_grab', label: 'Kirim via Gojek/Grab', icon: '🛵', note: 'Driver dipesan oleh pembeli' },
] as const

export type DeliveryMethod = (typeof DELIVERY_METHODS)[number]['value']

export const OPERATING_DAYS = [
  'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu',
] as const
