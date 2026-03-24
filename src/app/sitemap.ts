import type { MetadataRoute } from 'next'
import supabase from '@/lib/db/supabase'
import { BASE_URL, toSlug } from '@/lib/seo/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/bisnis`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Fetch all businesses for individual pages
  const { data: businesses } = await supabase
    .from('Business')
    .select('name, kecamatan, category, updatedAt')
    .order('updatedAt', { ascending: false })

  if (businesses) {
    // Add city listing pages
    const cities = [...new Set(businesses.map(b => b.kecamatan).filter(Boolean))]
    for (const city of cities) {
      entries.push({
        url: `${BASE_URL}/bisnis/${toSlug(city!)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    // Add category per city pages
    const cityCategories = new Set<string>()
    for (const biz of businesses) {
      if (biz.kecamatan && biz.category) {
        const key = `${toSlug(biz.kecamatan)}/${toSlug(biz.category)}`
        cityCategories.add(key)
      }
    }
    for (const key of cityCategories) {
      entries.push({
        url: `${BASE_URL}/p/${key}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    // Add individual business pages
    for (const biz of businesses) {
      const city = toSlug(biz.kecamatan || 'indonesia')
      const category = toSlug(biz.category || 'bisnis')
      const slug = toSlug(biz.name)
      entries.push({
        url: `${BASE_URL}/p/${city}/${category}/${slug}`,
        lastModified: biz.updatedAt ? new Date(biz.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  return entries
}
