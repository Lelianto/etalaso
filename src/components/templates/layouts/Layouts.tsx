'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, MapPin, Clock, Star, ArrowRight, Phone } from 'lucide-react'
import { ThemeConfig } from '../DesignSystem'
import { BusinessData, getOpeningHours, getWhatsAppLink, getMapsLink, getReviews } from '../types'

interface LayoutProps {
  business: BusinessData
  theme: ThemeConfig
}

/** 1. Standard Centralized Layout */
export const StandardLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const reviews = getReviews(business)
  const hours = getOpeningHours(business)

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: theme.colors.background, 
        color: theme.colors.text,
        fontFamily: theme.typography.fontSans 
      }}
    >
      {/* Hero */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ 
              backgroundColor: theme.colors.accent + '20', 
              color: theme.colors.accent,
              border: `1px solid ${theme.colors.accent}`
            }}
          >
            {business.category || 'Bisnis Lokal'}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: theme.typography.fontDisplay }}>
            {business.name}
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-80">
            {business.description || 'Pilihan terbaik untuk kebutuhan Anda di sekitar wilayah Anda.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={getWhatsAppLink(business)}
              className="px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
            >
              <MessageCircle size={20} />
              Chat WhatsApp
            </a>
            <a 
              href={getMapsLink(business)}
              className="px-8 py-4 rounded-full border font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              style={{ borderColor: theme.colors.border }}
            >
              <MapPin size={20} />
              Lokasi Kami
            </a>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      {business.products.length > 0 && (
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Produk & Layanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {business.products.map((p) => (
              <div 
                key={p.id} 
                className="overflow-hidden p-1"
                style={{ 
                  borderRadius: theme.styles.borderRadius,
                  backgroundColor: theme.colors.surface,
                  boxShadow: theme.styles.shadow,
                  border: `${theme.styles.borderWidth} solid ${theme.colors.border}`
                }}
              >
                {p.imageUrl && (
                  <Image src={p.imageUrl} alt={p.name} width={400} height={192} className="w-full h-48 object-cover rounded-t-lg" />
                )}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{p.name}</h3>
                  <p className="text-sm opacity-70 mb-4 h-12 overflow-hidden">{p.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg" style={{ color: theme.colors.accent }}>{p.price || 'Hubungi Kami'}</span>
                    <a href={getWhatsAppLink(business)} className="text-sm font-semibold flex items-center gap-1 hover:underline">
                      Pesan <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews & Info Side-by-Side */}
      <section className="py-20 px-6 bg-opacity-50" style={{ backgroundColor: theme.colors.surface }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">Ulasan Pelanggan</h2>
            <div className="space-y-6">
              {reviews.map((r, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg bg-white bg-opacity-10">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200">
                      <span className="font-bold">{r.author.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={theme.colors.accent} color={theme.colors.accent} />)}
                    </div>
                    <p className="text-sm mb-2">{r.text}</p>
                    <span className="text-xs opacity-50">{r.author} • {r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 rounded-2xl border" style={{ borderColor: theme.colors.border }}>
            <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Alamat</h4>
                  <p className="text-sm opacity-70">{business.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Jam Buka</h4>
                  <p className="text-sm opacity-70">{hours || 'Hubungi untuk jadwal'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-purple-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">WhatsApp</h4>
                  <p className="text-sm opacity-70">{business.whatsappNumber}</p>
                </div>
              </div>
            </div>
            <a 
              href={getMapsLink(business)} 
              className="mt-8 block w-full py-3 rounded-lg text-center font-bold"
              style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
            >
              Buka di Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t text-sm opacity-50" style={{ borderColor: theme.colors.border }}>
        <p>© 2026 {business.name}. Dikelola oleh Etalaso.</p>
        <p className="mt-2">Klaim bisnis ini untuk fitur premium.</p>
      </footer>

      {/* Sticky WA */}
      <a 
        href={getWhatsAppLink(business)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-xl z-50 hover:scale-110 transition-transform active:scale-95"
        style={{ backgroundColor: theme.colors.accent, color: '#fff' }}
      >
        <MessageCircle size={32} />
      </a>
    </div>
  )
}

/** 2. Modern Split Layout */
export const SplitLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const hours = getOpeningHours(business)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Left: Content */}
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: theme.typography.fontDisplay }}>{business.name}</h1>
            <p className="text-xl opacity-80 mb-12">{business.description || 'Solusi terbaik untuk Anda.'}</p>
            <div className="flex flex-wrap gap-4">
              <a href={getWhatsAppLink(business)} className="px-8 py-4 rounded-lg font-bold flex items-center gap-2" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
                <MessageCircle size={20} /> Chat WhatsApp
              </a>
              <a href={getMapsLink(business)} className="px-8 py-4 rounded-lg border font-bold" style={{ borderColor: theme.colors.border }}>Lokasi Kami</a>
            </div>
          </motion.div>
        </div>
        {/* Right: Vision/Image */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center min-h-[400px]" style={{ backgroundColor: theme.colors.surface }}>
           <div className="p-12 text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center" style={{ backgroundColor: theme.colors.accent }}>
                 <Star size={64} color="white" fill="white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Rating 5 Bintang</h3>
              <p className="opacity-70">Bergabunglah dengan ribuan pelanggan yang puas.</p>
           </div>
        </div>
      </div>
      
      {/* Product Grid - Minimalist */}
      <section className="py-20 px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {business.products.map(p => (
             <div key={p.id} className="p-6 border-b md:border-b-0 md:border-r" style={{ borderColor: theme.colors.border }}>
                <h4 className="font-bold text-lg mb-2">{p.name}</h4>
                <p className="text-sm opacity-60 mb-4">{p.price || 'Pesan Sekarang'}</p>
                <a href={getWhatsAppLink(business)} className="text-xs uppercase font-black tracking-widest flex items-center gap-2" style={{ color: theme.colors.accent }}>
                   Order <ArrowRight size={14} />
                </a>
             </div>
           ))}
        </div>
      </section>
      
      {/* Footer Info */}
      <section className="py-12 px-12 border-t flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
         <div className="flex gap-12 text-sm opacity-70">
            <div><h5 className="font-bold mb-2">Alamat</h5><p>{business.address}</p></div>
            <div><h5 className="font-bold mb-2">Jam Buka</h5><p>{hours || 'Hubungi Kami'}</p></div>
         </div>
         <p className="text-xs opacity-50">© 2026 {business.name}. Premium Landing by Etalaso.</p>
      </section>
    </div>
  )
}

/** 3. App-Style Sidebar/Tab Layout */
export const AppLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
       {/* Mobile-like Header */}
       <header className="sticky top-0 z-40 p-6 flex justify-between items-center border-b backdrop-blur-md" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface + 'cc' }}>
          <h1 className="font-black text-xl">{business.name}</h1>
          <a href={getWhatsAppLink(business)} className="p-2 rounded-full" style={{ backgroundColor: theme.colors.accent }}><MessageCircle size={20} color="white" /></a>
       </header>
       
       <div className="p-6 max-w-lg mx-auto space-y-8">
          {/* Main Card */}
          <div className="p-8 rounded-3xl shadow-xl border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
             <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.colors.accent }}>{business.category}</span>
             <h2 className="text-3xl font-bold mt-2 mb-4">{business.name}</h2>
             <p className="opacity-70 text-sm">{business.description}</p>
          </div>

          {/* Icon Actions */}
          <div className="grid grid-cols-4 gap-4">
             {[
               { icon: Phone, label: 'Call', link: `tel:${business.whatsappNumber}` },
               { icon: MessageCircle, label: 'WA', link: getWhatsAppLink(business) },
               { icon: MapPin, label: 'Maps', link: getMapsLink(business) },
               { icon: Star, label: 'Review', link: getMapsLink(business) }
             ].map((item, i) => (
               <a key={i} href={item.link} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ borderColor: theme.colors.border }}><item.icon size={20} /></div>
                  <span className="text-[10px] font-bold uppercase">{item.label}</span>
               </a>
             ))}
          </div>

          {/* List Style Products */}
          <div className="space-y-4">
             <h3 className="font-bold text-lg">Menu & Produk</h3>
             {business.products.map(p => (
               <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ borderColor: theme.colors.border }}>
                  {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="w-16 h-16 rounded-xl object-cover" />}
                  <div className="flex-grow">
                     <h4 className="font-bold text-sm">{p.name}</h4>
                     <p className="text-xs opacity-60">{p.price}</p>
                  </div>
                  <a href={getWhatsAppLink(business)} className="p-2 rounded-lg" style={{ backgroundColor: theme.colors.surface }}><ArrowRight size={16} /></a>
               </div>
             ))}
          </div>
       </div>

       {/* Bottom Quick Bar */}
       <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
          <a 
            href={getWhatsAppLink(business)}
            className="w-full py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-bold text-lg"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
          >
            Hubungi Lewat WhatsApp
          </a>
       </div>
    </div>
  )
}

