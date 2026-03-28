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
    {
      url: `${BASE_URL}/daftar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Fetch all businesses with pagination (Supabase limits 1000 per query)
  const businesses: Array<{ name: string; kecamatan: string | null; category: string | null; updatedAt: string | null }> = []
  let from = 0
  const batchSize = 1000
  while (true) {
    const { data } = await supabase
      .from('Business')
      .select('name, kecamatan, category, updatedAt')
      .order('updatedAt', { ascending: false })
      .range(from, from + batchSize - 1)
    if (!data || data.length === 0) break
    businesses.push(...data)
    if (data.length < batchSize) break
    from += batchSize
  }

  if (businesses.length > 0) {
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
