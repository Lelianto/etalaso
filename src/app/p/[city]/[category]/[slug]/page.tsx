import supabase from '@/lib/db/supabase'
import { notFound } from 'next/navigation'
import { 
  MinimalistTemplate, WarungTemplate, ElegantTemplate, 
  BoldTemplate, CardTemplate, GlassTemplate,
  TemplateFactory
} from '@/components/templates'
import type { Metadata } from 'next'

export const revalidate = 86400 // 1 day

type Props = { params: Promise<{ city: string; category: string; slug: string }> }

async function getBusinessData(slug: string) {
  const searchName = slug.split('-').join(' ')

  const { data: business } = await supabase
    .from('Business')
    .select('*, products:Product(*), reviews:Review(*)')
    .or(`name.ilike.%${searchName}%,placeId.eq.${slug}`)
    .limit(1)
    .single()

  return business
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
