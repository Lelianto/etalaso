import supabase from '@/lib/db/supabase'
import { notFound } from 'next/navigation'
import { TemplateFactory } from '@/components/templates'
import { getTemplateTheme } from '@/components/templates/registry'
import type { Metadata } from 'next'
import { BASE_URL, canonicalUrl, fromSlug } from '@/lib/seo/utils'
import { generateBusinessJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/structured-data'
import OrderingWrapper from '@/components/ordering/OrderingWrapper'
import { canOrder } from '@/lib/ordering/tier'
import ProductShowcase from '@/components/ui/ProductShowcase'
import ClaimBanner from '@/components/ui/ClaimBanner'
import { getCategoryConfig } from '@/lib/ordering/category-config'
import ViewTracker from '@/components/ui/ViewTracker'
import WaClickTracker from '@/components/ui/WaClickTracker'
import ReportButton from '@/components/ui/ReportButton'
import ShareButtons from '@/components/ui/ShareButtons'

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

  const tier = business.subscriptionType || 'free'
  const orderingEnabled = canOrder(tier)
  const isFree = !business.subscriptionType || business.subscriptionType === 'free'
  const theme = getTemplateTheme(templateKey)
  const claimUrl = `/claim/${business.id}`

  const isUnclaimed = !business.isClaimed
  const isNewlyClaimed = business.isClaimed && business.claimedAt &&
    (Date.now() - new Date(business.claimedAt).getTime()) < 7 * 24 * 60 * 60 * 1000
  const pageUrl = `/p/${city}/${category}/${slug}`

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
      <ViewTracker businessId={business.id} path={pageUrl} />
      <WaClickTracker businessId={business.id}>
        <OrderingWrapper business={business} accentColor={theme.colors.accent} category={category}>
          <TemplateFactory templateId={templateKey} business={business} orderingActive={orderingEnabled} />
        </OrderingWrapper>
      </WaClickTracker>
      {isUnclaimed && (
        <>
          <ProductShowcase claimUrl={claimUrl} businessUrl={pageUrl} />
          <ClaimBanner claimUrl={claimUrl} bannerText={getCategoryConfig(category).claimBannerText} />
        </>
      )}
      {isNewlyClaimed && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
          Halaman ini baru diklaim. Jika Anda pemilik asli bisnis ini, <a href="mailto:support@etalaso.com" className="underline font-semibold">hubungi kami</a>.
        </div>
      )}
      <div className="fixed bottom-20 left-4 z-40 flex flex-col gap-2">
        <ShareButtons url={pageUrl} title={business.name} />
        <ReportButton businessId={business.id} />
      </div>
    </>
  )
}
