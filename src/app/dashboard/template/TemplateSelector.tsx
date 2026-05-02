'use client'

import { createClient } from '@/lib/supabase/browser'
import { TEMPLATE_REGISTRY } from '@/components/templates/TemplateFactory'
import { THEMES } from '@/components/templates/DesignSystem'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** Legacy templates info */
// Generate 30+ storefront variations
const STOREFRONT_VARIANTS: Record<string, { name: string; description: string; category: string }> = {
  // Classic Series
  'sf-cl-minimal': { name: 'Classic Minimalist', description: 'Bersih dan simpel', category: 'Storefront' },
  'sf-cl-midnight': { name: 'Classic Midnight', description: 'Gelap dan elegan', category: 'Storefront' },
  'sf-cl-elegant': { name: 'Classic Elegant', description: 'Mewah dan eksklusif', category: 'Storefront' },
  'sf-cl-emerald': { name: 'Classic Emerald', description: 'Segar dan bernuansa alam', category: 'Storefront' },
  'sf-cl-sunset': { name: 'Classic Sunset', description: 'Hangat dan akrab', category: 'Storefront' },
  'sf-cl-ocean': { name: 'Classic Ocean', description: 'Tenang dan sejuk', category: 'Storefront' },
  'sf-cl-nordic': { name: 'Classic Nordic', description: 'Skandinavia minimalis', category: 'Storefront' },
  'sf-cl-luxury': { name: 'Classic Luxury', description: 'Emas dan premium', category: 'Storefront' },
  'sf-cl-cyberpunk': { name: 'Classic Neon', description: 'Gaya masa depan', category: 'Storefront' },
  'sf-cl-retro': { name: 'Classic Retro', description: 'Gaya 80-an yang unik', category: 'Storefront' },

  // Modern Series
  'sf-md-minimal': { name: 'Modern Minimalist', description: 'Grid bersih modern', category: 'Storefront' },
  'sf-md-midnight': { name: 'Modern Midnight', description: 'Grid gelap futuristik', category: 'Storefront' },
  'sf-md-elegant': { name: 'Modern Elegant', description: 'Grid mewah profesional', category: 'Storefront' },
  'sf-md-emerald': { name: 'Modern Emerald', description: 'Grid nuansa hijau', category: 'Storefront' },
  'sf-md-sunset': { name: 'Modern Sunset', description: 'Grid nuansa hangat', category: 'Storefront' },
  'sf-md-ocean': { name: 'Modern Ocean', description: 'Grid nuansa biru', category: 'Storefront' },
  'sf-md-nordic': { name: 'Modern Nordic', description: 'Grid gaya utara', category: 'Storefront' },
  'sf-md-luxury': { name: 'Modern Luxury', description: 'Grid emas premium', category: 'Storefront' },
  'sf-md-cyberpunk': { name: 'Modern Neon', description: 'Grid lampu neon', category: 'Storefront' },
  'sf-md-retro': { name: 'Modern Retro', description: 'Grid klasik unik', category: 'Storefront' },

  // Compact Series
  'sf-cp-minimal': { name: 'Compact Minimalist', description: 'Daftar ringkas bersih', category: 'Storefront' },
  'sf-cp-midnight': { name: 'Compact Midnight', description: 'Daftar ringkas gelap', category: 'Storefront' },
  'sf-cp-elegant': { name: 'Compact Elegant', description: 'Daftar ringkas mewah', category: 'Storefront' },
  'sf-cp-emerald': { name: 'Compact Emerald', description: 'Daftar ringkas segar', category: 'Storefront' },
  'sf-cp-sunset': { name: 'Compact Sunset', description: 'Daftar ringkas hangat', category: 'Storefront' },
  'sf-cp-ocean': { name: 'Compact Ocean', description: 'Daftar ringkas sejuk', category: 'Storefront' },
  'sf-cp-nordic': { name: 'Compact Nordic', description: 'Daftar ringkas Skandi', category: 'Storefront' },
  'sf-cp-luxury': { name: 'Compact Luxury', description: 'Daftar ringkas emas', category: 'Storefront' },
  'sf-cp-cyberpunk': { name: 'Compact Neon', description: 'Daftar ringkas masa depan', category: 'Storefront' },
  'sf-cp-retro': { name: 'Compact Retro', description: 'Daftar ringkas klasik', category: 'Storefront' },

  // Visual Immersive Series
  'sf-vi-minimal': { name: 'Boutique Minimalist', description: 'Cinematic layout bersih', category: 'Storefront' },
  'sf-vi-midnight': { name: 'Boutique Midnight', description: 'Cinematic layout gelap', category: 'Storefront' },
  'sf-vi-elegant': { name: 'Boutique Elegant', description: 'Cinematic layout mewah', category: 'Storefront' },
}

