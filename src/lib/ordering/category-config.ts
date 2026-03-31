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
  /** Header for feature section on claim page, e.g. "Fitur Booking Digital" */
  claimSectionTitle: string
  /** WhatsApp feature label on claim page, e.g. "Booking via WhatsApp" */
  whatsappFeatureLabel: string
  /** Pre-order feature label on claim page, e.g. "Pre-Booking + Pembayaran QRIS" */
  preOrderLabel: string
  /** Pre-order description on claim page */
  preOrderDescription: string
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
    claimSectionTitle: 'Fitur Pemesanan Digital',
    whatsappFeatureLabel: 'Pemesanan via WhatsApp',
    preOrderLabel: 'Pre-Order + Pembayaran QRIS',
    preOrderDescription: 'Terima pesanan di muka dengan pembayaran langsung via QRIS atau transfer bank. Cocok untuk katering & pesanan besar.',
  },
  kuliner_rumahan: {
    itemLabel: 'Menu',
    cartTitle: 'Keranjang',
    checkoutTitle: 'Pesan via WhatsApp',
    messageEmoji: '🍳',
    messageTitle: 'PESANAN',
    showDate: true,
    showTableNumber: false,
    showCustomerName: true,
    showNotes: true,
    claimFeatureText: 'Usaha kuliner rumahan mendapat akses fitur ordering WhatsApp:',
    claimBannerText: 'Ini dapur Anda? Daftar dan terima pesanan via WhatsApp!',
    claimSectionTitle: 'Fitur Pemesanan Digital',
    whatsappFeatureLabel: 'Pemesanan via WhatsApp',
    preOrderLabel: 'Pre-Order + Pembayaran QRIS',
    preOrderDescription: 'Terima pesanan di muka dengan pembayaran langsung via QRIS atau transfer bank. Cocok untuk katering & pesanan besar.',
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
    claimSectionTitle: 'Fitur Booking Digital',
    whatsappFeatureLabel: 'Booking via WhatsApp',
    preOrderLabel: 'Pre-Booking + Pembayaran QRIS',
    preOrderDescription: 'Terima booking servis di muka dengan pembayaran langsung via QRIS atau transfer bank.',
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
    claimSectionTitle: 'Fitur Booking Digital',
    whatsappFeatureLabel: 'Booking via WhatsApp',
    preOrderLabel: 'Pre-Booking + Pembayaran QRIS',
    preOrderDescription: 'Terima booking di muka dengan pembayaran langsung via QRIS atau transfer bank.',
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
    claimSectionTitle: 'Fitur Pemesanan Digital',
    whatsappFeatureLabel: 'Pemesanan via WhatsApp',
    preOrderLabel: 'Pre-Order + Pembayaran QRIS',
    preOrderDescription: 'Terima permintaan jasa di muka dengan pembayaran langsung via QRIS atau transfer bank.',
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
    claimSectionTitle: 'Fitur Pemesanan Digital',
    whatsappFeatureLabel: 'Pemesanan via WhatsApp',
    preOrderLabel: 'Pre-Order + Pembayaran QRIS',
    preOrderDescription: 'Terima pesanan di muka dengan pembayaran langsung via QRIS atau transfer bank.',
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
    claimSectionTitle: 'Fitur Pemesanan Digital',
    whatsappFeatureLabel: 'Pemesanan via WhatsApp',
    preOrderLabel: 'Pre-Order + Pembayaran QRIS',
    preOrderDescription: 'Terima pesanan di muka dengan pembayaran langsung via QRIS atau transfer bank.',
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
    claimSectionTitle: 'Fitur Pendaftaran Digital',
    whatsappFeatureLabel: 'Pendaftaran via WhatsApp',
    preOrderLabel: 'Pre-Registrasi + Pembayaran QRIS',
    preOrderDescription: 'Terima pendaftaran pasien di muka dengan pembayaran langsung via QRIS atau transfer bank.',
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
  claimSectionTitle: 'Fitur Pemesanan Digital',
  whatsappFeatureLabel: 'Pemesanan via WhatsApp',
  preOrderLabel: 'Pre-Order + Pembayaran QRIS',
  preOrderDescription: 'Terima pesanan di muka dengan pembayaran langsung via QRIS atau transfer bank.',
}

export function getCategoryConfig(category: string): CategoryConfig {
  return configs[category.toLowerCase()] || defaultConfig
}
