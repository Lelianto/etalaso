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
    .select('id, name, template')
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allowedTemplates: string[] = (profile?.plan as any)?.max_templates || ['minimal']

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Pilih Template</h2>
      <TemplateSelector
        businessId={business.id}
        currentTemplate={business.template || 'minimal'}
        allowedTemplates={allowedTemplates}
      />
    </div>
  )
}
