import supabase from '@/lib/db/supabase'
import { notFound } from 'next/navigation'
import { TemplateFactory } from '@/components/templates'
import type { Metadata } from 'next'

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

  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const catName = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return {
    title: `${business.name} di ${cityName} | ${catName} | Etalaso`,
    description: business.description
      || `Lihat ${business.name}, ${catName} di ${cityName}. Hubungi langsung via WhatsApp. Alamat: ${business.address || cityName}.`,
    openGraph: {
      title: `${business.name} — ${catName} di ${cityName}`,
      description: `${business.name} adalah ${catName.toLowerCase()} di ${cityName}. Lihat produk, review, dan hubungi via WhatsApp di Etalaso.`,
      type: 'website',
    },
  }
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params
  const business = await getBusinessData(slug)

  if (!business) {
    notFound()
  }

  const templateKey = (business.template || 'minimal')

  return <TemplateFactory templateId={templateKey} business={business} />
}