const LEGACY_TEMPLATES: Record<string, { name: string; description: string; category: string }> = {
  minimal: { name: 'Minimalist', description: 'Bersih dan simpel, cocok untuk semua bisnis', category: 'Dasar' },
  warung: { name: 'Warung', description: 'Hangat dan akrab, cocok untuk F&B', category: 'Dasar' },
  elegant: { name: 'Elegant', description: 'Mewah dan eksklusif', category: 'Dasar' },
  bold: { name: 'Bold', description: 'Kontras tinggi, modern', category: 'Dasar' },
  card: { name: 'Card', description: 'Layout kartu, mobile-friendly', category: 'Dasar' },
  glass: { name: 'Glass', description: 'Glassmorphism modern', category: 'Dasar' },
  kuliner: { name: 'Kuliner (Classic)', description: 'Layout khusus kuliner rumahan (Default)', category: 'Storefront' },
  modern: { name: 'Modern Grid', description: 'Tampilan grid 2-kolom modern', category: 'Storefront' },
  compact: { name: 'Compact List', description: 'Tampilan daftar ringkas tanpa gambar besar', category: 'Storefront' },
  visual_immersive: { name: 'Boutique Visual', description: 'Layout sinematik dengan gambar besar', category: 'Storefront' },
  premium_dark: { name: 'Premium Dark', description: 'Tampilan mewah serba gelap', category: 'Storefront' },
  grid_hero: { name: 'Grid Hero', description: 'Grid dengan menu rekomendasi di atas', category: 'Storefront' },
  ...STOREFRONT_VARIANTS,
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
    kuliner: 'background: linear-gradient(135deg, #f59e0b, #d97706)',
    modern: 'background: linear-gradient(135deg, #4f46e5, #0ea5e9)',
    compact: 'background: linear-gradient(135deg, #f1f5f9, #94a3b8)',
    premium_dark: 'background: linear-gradient(135deg, #000, #1e293b)',
    grid_hero: 'background: linear-gradient(135deg, #f59e0b, #4f46e5)',
  }
  return gradients[id] || 'background: linear-gradient(135deg, #e2e8f0, #94a3b8)'
}

const ALL_TEMPLATES = getAllTemplates()

// Collect unique categories in order
const CATEGORIES = ['Semua', ...Array.from(new Set(ALL_TEMPLATES.map(t => t.category)))]

export default function TemplateSelector({ businessId, currentTemplate, allowedTemplates, forcedCategory }: {
  businessId: string
  currentTemplate: string
  allowedTemplates: string[]
  forcedCategory?: string
}) {
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(currentTemplate)
  const [category, setCategory] = useState(forcedCategory || 'Semua')
  const [error, setError] = useState('')
  const router = useRouter()

  const filtered = category === 'Semua'
    ? ALL_TEMPLATES
    : ALL_TEMPLATES.filter(t => t.category === category)

  // Sort templates: allowed templates first, then locked ones
  const sortedTemplates = [...filtered].sort((a, b) => {
    const aAllowed = allowedTemplates.includes(a.id)
    const bAllowed = allowedTemplates.includes(b.id)
    if (aAllowed && !bAllowed) return -1
    if (!aAllowed && bAllowed) return 1
    return 0 // maintain original order for same group
  })

  const handleSelect = async (template: string) => {
    if (!allowedTemplates.includes(template)) return
    setSelected(template)
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: saveErr } = await supabase
      .from('Business')
      .update({ template, updatedAt: new Date().toISOString() })
      .eq('id', businessId)
    setSaving(false)
    if (saveErr) {
      setSelected(currentTemplate)
      setError('Gagal menyimpan template. Silakan coba lagi.')
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Category filter - Hide if forcedCategory is provided */}
      {!forcedCategory && (
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
      )}

      <p className="text-xs text-slate-400">
        {allowedTemplates.length} template tersedia dari paketmu
        {saving && ' • Menyimpan...'}
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3">{error}</div>
      )}

      {/* Template grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedTemplates.map(t => {
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
