import { requireAuth } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import TemplateSelector from './TemplateSelector'

export default async function TemplatePage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('UserProfile')
    .select('planId, plan:Plan(max_templates)')
    .eq('id', user.id)
    .single()

  const { data: business } = await supabase
    .from('Business')
    .select('id, name, template, businessType')
    .eq('ownerId', user.id)
    .limit(1)
    .single()

  if (!business) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-400">Klaim bisnis terlebih dahulu untuk memilih template</p>
      </div>
    )
  }

  // Filter based on business type
  const isKulinerRumahan = business.businessType === 'kuliner_rumahan'
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allowedTemplates: string[] = [...((profile?.plan as any)?.max_templates || ['minimal'])]
  
  // Legacy templates
  let legacyIds = ['minimal', 'warung', 'elegant', 'bold', 'card', 'glass']
  if (isKulinerRumahan) {
    // For kuliner rumahan, we ONLY want to show storefront templates to avoid confusion
    legacyIds = ['kuliner', 'modern', 'compact', 'premium_dark', 'grid_hero']
  }
  
  legacyIds.forEach(id => {
    if (!allowedTemplates.includes(id)) allowedTemplates.push(id)
  })

  // Final filter for the actual list displayed in the selector
  const finalTemplates = isKulinerRumahan ? 'Storefront' : undefined

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Pilih Template</h2>
      <TemplateSelector
        businessId={business.id}
        currentTemplate={business.template || 'minimal'}
        allowedTemplates={allowedTemplates}
        forcedCategory={finalTemplates}
        planId={profile?.planId || 'free'}
      />
    </div>
  )
}
