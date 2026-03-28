import './globals.css'
import type { Metadata } from 'next'
import { DM_Serif_Display, Plus_Jakarta_Sans } from 'next/font/google'

const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://etalaso.id'),
  title: {
    default: 'Etalaso — Platform Bisnis Lokal Indonesia',
    template: '%s | Etalaso',
  },
  description: 'Temukan dan hubungi bisnis lokal terbaik di sekitar Anda via WhatsApp. Ribuan bisnis dari kuliner, bengkel, salon, dan lainnya.',
  keywords: ['bisnis lokal', 'UMKM', 'direktori bisnis', 'WhatsApp bisnis', 'kuliner', 'bengkel', 'salon', 'toko online', 'Indonesia'],
  authors: [{ name: 'Etalaso' }],
  creator: 'Etalaso',
  publisher: 'Etalaso',
  verification: {
    google: '59iFurZnOnw82tpwyFAYG7-knsVL6v0JKBTLO9T_ptU',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Etalaso',
    title: 'Etalaso — Platform Bisnis Lokal Indonesia',
    description: 'Temukan dan hubungi bisnis lokal terbaik di sekitar Anda via WhatsApp.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Etalaso — Platform Bisnis Lokal Indonesia',
    description: 'Temukan dan hubungi bisnis lokal terbaik di sekitar Anda via WhatsApp.',
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'theme-color': '#c8691b',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${dmSerif.variable} ${jakarta.variable} font-[family-name:var(--font-body)]`}>{children}</body>
    </html>
  )
}
