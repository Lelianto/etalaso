import { requireAuth } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import ProductManager from './ProductManager'
import MenuPDFDownload from '@/components/dashboard/MenuPDFDownload'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('UserProfile')
    .select('planId, plan:Plan(max_products)')
    .eq('id', user.id)
    .single()

  const { data: business } = await supabase
    .from('Business')
    .select('id, name, whatsappNumber, category, businessType')
    .eq('ownerId', user.id)
    .limit(1)
    .single()

  if (!business) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-400">Klaim bisnis terlebih dahulu untuk mengelola produk</p>
      </div>
    )
  }

  const planId = profile?.planId || 'free'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maxFromPlan = (profile?.plan as any)?.max_products ?? null
  // Fallback if Plan join fails: business=50, umkm=20, free=3
  const maxProducts = maxFromPlan ?? (planId === 'business' ? 50 : planId === 'umkm' ? 20 : 3)

  if (maxProducts === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500 font-semibold mb-2">Fitur Produk Terkunci</p>
          <p className="text-slate-400 text-sm mb-4">Upgrade ke paket UMKM atau Business untuk menambahkan produk.</p>
          <a href="/dashboard/upgrade" className="text-indigo-600 font-semibold text-sm hover:underline">
            Lihat Paket →
          </a>
        </div>

        {/* Show locked PDF CTA even on free tier */}
        <MenuPDFDownload
          businessName={business.name}
          whatsappNumber={business.whatsappNumber}
          products={[]}
          planId={planId}
        />
      </div>
    )
  }

  const { data: products } = await supabase
    .from('Product')
    .select('*')
    .eq('businessId', business.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Produk</h2>
        <p className="text-sm text-slate-500">{products?.length || 0}/{maxProducts} produk</p>
      </div>

      <ProductManager
        businessId={business.id}
        products={products || []}
        maxProducts={maxProducts}
        isKulinerRumahan={business.businessType === 'kuliner_rumahan' || business.category === 'kuliner_rumahan'}
      />

      {/* PDF download CTA — below the product list */}
      <MenuPDFDownload
        businessName={business.name}
        whatsappNumber={business.whatsappNumber}
        products={products || []}
        planId={planId}
      />
    </div>
  )
}
