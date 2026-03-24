'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageCircle, MapPin, Clock, Star, ArrowRight, Phone } from 'lucide-react'
import { ThemeConfig } from '../DesignSystem'
import { BusinessData, getOpeningHours, getWhatsAppLink, getMapsLink, getReviews } from '../types'

interface LayoutProps {
  business: BusinessData
  theme: ThemeConfig
}

/** Shared footer across all layouts */
const LayoutFooter: React.FC<{ business: BusinessData; theme: ThemeConfig }> = ({ business, theme }) => (
  <footer className="py-10 text-center border-t text-sm opacity-50" style={{ borderColor: theme.colors.border }}>
    <p>© {new Date().getFullYear()} {business.name}. Dikelola oleh Etalaso.</p>
    <Link href={`/claim/${(business as unknown as Record<string, string>).id || ''}`} className="inline-block mt-2 hover:underline">
      Klaim bisnis ini →
    </Link>
  </footer>
)

/** Shared sticky WA button */
const StickyWA: React.FC<{ business: BusinessData; theme: ThemeConfig }> = ({ business, theme }) => (
  <a
    href={getWhatsAppLink(business)}
    className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-xl z-50 hover:scale-110 transition-transform active:scale-95"
    style={{ backgroundColor: theme.colors.accent, color: '#fff' }}
    aria-label="Chat WhatsApp"
  >
    <MessageCircle size={32} />
  </a>
)

/** Shared reviews section */
const ReviewsSection: React.FC<{ business: BusinessData; theme: ThemeConfig; className?: string }> = ({ business, theme, className }) => {
  const reviews = getReviews(business)
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: theme.typography.fontDisplay }}>Ulasan Pelanggan</h2>
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="p-5 rounded-xl" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
            <div className="flex mb-2">
              {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={theme.colors.accent} color={theme.colors.accent} />)}
            </div>
            <p className="text-sm mb-2 opacity-80">{r.text}</p>
            <span className="text-xs opacity-50">{r.author} • {r.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 1. Standard Centralized Layout */
export const StandardLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const hours = getOpeningHours(business)
  const gallery = business.galleryImages || []

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        {business.imageUrl && (
          <div className="relative h-[50vh] md:h-[60vh]">
            <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${theme.colors.background}, transparent 60%)` }} />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-4xl mx-auto text-center px-6 ${business.imageUrl ? 'relative -mt-32 z-10' : 'py-20'}`}
        >
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
              <MessageCircle size={20} /> Chat WhatsApp
            </a>
            <a
              href={getMapsLink(business)}
              className="px-8 py-4 rounded-full border font-bold flex items-center justify-center gap-2 transition-colors"
              style={{ borderColor: theme.colors.border }}
            >
              <MapPin size={20} /> Lokasi Kami
            </a>
          </div>
        </motion.div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: theme.typography.fontDisplay }}>Galeri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`} style={{ aspectRatio: i === 0 ? '1' : '4/3' }}>
                <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {business.products.length > 0 && (
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontFamily: theme.typography.fontDisplay }}>Produk & Layanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {business.products.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden"
                style={{
                  borderRadius: theme.styles.borderRadius,
                  backgroundColor: theme.colors.surface,
                  boxShadow: theme.styles.shadow,
                  border: `${theme.styles.borderWidth} solid ${theme.colors.border}`,
                }}
              >
                {p.imageUrl && (
                  <Image src={p.imageUrl} alt={p.name} width={400} height={192} className="w-full h-48 object-cover" />
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

      {/* Reviews & Contact */}
      <section className="py-20 px-6" style={{ backgroundColor: theme.colors.surface }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ReviewsSection business={business} theme={theme} />
          <div className="p-8 rounded-2xl border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
            <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="flex-shrink-0" style={{ color: theme.colors.accent }} />
                <div>
                  <h4 className="font-bold">Alamat</h4>
                  <p className="text-sm opacity-70">{business.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="flex-shrink-0" style={{ color: theme.colors.accent }} />
                <div>
                  <h4 className="font-bold">Jam Buka</h4>
                  <p className="text-sm opacity-70">{hours || 'Hubungi untuk jadwal'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="flex-shrink-0" style={{ color: theme.colors.accent }} />
                <div>
                  <h4 className="font-bold">WhatsApp</h4>
                  <p className="text-sm opacity-70">{business.whatsappNumber || '-'}</p>
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

      <LayoutFooter business={business} theme={theme} />
      <StickyWA business={business} theme={theme} />
    </div>
  )
}

/** 2. Modern Split Layout */
export const SplitLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const hours = getOpeningHours(business)
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

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
        {/* Right: Hero image or rating */}
        <div className="w-full md:w-1/2 relative min-h-[400px]" style={{ backgroundColor: theme.colors.surface }}>
          {business.imageUrl ? (
            <>
              <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${theme.colors.background}40, transparent)` }} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-12 text-center">
              <div>
                <div className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center" style={{ backgroundColor: theme.colors.accent }}>
                  <Star size={64} color="white" fill="white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Rating 5 Bintang</h3>
                <p className="opacity-70">Bergabunglah dengan ribuan pelanggan yang puas.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-16 px-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((img, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
                <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {business.products.length > 0 && (
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
      )}

      {/* Reviews */}
      <section className="py-16 px-12" style={{ backgroundColor: theme.colors.surface }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: theme.typography.fontDisplay }}>Apa Kata Mereka</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={theme.colors.accent} color={theme.colors.accent} />)}
                </div>
                <p className="text-sm opacity-80 mb-3">{r.text}</p>
                <p className="text-xs font-bold">{r.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-12 border-t flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
        <div className="flex flex-wrap gap-12 text-sm opacity-70">
          <div><h5 className="font-bold mb-2">Alamat</h5><p>{business.address}</p></div>
          <div><h5 className="font-bold mb-2">Jam Buka</h5><p>{hours || 'Hubungi Kami'}</p></div>
        </div>
        <div className="text-right text-xs opacity-50">
          <p>© {new Date().getFullYear()} {business.name}. Powered by Etalaso.</p>
          <Link href={`/claim/${(business as unknown as Record<string, string>).id || ''}`} className="hover:underline">Klaim bisnis ini →</Link>
        </div>
      </section>

      <StickyWA business={business} theme={theme} />
    </div>
  )
}

