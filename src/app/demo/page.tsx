import React from 'react'
import TemplateSwitcher from './TemplateSwitcher'

// Sample data from actual scraping result (Sambalado Nusantara - Ciputat)
const DEMO_BUSINESS = {
  name: 'Sambalado Nusantara',
  address: 'Komplek Kejaksaan Agung RI, Blk. C2 No.5, Cipayung, Kec. Ciputat, Kota Tangerang Selatan, Banten 15411',
  description: 'Restoran masakan Nusantara dengan cita rasa autentik. Menyajikan berbagai menu sambal khas Indonesia yang menggugah selera.',
  category: 'kuliner',
  openingHours: 'Buka Sabtu pukul 00.00',
  whatsappNumber: '6282210784445',
  whatsappMessage: 'Halo Sambalado Nusantara, saya ingin pesan...',
  mapsUrl: 'https://www.google.com/maps/place/Sambalado+Nusantara/@-6.3358333,106.7522257,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69ef2131a711a1:0x54bf284ab4279c09!8m2!3d-6.3358333!4d106.7522257!16s%2Fg%2F11mt2xzgdr',
  latitude: -6.3358333,
  longitude: 106.7522257,
  products: [
    { id: '1', name: 'Nasi Sambalado', price: 'Rp 25.000', description: 'Nasi putih dengan sambalado khas Minang', imageUrl: null },
    { id: '2', name: 'Ayam Bakar Padang', price: 'Rp 30.000', description: 'Ayam bakar bumbu Padang original', imageUrl: null },
    { id: '3', name: 'Rendang Sapi', price: 'Rp 35.000', description: 'Rendang daging sapi empuk rempah nusantara', imageUrl: null },
    { id: '4', name: 'Es Teh Manis', price: 'Rp 5.000', description: null, imageUrl: null },
  ],
  reviews: [
    { id: '1', author: 'Ahmad Rizki', rating: 5, text: 'Sambalnya juara! Porsi besar, harga terjangkau. Pasti balik lagi.', date: '2 minggu lalu' },
    { id: '2', author: 'Siti Nurhaliza', rating: 5, text: 'Tempatnya bersih, pelayanan ramah. Rendangnya lembut banget.', date: '1 bulan lalu' },
    { id: '3', author: 'Budi Santoso', rating: 4, text: 'Enak sih tapi kadang agak lama. Overall recommended!', date: '3 minggu lalu' },
  ],
}

export default function DemoPage() {
  return <TemplateSwitcher business={DEMO_BUSINESS} />
}
