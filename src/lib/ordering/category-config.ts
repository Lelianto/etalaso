export interface CategoryConfig {
  itemLabel: string
  cartTitle: string
  checkoutTitle: string
  messageEmoji: string
  messageTitle: string
  showDate: boolean
  showTableNumber: boolean
  showCustomerName: boolean
  showNotes: boolean
  claimFeatureText: string
  claimBannerText: string
}

const configs: Record<string, CategoryConfig> = {
  kuliner: {
    itemLabel: 'Menu',
    cartTitle: 'Keranjang',
    checkoutTitle: 'Pesan',
    messageEmoji: '🍽️',
    messageTitle: 'PESANAN',
    showDate: false,
    showTableNumber: true,
    showCustomerName: true,
    showNotes: true,
    claimFeatureText: 'Bisnis kuliner mendapat akses fitur ordering digital:',
    claimBannerText: 'Ini warung Anda? Klaim supaya pelanggan bisa pesan dari HP!',
  },
  otomotif: {
    itemLabel: 'Layanan',
    cartTitle: 'Keranjang',
    checkoutTitle: 'Booking Servis',
    messageEmoji: '🔧',
    messageTitle: 'SERVIS',
    showDate: true,
    showTableNumber: false,
    showCustomerName: true,
    showNotes: true,
    claimFeatureText: 'Bisnis otomotif mendapat akses fitur booking digital:',
    claimBannerText: 'Ini bengkel Anda? Klaim supaya pelanggan bisa booking servis!',
  },
  kecantikan: {
    itemLabel: 'Layanan',
    cartTitle: 'Keranjang',
    checkoutTitle: 'Booking',
    messageEmoji: '💇',
    messageTitle: 'BOOKING',
    showDate: true,
    showTableNumber: false,
    showCustomerName: true,
    showNotes: true,
    claimFeatureText: 'Bisnis kecantikan mendapat akses fitur booking digital:',
    claimBannerText: 'Ini salon Anda? Klaim supaya pelanggan bisa booking dari HP!',
  },
  jasa: {
    itemLabel: 'Jasa',
    cartTitle: 'Keranjang',
    checkoutTitle: 'Permintaan Jasa',
    messageEmoji: '👔',
    messageTitle: 'PERMINTAAN',
    showDate: true,
    showTableNumber: false,
    showCustomerName: true,
    showNotes: true,
    claimFeatureText: 'Bisnis jasa mendapat akses fitur pemesanan digital:',
    claimBannerText: 'Ini bisnis Anda? Klaim supaya pelanggan bisa hubungi langsung!',
  },
  retail: {
    itemLabel: 'Produk',
    cartTitle: 'Keranjang',
    checkoutTitle: 'Pesan',
    messageEmoji: '🛒',
    messageTitle: 'PESANAN',
    showDate: false,
    showTableNumber: false,
    showCustomerName: true,
    showNotes: true,
    claimFeatureText: 'Bisnis retail mendapat akses fitur pemesanan digital:',
    claimBannerText: 'Ini toko Anda? Klaim supaya pelanggan bisa pesan barang!',
  },
  kesehatan: {
    itemLabel: 'Produk',
    cartTitle: 'Keranjang',
    checkoutTitle: 'Pesan',
    messageEmoji: '💊',
    messageTitle: 'PESANAN',
    showDate: false,
    showTableNumber: false,
    showCustomerName: true,
    showNotes: true,
    claimFeatureText: 'Bisnis kesehatan mendapat akses fitur pemesanan digital:',
    claimBannerText: 'Ini toko Anda? Klaim supaya pelanggan bisa pesan dari HP!',
  },
  klinik: {
    itemLabel: 'Layanan',
    cartTitle: 'Keranjang',
    checkoutTitle: 'Pendaftaran',
    messageEmoji: '🩺',
    messageTitle: 'PENDAFTARAN',
    showDate: true,
    showTableNumber: false,
    showCustomerName: true,
    showNotes: true,
    claimFeatureText: 'Klinik mendapat akses fitur pendaftaran digital:',
    claimBannerText: 'Ini klinik Anda? Klaim supaya pasien bisa daftar dari HP!',
  },
}

const defaultConfig: CategoryConfig = {
  itemLabel: 'Produk',
  cartTitle: 'Keranjang',
  checkoutTitle: 'Permintaan',
  messageEmoji: '📦',
  messageTitle: 'PERMINTAAN',
  showDate: false,
  showTableNumber: false,
  showCustomerName: true,
  showNotes: true,
  claimFeatureText: 'Bisnis Anda mendapat akses fitur pemesanan digital:',
  claimBannerText: 'Ini bisnis Anda? Klaim supaya pelanggan bisa hubungi langsung!',
}

export function getCategoryConfig(category: string): CategoryConfig {
  return configs[category.toLowerCase()] || defaultConfig
}