/** 4. Gallery First Layout */
export const GalleryLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const reviews = getReviews(business)
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
       {/* Hero with Collage */}
       <header className="py-20 px-6 text-center">
          <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter" style={{ fontFamily: theme.typography.fontDisplay }}>{business.name}</h1>
          <p className="max-w-xl mx-auto opacity-70 mb-12">{business.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-6xl mx-auto h-[400px]">
             {business.products.slice(0, 4).map((p, i) => (
               <div key={p.id} className={`relative overflow-hidden group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                  {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill className="object-cover transition-transform group-hover:scale-110" />}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-left">
                     <h4 className="text-white font-bold">{p.name}</h4>
                     <p className="text-white text-xs">{p.price}</p>
                  </div>
               </div>
             ))}
          </div>
       </header>

       {/* Simple Contact Strip */}
       <div className="bg-black py-8 px-6 flex flex-wrap justify-center gap-12 text-white">
          <div className="flex items-center gap-2"><MapPin size={16} /> <span className="text-sm font-bold">{business.address}</span></div>
          <div className="flex items-center gap-2"><Clock size={16} /> <span className="text-sm font-bold">{getOpeningHours(business)}</span></div>
          <a href={getWhatsAppLink(business)} className="flex items-center gap-2 text-yellow-400"><MessageCircle size={16} /> <span className="text-sm font-bold">Booking Sekarang</span></a>
       </div>

       {/* Reviews Section - Modern Grid */}
       <section className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Kata Mereka</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {reviews.map((r, i) => (
                <div key={i} className="p-8 rounded-2xl border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
                   <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="text-yellow-500" />)}
                   </div>
                   <p className="italic mb-6 text-lg">&quot;{r.text}&quot;</p>
                   <p className="font-bold">{r.author}</p>
                </div>
             ))}
          </div>
       </section>
    </div>
  )
}

/** 5. Floating Cards Layout */
export const CardsLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  return (
    <div className="min-h-screen py-20 px-6" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
       <div className="max-w-xl mx-auto space-y-6">
          {/* Header Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: theme.colors.surface, border: `${theme.styles.borderWidth} solid ${theme.colors.border}` }}
          >
             <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: theme.colors.accent }}></div>
             <h1 className="text-4xl font-bold mb-4">{business.name}</h1>
             <p className="opacity-70 mb-8">{business.description}</p>
             <a href={getWhatsAppLink(business)} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-wider" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
                <MessageCircle size={20} /> Hubungi Kami
             </a>
          </motion.div>

          {/* Contact Cards Row */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 rounded-[2rem] shadow-lg border flex flex-col items-center text-center gap-3" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600"><MapPin size={20} /></div>
                <span className="text-[10px] font-bold uppercase opacity-50">Alamat</span>
                <p className="text-[11px] font-bold h-8 overflow-hidden">{business.address}</p>
             </div>
             <div className="p-6 rounded-[2rem] shadow-lg border flex flex-col items-center text-center gap-3" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600"><Clock size={20} /></div>
                <span className="text-[10px] font-bold uppercase opacity-50">Jam Buka</span>
                <p className="text-[11px] font-bold h-8 overflow-hidden">{getOpeningHours(business)}</p>
             </div>
          </div>

          {/* Product Cards Stack */}
          <div className="space-y-4">
             {business.products.map(p => (
               <div key={p.id} className="p-1 rounded-[1.5rem] bg-gradient-to-r from-gray-200 to-gray-100 shadow-md">
                  <div className="bg-white rounded-[1.4rem] p-4 flex items-center justify-between">
                     <h4 className="font-bold text-sm text-gray-800">{p.name}</h4>
                     <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black">{p.price}</span>
                  </div>
               </div>
             ))}
          </div>

          <div className="pt-8 text-center text-[10px] font-bold tracking-[0.2em] opacity-30 uppercase">
             Powered by Etalaso • Premium Design
          </div>
       </div>
    </div>
  )
}
