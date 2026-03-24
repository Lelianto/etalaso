import './globals.css'
import type { Metadata } from 'next'
import { DM_Serif_Display, Plus_Jakarta_Sans } from 'next/font/google'

const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Etalaso — Platform Bisnis Lokal Indonesia',
  description: 'Temukan dan hubungi bisnis lokal terbaik di sekitar Anda via WhatsApp.',
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
