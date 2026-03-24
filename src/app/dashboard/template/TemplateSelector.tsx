'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const TEMPLATE_INFO: Record<string, { name: string; description: string; preview: string }> = {
  minimal: { name: 'Minimalist', description: 'Bersih dan simpel, cocok untuk semua bisnis', preview: 'bg-gradient-to-br from-slate-100 to-slate-200' },
  warung: { name: 'Warung', description: 'Hangat dan akrab, cocok untuk F&B', preview: 'bg-gradient-to-br from-amber-100 to-orange-200' },
  elegant: { name: 'Elegant', description: 'Mewah dan eksklusif, cocok untuk premium', preview: 'bg-gradient-to-br from-slate-800 to-slate-900' },
  bold: { name: 'Bold', description: 'Kontras tinggi, tampilan modern', preview: 'bg-gradient-to-br from-emerald-900 to-black' },
  card: { name: 'Card', description: 'Layout kartu, mobile-friendly', preview: 'bg-gradient-to-br from-indigo-100 to-white' },
  glass: { name: 'Glass', description: 'Glassmorphism modern, efek blur', preview: 'bg-gradient-to-br from-purple-400 to-indigo-600' },
}

export default function TemplateSelector({ businessId, currentTemplate, allowedTemplates }: {
  businessId: string
  currentTemplate: string
  allowedTemplates: string[]
}) {
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(currentTemplate)
  const router = useRouter()

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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Object.entries(TEMPLATE_INFO).map(([key, info]) => {
        const isAllowed = allowedTemplates.includes(key)
        const isActive = selected === key

        return (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={!isAllowed || saving}
            className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
              isActive
                ? 'border-indigo-500 ring-2 ring-indigo-200'
                : isAllowed
                ? 'border-slate-200 hover:border-slate-300'
                : 'border-slate-100 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className={`h-24 ${info.preview} relative`}>
              {isActive && (
                <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Aktif
                </span>
              )}
              {!isAllowed && (
                <span className="absolute top-2 right-2 bg-slate-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Terkunci
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="font-bold text-slate-800 text-sm">{info.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{info.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
