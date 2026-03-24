'use client'

import { createClient } from '@/lib/supabase/browser'
import { TEMPLATE_REGISTRY } from '@/components/templates/TemplateFactory'
import { THEMES } from '@/components/templates/DesignSystem'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** Legacy templates info */
const LEGACY_TEMPLATES: Record<string, { name: string; description: string; category: string }> = {
  minimal: { name: 'Minimalist', description: 'Bersih dan simpel, cocok untuk semua bisnis', category: 'Dasar' },
  warung: { name: 'Warung', description: 'Hangat dan akrab, cocok untuk F&B', category: 'Dasar' },
  elegant: { name: 'Elegant', description: 'Mewah dan eksklusif', category: 'Dasar' },
  bold: { name: 'Bold', description: 'Kontras tinggi, modern', category: 'Dasar' },
  card: { name: 'Card', description: 'Layout kartu, mobile-friendly', category: 'Dasar' },
  glass: { name: 'Glass', description: 'Glassmorphism modern', category: 'Dasar' },
}

/** Build a flat list of all 100 templates with display info */
function getAllTemplates() {
  const templates: Array<{
    id: string
    name: string
    description: string
    category: string
    bgPreview: string
  }> = []

  // Legacy templates
  for (const [id, info] of Object.entries(LEGACY_TEMPLATES)) {
    templates.push({
      id,
      name: info.name,
      description: info.description,
      category: info.category,
      bgPreview: getPreviewGradient(id),
    })
  }

  // Premium templates from registry
  for (const [id, def] of Object.entries(TEMPLATE_REGISTRY)) {
    const theme = THEMES[def.theme]
    templates.push({
      id,
      name: def.name,
      description: `${def.layout} • ${theme?.name || def.theme}`,
      category: def.category,
      bgPreview: theme
        ? `background: linear-gradient(135deg, ${theme.colors.background}, ${theme.colors.primary})`
        : getPreviewGradient(id),
    })
  }

  return templates
}

function getPreviewGradient(id: string): string {
  const gradients: Record<string, string> = {
    minimal: 'background: linear-gradient(135deg, #f1f5f9, #e2e8f0)',
    warung: 'background: linear-gradient(135deg, #fef3c7, #fed7aa)',
    elegant: 'background: linear-gradient(135deg, #1e293b, #0f172a)',
    bold: 'background: linear-gradient(135deg, #064e3b, #000)',
    card: 'background: linear-gradient(135deg, #e0e7ff, #fff)',
    glass: 'background: linear-gradient(135deg, #a78bfa, #4f46e5)',
  }
  return gradients[id] || 'background: linear-gradient(135deg, #e2e8f0, #94a3b8)'
}

const ALL_TEMPLATES = getAllTemplates()

// Collect unique categories in order
const CATEGORIES = ['Semua', ...Array.from(new Set(ALL_TEMPLATES.map(t => t.category)))]

export default function TemplateSelector({ businessId, currentTemplate, allowedTemplates }: {
  businessId: string
  currentTemplate: string
  allowedTemplates: string[]
}) {
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(currentTemplate)
  const [category, setCategory] = useState('Semua')
  const router = useRouter()

  const filtered = category === 'Semua'
    ? ALL_TEMPLATES
    : ALL_TEMPLATES.filter(t => t.category === category)

  const handleSelect = async (template: string) => {
    if (!allowedTemplates.includes(template)) return
    setSelected(template)
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('Business')
      .update({ template, updatedAt: new Date().toISOString() })
      .eq('id', businessId)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              category === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        {allowedTemplates.length} template tersedia dari paketmu
        {saving && ' • Menyimpan...'}
      </p>

      {/* Template grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(t => {
          const isAllowed = allowedTemplates.includes(t.id)
          const isActive = selected === t.id

          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              disabled={!isAllowed || saving}
              className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
                isActive
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : isAllowed
                  ? 'border-slate-200 hover:border-slate-300'
                  : 'border-slate-100 opacity-50 cursor-not-allowed'
              }`}
            >
              <div
                className="h-20 relative"
                style={{ background: t.bgPreview.replace('background: ', '') }}
              >
                {isActive && (
                  <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
                {!isAllowed && (
                  <span className="absolute top-1.5 right-1.5 bg-slate-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    🔒
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="font-bold text-slate-800 text-xs">{t.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{t.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