/** 3. App-Style Layout */
export const AppLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      {/* Header */}
      <header className="sticky top-0 z-40 p-6 flex justify-between items-center border-b backdrop-blur-md" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface + 'cc' }}>
        <h1 className="font-black text-xl">{business.name}</h1>
        <a href={getWhatsAppLink(business)} className="p-2 rounded-full" style={{ backgroundColor: theme.colors.accent }}><MessageCircle size={20} color="white" /></a>
      </header>

      <div className="p-6 max-w-lg mx-auto space-y-6">
        {/* Hero Image */}
        {business.imageUrl && (
          <div className="relative h-48 rounded-3xl overflow-hidden">
            <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
          </div>
        )}

        {/* Main Card */}
        <div className="p-8 rounded-3xl shadow-xl border" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
          <h2 className="text-3xl font-bold mt-2 mb-4">{business.name}</h2>
          <p className="opacity-70 text-sm">{business.description}</p>
        </div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {gallery.map((img, i) => (
              <div key={i} className="relative h-28 rounded-2xl overflow-hidden">
                <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Phone, label: 'Call', link: `tel:${business.whatsappNumber}` },
            { icon: MessageCircle, label: 'WA', link: getWhatsAppLink(business) },
            { icon: MapPin, label: 'Maps', link: getMapsLink(business) },
            { icon: Star, label: 'Review', link: getMapsLink(business) },
          ].map((item, i) => (
            <a key={i} href={item.link} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Products */}
        {business.products.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Menu & Produk</h3>
            {business.products.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
                {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="w-16 h-16 rounded-xl object-cover" />}
                <div className="flex-grow">
                  <h4 className="font-bold text-sm">{p.name}</h4>
                  <p className="text-xs opacity-60">{p.price}</p>
                </div>
                <a href={getWhatsAppLink(business)} className="p-2 rounded-lg" style={{ backgroundColor: theme.colors.background }}><ArrowRight size={16} /></a>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Ulasan</h3>
          {reviews.map((r, i) => (
            <div key={i} className="p-4 rounded-2xl border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
              <div className="flex mb-2">
                {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={theme.colors.accent} color={theme.colors.accent} />)}
              </div>
              <p className="text-sm opacity-80 mb-1">{r.text}</p>
              <p className="text-xs opacity-50">{r.author}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 text-center text-xs opacity-40">
          <p>© {new Date().getFullYear()} {business.name}</p>
          <Link href={`/claim/${(business as unknown as Record<string, string>).id || ''}`} className="hover:underline">Klaim bisnis ini →</Link>
        </div>
      </div>

      {/* Bottom WA Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <a
          href={getWhatsAppLink(business)}
          className="w-full py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-bold text-lg"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
        >
          <MessageCircle size={22} /> Hubungi via WhatsApp
        </a>
      </div>
    </div>
  )
}

/** 4. Gallery Layout */
export const GalleryLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      {/* Hero with banner */}
      {business.imageUrl && (
        <div className="relative h-[40vh] md:h-[50vh]">
          <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${theme.colors.background}, transparent 50%)` }} />
        </div>
      )}

      <header className={`px-6 text-center ${business.imageUrl ? 'relative -mt-24 z-10' : 'pt-20'} pb-12`}>
        <h1 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tighter" style={{ fontFamily: theme.typography.fontDisplay }}>{business.name}</h1>
        <p className="max-w-xl mx-auto opacity-70 mb-12">{business.description}</p>

        {/* Gallery Grid */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-6xl mx-auto mb-12">
            {gallery.map((img, i) => (
              <div key={i} className={`relative overflow-hidden group rounded-lg ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} style={{ aspectRatio: i === 0 ? '1' : '4/3' }}>
                <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover transition-transform group-hover:scale-110" />
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {business.products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-6xl mx-auto" style={{ minHeight: business.products.some(p => p.imageUrl) ? '400px' : 'auto' }}>
            {business.products.slice(0, 4).map((p, i) => (
              <div key={p.id} className={`relative overflow-hidden group rounded-lg ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} style={{ backgroundColor: theme.colors.surface, minHeight: '120px' }}>
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-40 text-sm">{p.name}</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-left">
                  <h4 className="text-white font-bold">{p.name}</h4>
                  <p className="text-white text-xs">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Contact Strip */}
      <div className="py-8 px-6 flex flex-wrap justify-center gap-8 md:gap-12" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
        <div className="flex items-center gap-2"><MapPin size={16} /> <span className="text-sm font-bold">{business.address}</span></div>
        {getOpeningHours(business) && (
          <div className="flex items-center gap-2"><Clock size={16} /> <span className="text-sm font-bold">{getOpeningHours(business)}</span></div>
        )}
        <a href={getWhatsAppLink(business)} className="flex items-center gap-2" style={{ color: theme.colors.accent }}>
          <MessageCircle size={16} /> <span className="text-sm font-bold">Chat Sekarang</span>
        </a>
      </div>

      {/* Reviews */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: theme.typography.fontDisplay }}>Kata Mereka</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 rounded-2xl" style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface }}>
              <div className="flex mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill={theme.colors.accent} color={theme.colors.accent} />)}
              </div>
              <p className="italic mb-6 text-lg">&quot;{r.text}&quot;</p>
              <p className="font-bold">{r.author}</p>
            </div>
          ))}
        </div>
      </section>

      <LayoutFooter business={business} theme={theme} />
      <StickyWA business={business} theme={theme} />
    </div>
  )
}

/** 5. Floating Cards Layout */
export const CardsLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

  return (
    <div className="min-h-screen py-20 px-6" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Hero Image Card */}
        {business.imageUrl && (
          <div className="relative h-56 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
          </div>
        )}

        {/* Header Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: theme.colors.surface, border: `${theme.styles.borderWidth} solid ${theme.colors.border}` }}
        >
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: theme.colors.accent }} />
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: theme.typography.fontDisplay }}>{business.name}</h1>
          <p className="opacity-70 mb-8">{business.description}</p>
          <a href={getWhatsAppLink(business)} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-wider" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
            <MessageCircle size={20} /> Hubungi Kami
          </a>
        </motion.div>

        {/* Gallery Cards */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((img, i) => (
              <div key={i} className="relative h-32 rounded-[1.5rem] overflow-hidden shadow-lg">
                <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-[2rem] shadow-lg flex flex-col items-center text-center gap-3" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.accent + '20', color: theme.colors.accent }}><MapPin size={20} /></div>
            <span className="text-[10px] font-bold uppercase opacity-50">Alamat</span>
            <p className="text-[11px] font-bold h-8 overflow-hidden">{business.address}</p>
          </div>
          <div className="p-6 rounded-[2rem] shadow-lg flex flex-col items-center text-center gap-3" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.accent + '20', color: theme.colors.accent }}><Clock size={20} /></div>
            <span className="text-[10px] font-bold uppercase opacity-50">Jam Buka</span>
            <p className="text-[11px] font-bold h-8 overflow-hidden">{getOpeningHours(business) || 'Hubungi kami'}</p>
          </div>
        </div>

        {/* Product Cards */}
        {business.products.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Produk & Layanan</h3>
            {business.products.map(p => (
              <div key={p.id} className="p-5 rounded-[1.5rem] flex items-center justify-between" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, boxShadow: theme.styles.shadow }}>
                <h4 className="font-bold text-sm">{p.name}</h4>
                <span className="px-3 py-1 rounded-full text-[10px] font-black" style={{ backgroundColor: theme.colors.accent + '15', color: theme.colors.accent }}>{p.price || '-'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Ulasan</h3>
          {reviews.map((r, i) => (
            <div key={i} className="p-5 rounded-[1.5rem]" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
              <div className="flex mb-2">
                {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={theme.colors.accent} color={theme.colors.accent} />)}
              </div>
              <p className="text-sm opacity-80 mb-2">{r.text}</p>
              <p className="text-xs font-bold opacity-50">{r.author}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-8 text-center text-[10px] font-bold tracking-[0.2em] opacity-30 uppercase">
          <p>Powered by Etalaso</p>
          <Link href={`/claim/${(business as unknown as Record<string, string>).id || ''}`} className="hover:underline normal-case tracking-normal">
            Klaim bisnis ini →
          </Link>
        </div>
      </div>

      <StickyWA business={business} theme={theme} />
    </div>
  )
}

/** 6. Magazine / Editorial Layout */
export const MagazineLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const hours = getOpeningHours(business)
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      {/* Masthead */}
      <header className="border-b py-4 px-6 text-center" style={{ borderColor: theme.colors.border }}>
        <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-50">Etalaso Presents</span>
      </header>

      {/* Hero — magazine spread */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8" style={{ fontFamily: theme.typography.fontDisplay }}>
            {business.name}
          </h1>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <p className="text-xl md:text-2xl leading-relaxed opacity-70 md:w-1/2">
              {business.description || 'Pilihan terbaik untuk kebutuhan Anda.'}
            </p>
            <div className="md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} style={{ color: theme.colors.accent }} />
                <span className="opacity-70">{business.address}</span>
              </div>
              {hours && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} style={{ color: theme.colors.accent }} />
                  <span className="opacity-70">{hours}</span>
                </div>
              )}
              <a href={getWhatsAppLink(business)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm w-fit" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
                <MessageCircle size={16} /> Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Full-bleed hero image */}
      {business.imageUrl && (
        <div className="relative w-full h-[50vh] md:h-[70vh]">
          <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
        </div>
      )}

      {/* Gallery — horizontal scroll */}
      {gallery.length > 0 && (
        <section className="py-16 overflow-hidden">
          <div className="flex gap-4 px-6 overflow-x-auto scrollbar-none">
            {gallery.map((img, i) => (
              <div key={i} className="relative flex-shrink-0 w-72 h-48 rounded-xl overflow-hidden">
                <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products — editorial grid */}
      {business.products.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="border-t pt-12 mb-12" style={{ borderColor: theme.colors.border }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] opacity-40 mb-2">Menu & Layanan</h2>
            <h3 className="text-4xl font-bold" style={{ fontFamily: theme.typography.fontDisplay }}>Produk Unggulan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {business.products.map(p => (
              <div key={p.id} className="flex gap-5">
                {p.imageUrl && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-lg">{p.name}</h4>
                    <span className="font-bold" style={{ color: theme.colors.accent }}>{p.price || '-'}</span>
                  </div>
                  <p className="text-sm opacity-60">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews — quote style */}
      <section className="py-20 px-6" style={{ backgroundColor: theme.colors.surface }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] opacity-40 mb-12 text-center">Kata Pelanggan</h2>
          <div className="space-y-12">
            {reviews.map((r, i) => (
              <blockquote key={i} className="text-center">
                <p className="text-2xl md:text-3xl italic leading-relaxed mb-4" style={{ fontFamily: theme.typography.fontSerif }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <cite className="not-italic text-sm font-bold opacity-50">— {r.author}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <LayoutFooter business={business} theme={theme} />
      <StickyWA business={business} theme={theme} />
    </div>
  )
}

/** 7. Sidebar Layout */
export const SidebarLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const hours = getOpeningHours(business)
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      {/* Sidebar */}
      <aside className="w-full md:w-80 md:min-h-screen md:sticky md:top-0 p-8 flex flex-col" style={{ backgroundColor: theme.colors.surface, borderRight: `1px solid ${theme.colors.border}` }}>
        {business.imageUrl && (
          <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6">
            <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
          </div>
        )}
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: theme.typography.fontDisplay }}>{business.name}</h1>
        <p className="text-sm opacity-70 mb-8 leading-relaxed">{business.description}</p>

        <div className="space-y-4 mb-8 text-sm">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: theme.colors.accent }} />
            <span className="opacity-70">{business.address}</span>
          </div>
          {hours && (
            <div className="flex items-center gap-3">
              <Clock size={16} className="flex-shrink-0" style={{ color: theme.colors.accent }} />
              <span className="opacity-70">{hours}</span>
            </div>
          )}
          {business.whatsappNumber && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="flex-shrink-0" style={{ color: theme.colors.accent }} />
              <span className="opacity-70">{business.whatsappNumber}</span>
            </div>
          )}
        </div>

        <a href={getWhatsAppLink(business)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
          <MessageCircle size={16} /> Chat WhatsApp
        </a>
        <a href={getMapsLink(business)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm mt-3 border" style={{ borderColor: theme.colors.border }}>
          <MapPin size={16} /> Buka Maps
        </a>

        <div className="mt-auto pt-8 text-[10px] opacity-30">
          <p>© {new Date().getFullYear()} {business.name}</p>
          <Link href={`/claim/${(business as unknown as Record<string, string>).id || ''}`} className="hover:underline">Klaim bisnis ini →</Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-8 md:p-12 max-w-4xl">
        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-12">
            {gallery.map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 h-56' : 'h-36'}`}>
                <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {business.products.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: theme.typography.fontDisplay }}>Produk & Layanan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {business.products.map(p => (
                <div key={p.id} className="rounded-xl overflow-hidden border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
                  {p.imageUrl && (
                    <div className="relative h-36">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{p.name}</h4>
                      <span className="text-sm font-bold" style={{ color: theme.colors.accent }}>{p.price || '-'}</span>
                    </div>
                    {p.description && <p className="text-xs opacity-60 mt-1">{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: theme.typography.fontDisplay }}>Ulasan</h2>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.colors.accent + '20', color: theme.colors.accent }}>
                    {r.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{r.author}</p>
                    <div className="flex">{[...Array(5)].map((_, j) => <Star key={j} size={10} fill={theme.colors.accent} color={theme.colors.accent} />)}</div>
                  </div>
                </div>
                <p className="text-sm opacity-80">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

/** 8. Stack / Full-Section Layout */
export const StackLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const hours = getOpeningHours(business)
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      {/* Section 1: Hero — fullscreen */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {business.imageUrl && (
          <>
            <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center max-w-3xl">
          <h1
            className="text-5xl md:text-8xl font-black mb-6"
            style={{ fontFamily: theme.typography.fontDisplay, color: business.imageUrl ? '#fff' : theme.colors.text }}
          >
            {business.name}
          </h1>
          <p className="text-lg md:text-2xl mb-10 opacity-80" style={{ color: business.imageUrl ? '#fff' : theme.colors.text }}>
            {business.description || 'Pilihan terbaik untuk kebutuhan Anda.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={getWhatsAppLink(business)} className="px-8 py-4 rounded-full font-bold flex items-center gap-2" style={{ backgroundColor: theme.colors.accent, color: '#fff' }}>
              <MessageCircle size={20} /> Chat Sekarang
            </a>
            <a href={getMapsLink(business)} className="px-8 py-4 rounded-full font-bold border border-white/30 flex items-center gap-2" style={{ color: business.imageUrl ? '#fff' : theme.colors.text }}>
              <MapPin size={20} /> Lokasi
            </a>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Gallery strip */}
      {gallery.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4">
          {gallery.map((img, i) => (
            <div key={i} className="relative h-48 md:h-72">
              <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </section>
      )}

      {/* Section 3: Info bar */}
      <section className="py-16 px-6" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <MapPin size={28} className="mx-auto mb-3 opacity-70" />
            <h3 className="font-bold mb-1">Alamat</h3>
            <p className="text-sm opacity-70">{business.address}</p>
          </div>
          <div>
            <Clock size={28} className="mx-auto mb-3 opacity-70" />
            <h3 className="font-bold mb-1">Jam Buka</h3>
            <p className="text-sm opacity-70">{hours || 'Hubungi kami'}</p>
          </div>
          <div>
            <Phone size={28} className="mx-auto mb-3 opacity-70" />
            <h3 className="font-bold mb-1">Kontak</h3>
            <p className="text-sm opacity-70">{business.whatsappNumber || '-'}</p>
          </div>
        </div>
      </section>

      {/* Section 4: Products */}
      {business.products.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: theme.typography.fontDisplay }}>Produk & Layanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {business.products.map(p => (
                <div key={p.id} className="group overflow-hidden" style={{ borderRadius: theme.styles.borderRadius, border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface }}>
                  {p.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-1">{p.name}</h4>
                    <p className="text-sm opacity-60 mb-3">{p.description}</p>
                    <span className="font-bold" style={{ color: theme.colors.accent }}>{p.price || 'Hubungi Kami'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Reviews */}
      <section className="py-20 px-6" style={{ backgroundColor: theme.colors.surface }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: theme.typography.fontDisplay }}>Ulasan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="p-8 rounded-2xl text-center" style={{ backgroundColor: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                <div className="flex justify-center mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={16} fill={theme.colors.accent} color={theme.colors.accent} />)}</div>
                <p className="italic mb-4 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <p className="font-bold text-sm">{r.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LayoutFooter business={business} theme={theme} />
      <StickyWA business={business} theme={theme} />
    </div>
  )
}

/** 9. Compact Layout — dense, mobile-optimized */
export const CompactLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const hours = getOpeningHours(business)
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      {/* Compact header with image */}
      <header className="relative">
        {business.imageUrl ? (
          <div className="relative h-44">
            <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${theme.colors.background}, transparent)` }} />
          </div>
        ) : (
          <div className="h-16" style={{ backgroundColor: theme.colors.primary }} />
        )}
        <div className={`px-5 ${business.imageUrl ? '-mt-10 relative z-10' : 'pt-6'}`}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: theme.typography.fontDisplay }}>{business.name}</h1>
          {business.category && (
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full" style={{ backgroundColor: theme.colors.accent + '20', color: theme.colors.accent }}>
              {business.category}
            </span>
          )}
        </div>
      </header>

      <div className="px-5 py-4 space-y-5">
        {/* Quick info row */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {hours && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium flex-shrink-0 border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
              <Clock size={12} style={{ color: theme.colors.accent }} /> {hours}
            </div>
          )}
          <a href={getMapsLink(business)} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium flex-shrink-0 border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
            <MapPin size={12} style={{ color: theme.colors.accent }} /> Maps
          </a>
          <a href={getWhatsAppLink(business)} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold flex-shrink-0" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
            <MessageCircle size={12} /> WhatsApp
          </a>
        </div>

        {/* Description */}
        <p className="text-sm opacity-70 leading-relaxed">{business.description}</p>

        {/* Gallery — compact horizontal */}
        {gallery.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-5 px-5">
            {gallery.map((img, i) => (
              <div key={i} className="relative flex-shrink-0 w-36 h-24 rounded-xl overflow-hidden">
                <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Products — compact list */}
        {business.products.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-3 uppercase tracking-wide opacity-50">Menu & Produk</h3>
            <div className="divide-y" style={{ borderColor: theme.colors.border }}>
              {business.products.map(p => (
                <div key={p.id} className="flex items-center gap-3 py-3" style={{ borderColor: theme.colors.border }}>
                  {p.imageUrl && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm truncate">{p.name}</h4>
                    {p.description && <p className="text-xs opacity-50 truncate">{p.description}</p>}
                  </div>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: theme.colors.accent }}>{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews — compact */}
        <div>
          <h3 className="font-bold text-sm mb-3 uppercase tracking-wide opacity-50">Ulasan</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-5 px-5 pb-2">
            {reviews.map((r, i) => (
              <div key={i} className="flex-shrink-0 w-64 p-4 rounded-xl border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
                <div className="flex mb-2">{[...Array(5)].map((_, j) => <Star key={j} size={10} fill={theme.colors.accent} color={theme.colors.accent} />)}</div>
                <p className="text-xs opacity-80 mb-2 line-clamp-3">{r.text}</p>
                <p className="text-[10px] font-bold opacity-50">{r.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="p-4 rounded-xl border text-sm" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: theme.colors.accent }} />
            <p className="opacity-70">{business.address}</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <a href={getWhatsAppLink(business)} className="block w-full py-4 rounded-xl text-center font-bold" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
          <span className="flex items-center justify-center gap-2"><MessageCircle size={18} /> Hubungi via WhatsApp</span>
        </a>

        {/* Footer */}
        <div className="pt-4 pb-8 text-center text-[10px] opacity-30">
          <p>© {new Date().getFullYear()} {business.name}. Powered by Etalaso.</p>
          <Link href={`/claim/${(business as unknown as Record<string, string>).id || ''}`} className="hover:underline">Klaim bisnis ini →</Link>
        </div>
      </div>
    </div>
  )
}

/** 10. Showcase Layout — product spotlight */
export const ShowcaseLayout: React.FC<LayoutProps> = ({ business, theme }) => {
  const hours = getOpeningHours(business)
  const reviews = getReviews(business)
  const gallery = business.galleryImages || []

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fontSans }}>
      {/* Floating nav */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-md" style={{ backgroundColor: theme.colors.background + 'ee', borderBottom: `1px solid ${theme.colors.border}` }}>
        <h1 className="font-bold text-lg" style={{ fontFamily: theme.typography.fontDisplay }}>{business.name}</h1>
        <div className="flex gap-2">
          <a href={getMapsLink(business)} className="p-2 rounded-lg border" style={{ borderColor: theme.colors.border }}><MapPin size={16} /></a>
          <a href={getWhatsAppLink(business)} className="p-2 rounded-lg" style={{ backgroundColor: theme.colors.accent, color: '#fff' }}><MessageCircle size={16} /></a>
        </div>
      </nav>

      {/* Hero — business banner */}
      {business.imageUrl && (
        <section className="relative h-[40vh] md:h-[50vh]">
          <Image src={business.imageUrl} alt={business.name} fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${theme.colors.background}, transparent 60%)` }} />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: theme.typography.fontDisplay, color: '#fff' }}>{business.name}</h2>
          </div>
        </section>
      )}

      <div className="max-w-6xl mx-auto px-6">
        {/* Description + info */}
        <section className="py-12 flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <p className="text-lg leading-relaxed opacity-80">{business.description}</p>
          </div>
          <div className="md:w-1/3 p-6 rounded-2xl" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: theme.colors.accent }} />
                <span className="opacity-70">{business.address}</span>
              </div>
              {hours && (
                <div className="flex items-center gap-3">
                  <Clock size={16} style={{ color: theme.colors.accent }} />
                  <span className="opacity-70">{hours}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery masonry */}
        {gallery.length > 0 && (
          <section className="pb-12">
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <div key={i} className={`relative overflow-hidden rounded-xl ${i === 0 ? 'row-span-2 col-span-2' : ''}`} style={{ aspectRatio: i === 0 ? '16/9' : '1' }}>
                  <Image src={img} alt={`${business.name} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products — showcase cards with big images */}
        {business.products.length > 0 && (
          <section className="py-12">
            <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: theme.typography.fontDisplay }}>Produk Unggulan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {business.products.map(p => (
                <div key={p.id} className="group rounded-2xl overflow-hidden" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  {p.imageUrl ? (
                    <div className="relative h-56 overflow-hidden">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                        {p.price || 'Hubungi'}
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center" style={{ backgroundColor: theme.colors.border + '40' }}>
                      <span className="text-sm opacity-40">{p.name}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h4 className="font-bold text-lg mb-1">{p.name}</h4>
                    <p className="text-sm opacity-60 mb-4">{p.description}</p>
                    <a href={getWhatsAppLink(business)} className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: theme.colors.accent }}>
                      Pesan <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: theme.typography.fontDisplay }}>Ulasan Pelanggan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: theme.colors.accent, color: '#fff' }}>
                    {r.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{r.author}</p>
                    <div className="flex">{[...Array(5)].map((_, j) => <Star key={j} size={12} fill={theme.colors.accent} color={theme.colors.accent} />)}</div>
                  </div>
                </div>
                <p className="text-sm opacity-80">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <LayoutFooter business={business} theme={theme} />
      <StickyWA business={business} theme={theme} />
    </div>
  )
}
