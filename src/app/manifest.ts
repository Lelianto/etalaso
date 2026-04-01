import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Etalaso — Platform Bisnis Lokal Indonesia',
    short_name: 'Etalaso',
    description: 'Temukan dan hubungi bisnis lokal terbaik di sekitar Anda via WhatsApp.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf7f2',
    theme_color: '#c8691b',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
