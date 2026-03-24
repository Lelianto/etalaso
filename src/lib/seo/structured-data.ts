import { BASE_URL, toSlug } from './utils'
import type { BusinessData } from '@/components/templates/types'

interface StructuredDataParams {
  business: BusinessData & { id?: string }
  city: string
  category: string
  slug: string
}

export function generateBusinessJsonLd({ business, city, category, slug }: StructuredDataParams) {
  const url = `${BASE_URL}/p/${city}/${category}/${slug}`
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const catName = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const reviews = business.reviews.slice(0, 5)
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : undefined

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address || undefined,
      addressLocality: cityName,
      addressCountry: 'ID',
    },
  }

  if (business.description) {
    jsonLd.description = business.description
  }

  if (business.whatsappNumber) {
    jsonLd.telephone = `+${business.whatsappNumber}`
  }

  if (business.latitude && business.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    }
  }

  if (business.openingHours) {
    jsonLd.openingHours = business.openingHours
  }

  if (business.imageUrl) {
    jsonLd.image = business.imageUrl
  }

  // AggregateRating
  if (avgRating !== undefined && reviews.length > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.round(avgRating * 10) / 10,
      reviewCount: business.reviews.length,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Reviews (max 5)
  if (reviews.length > 0) {
    jsonLd.review = reviews.map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
      },
      reviewBody: r.text || undefined,
      datePublished: r.date || undefined,
    }))
  }

  // Products (max 5)
  const products = business.products.slice(0, 5)
  if (products.length > 0) {
    jsonLd.makesOffer = products.map(p => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: p.name,
        description: p.description || undefined,
        image: p.imageUrl || undefined,
      },
      price: p.price || undefined,
      priceCurrency: 'IDR',
    }))
  }

  return jsonLd
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url || undefined,
    })),
  }
}

interface ItemListParams {
  name: string
  description: string
  url: string
  items: Array<{ name: string; url: string; position: number }>
}

export function generateItemListJsonLd({ name, description, url, items }: ItemListParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      url: item.url,
      name: item.name,
    })),
  }
}
