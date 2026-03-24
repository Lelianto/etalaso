import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/seo/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/auth/', '/claim/', '/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
