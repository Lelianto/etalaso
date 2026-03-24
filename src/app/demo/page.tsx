import React from 'react'
import TemplateSwitcher from './TemplateSwitcher'

// Fictional demo data — all names, numbers, and addresses are fake
// Images from Unsplash (free to use)
const DEMO_BUSINESS = {
  name: 'Warung Nusantara Demo',
  address: 'Jl. Contoh No. 123, Kec. Serpong, Kota Tangerang Selatan, Banten 15310',
  description: 'Ini adalah contoh halaman bisnis di Etalaso. Warung dengan cita rasa nusantara autentik, menyajikan berbagai menu tradisional yang menggugah selera.',
  category: 'kuliner',
  openingHours: 'Senin - Sabtu, 08.00 - 21.00',
  whatsappNumber: '6280000000000',
  whatsappMessage: 'Halo, saya tertarik dengan bisnis Anda di Etalaso!',
  mapsUrl: '#',
  latitude: -6.32,
  longitude: 106.67,
  subscriptionType: 'business' as const,
  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop',
  galleryImages: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
  ],
  products: [
    { id: '1', name: 'Nasi Rempah Spesial', price: 'Rp 25.000', description: 'Nasi putih dengan bumbu rempah khas nusantara', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop' },
    { id: '2', name: 'Ayam Bakar Tradisional', price: 'Rp 30.000', description: 'Ayam bakar dengan racikan bumbu turun-temurun', imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop' },
    { id: '3', name: 'Rendang Pilihan', price: 'Rp 35.000', description: 'Daging sapi pilihan dimasak rendang hingga empuk', imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop' },
    { id: '4', name: 'Es Segar Khas', price: 'Rp 8.000', description: 'Minuman segar racikan sendiri', imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop' },
    { id: '5', name: 'Paket Hemat Keluarga', price: 'Rp 85.000', description: 'Paket nasi untuk 4 orang lengkap dengan lauk dan minuman', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
  ],
  reviews: [
    { id: '1', author: 'Rina S.', rating: 5, text: 'Porsi besar, harga terjangkau. Rasanya autentik banget. Pasti balik lagi!', date: '2 minggu lalu' },
    { id: '2', author: 'Budi P.', rating: 5, text: 'Tempatnya bersih dan nyaman. Pelayanan ramah, menu variatif.', date: '1 bulan lalu' },
    { id: '3', author: 'Dewi A.', rating: 5, text: 'Sudah langganan dari lama. Kualitas selalu konsisten, recommended!', date: '3 minggu lalu' },
  ],
}

export default function DemoPage() {
  return <TemplateSwitcher business={DEMO_BUSINESS} />
}
