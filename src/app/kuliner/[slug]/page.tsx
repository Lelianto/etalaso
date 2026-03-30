import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getKulinerStore } from '@/lib/kuliner/queries'
import { BASE_URL, canonicalUrl } from '@/lib/seo/utils'
import OrderingWrapper from '@/components/ordering/OrderingWrapper'
import ViewTracker from '@/components/ui/ViewTracker'
import WaClickTracker from '@/components/ui/WaClickTracker'
import ShareButtons from '@/components/ui/ShareButtons'
import KulinerStorePage from './KulinerStorePage'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const store = await getKulinerStore(slug)

  if (!store) {
    return { title: 'Toko Tidak Ditemukan | Etalaso' }
  }

  const pageUrl = canonicalUrl(`/kuliner/${slug}`)
  const description = store.tagline || store.description || `${store.name} — Usaha kuliner rumahan. Pesan via WhatsApp.`

  return {
    title: `${store.name} — Kuliner Rumahan | Etalaso`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${store.name} — Kuliner Rumahan`,
      description,
      type: 'website',
      url: pageUrl,
      locale: 'id_ID',
      siteName: 'Etalaso',
      images: store.imageUrl ? [{ url: store.imageUrl }] : undefined,
    },
  }
}

export default async function KulinerStoreRoute({ params }: Props) {
  const { slug } = await params
  const store = await getKulinerStore(slug)

  if (!store) notFound()

  // Add empty reviews since kuliner stores don't use review system
  const storeWithReviews = { ...store, reviews: store.reviews || [] }

  const pageUrl = `/kuliner/${slug}`
  const accentColor = '#f59e0b' // amber

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: store.name,
    description: store.tagline || store.description,
    address: store.address ? {
      '@type': 'PostalAddress',
      streetAddress: store.address,
    } : undefined,
    url: `${BASE_URL}${pageUrl}`,
    image: store.imageUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker businessId={store.id} path={pageUrl} />
      <WaClickTracker businessId={store.id}>
        <OrderingWrapper business={storeWithReviews} accentColor={accentColor} category="kuliner_rumahan">
          <KulinerStorePage store={storeWithReviews} />
        </OrderingWrapper>
      </WaClickTracker>
      <div className="fixed bottom-20 left-4 z-40 flex flex-col gap-2">
        <ShareButtons url={pageUrl} title={store.name} />
      </div>
    </>
  )
}
