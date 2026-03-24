import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

async function main() {
  const { count: totalBusiness } = await s.from('Business').select('*', { count: 'exact', head: true })
  const { count: totalReview } = await s.from('Review').select('*', { count: 'exact', head: true })

  const { data: byKec } = await s.from('Business').select('kecamatan, category')
  const kecCounts: Record<string, number> = {}
  const catCounts: Record<string, number> = {}
  byKec?.forEach(b => {
    kecCounts[b.kecamatan] = (kecCounts[b.kecamatan] || 0) + 1
    catCounts[b.category] = (catCounts[b.category] || 0) + 1
  })

  console.log(`\n📊 Database Summary`)
  console.log(`   Total bisnis: ${totalBusiness}`)
  console.log(`   Total review: ${totalReview}`)
  console.log(`\n📍 Per kecamatan:`)
  for (const [k, v] of Object.entries(kecCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${k}: ${v}`)
  }
  console.log(`\n📂 Per kategori:`)
  for (const [k, v] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${k}: ${v}`)
  }
}

main()
