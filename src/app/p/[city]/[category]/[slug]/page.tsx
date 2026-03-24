import supabase from '@/lib/db/supabase'
import { notFound } from 'next/navigation'
import { TemplateFactory, getTemplateTheme } from '@/components/templates'
import type { Metadata } from 'next'
import { BASE_URL, canonicalUrl, fromSlug } from '@/lib/seo/utils'
import { generateBusinessJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/structured-data'
import OrderingWrapper from '@/components/ordering/OrderingWrapper'
import { canDineIn } from '@/lib/ordering/tier'

export const revalidate = 86400 // 1 day

type Props = { params: Promise<{ city: string; category: string; slug: string }> }

async function getBusinessData(slug: string) {
  // Sanitize slug — remove PostgREST metacharacters to prevent filter injection
  const sanitized = slug.replace(/[,()]/g, '')

  // Try exact placeId match first
  const { data: byPlaceId } = await supabase
    .from('Business')
    .select('*, products:Product(*), reviews:Review(*)')
    .eq('placeId', sanitized)
    .limit(1)
    .single()

  if (byPlaceId) return byPlaceId

  // Build search words from slug, filtering out empty strings
  const words = sanitized.split('-').filter(w => w.length > 1)
  if (words.length === 0) return null

  // Search using all significant words with ilike for fuzzy matching
  let query = supabase
    .from('Business')
    .select('*, products:Product(*), reviews:Review(*)')
  for (const word of words) {
    query = query.ilike('name', `%${word}%`)
  }
  const { data: byName } = await query.limit(1).single()

  return byName
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, city, category } = await params
  const business = await getBusinessData(slug)

  if (!business) {
    return { title: 'Bisnis Tidak Ditemukan | Etalaso' }
  }

  const cityName = fromSlug(city)
  const catName = fromSlug(category)
  const pageUrl = canonicalUrl(`/p/${city}/${category}/${slug}`)

  const description = business.description
    || `Lihat ${business.name}, ${catName} di ${cityName}. Hubungi langsung via WhatsApp. Alamat: ${business.address || cityName}.`

  return {
    title: `${business.name} di ${cityName} | ${catName} | Etalaso`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${business.name} — ${catName} di ${cityName}`,
      description: `${business.name} adalah ${catName.toLowerCase()} di ${cityName}. Lihat produk, review, dan hubungi via WhatsApp di Etalaso.`,
      type: 'website',
      url: pageUrl,
      locale: 'id_ID',
      siteName: 'Etalaso',
      images: business.imageUrl ? [{ url: business.imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${business.name} — ${catName} di ${cityName}`,
      description,
    },
  }
}

export default async function BusinessPage({ params }: Props) {
  const { slug, city, category } = await params
  const business = await getBusinessData(slug)

  if (!business) {
    notFound()
  }

  const templateKey = (business.template || 'minimal')
  const cityName = fromSlug(city)
  const catName = fromSlug(category)

  const businessJsonLd = generateBusinessJsonLd({ business, city, category, slug })
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Beranda', url: BASE_URL },
    { name: cityName, url: canonicalUrl(`/bisnis/${city}`) },
    { name: catName, url: canonicalUrl(`/p/${city}/${category}`) },
    { name: business.name },
  ])

  // Ordering is only enabled for kuliner category with paid tiers
  const isKuliner = category === 'kuliner'
  const tier = business.subscriptionType || 'free'
  const orderingEnabled = isKuliner && canDineIn(tier)
  const theme = getTemplateTheme(templateKey)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {orderingEnabled ? (
        <OrderingWrapper business={business} accentColor={theme.colors.accent}>
          <TemplateFactory templateId={templateKey} business={business} orderingActive />
        </OrderingWrapper>
      ) : isKuliner ? (
        <OrderingWrapper business={business} accentColor={theme.colors.accent}>
          <TemplateFactory templateId={templateKey} business={business} />
        </OrderingWrapper>
      ) : (
        <TemplateFactory templateId={templateKey} business={business} />
      )}
    </>
  )
}
