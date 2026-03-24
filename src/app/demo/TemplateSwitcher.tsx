'use client'

import React, { useState, useMemo } from 'react'
import { TemplateFactory, TEMPLATE_REGISTRY } from '@/components/templates/TemplateFactory'
import type { BusinessData } from '@/components/templates/types'

/** All template entries: 6 legacy + 144 premium */
const ALL_TEMPLATES = [
  { id: 'minimal',  name: 'Minimalist', layout: 'legacy', category: 'Dasar' },
  { id: 'warung',   name: 'Warung',     layout: 'legacy', category: 'Dasar' },
  { id: 'elegant',  name: 'Elegant',    layout: 'legacy', category: 'Dasar' },
  { id: 'bold',     name: 'Bold',       layout: 'legacy', category: 'Dasar' },
  { id: 'card',     name: 'Card',       layout: 'legacy', category: 'Dasar' },
  { id: 'glass',    name: 'Glass',      layout: 'legacy', category: 'Dasar' },
  ...Object.values(TEMPLATE_REGISTRY).map(t => ({
    id: t.id,
    name: t.name,
    layout: t.layout,
    category: t.category,
  })),
]

const LAYOUTS = ['Semua', 'legacy', 'standard', 'split', 'app', 'gallery', 'cards', 'magazine', 'sidebar', 'stack', 'compact', 'showcase']
const LAYOUT_LABELS: Record<string, string> = {
  'Semua': 'Semua', legacy: 'Legacy', standard: 'Standard',
  split: 'Split', app: 'App', gallery: 'Gallery', cards: 'Cards',
  magazine: 'Magazine', sidebar: 'Sidebar', stack: 'Stack',
  compact: 'Compact', showcase: 'Showcase',
}

export default function TemplateSwitcher({ business }: { business: BusinessData }) {
  const [activeId, setActiveId] = useState('minimal')
  const [panelOpen, setPanelOpen] = useState(false)
  const [layoutFilter, setLayoutFilter] = useState('Semua')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return ALL_TEMPLATES.filter(t => {
      if (layoutFilter !== 'Semua' && t.layout !== layoutFilter) return false
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [layoutFilter, search])

  const activeTemplate = ALL_TEMPLATES.find(t => t.id === activeId)
  const activeIndex = ALL_TEMPLATES.findIndex(t => t.id === activeId)

  const goNext = () => {
    const next = (activeIndex + 1) % ALL_TEMPLATES.length
    setActiveId(ALL_TEMPLATES[next].id)
  }

  const goPrev = () => {
    const prev = (activeIndex - 1 + ALL_TEMPLATES.length) % ALL_TEMPLATES.length
    setActiveId(ALL_TEMPLATES[prev].id)
  }

  return (
    <div className="relative min-h-screen">
      {/* ─── Top bar ─── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Prev/Next */}
          <button onClick={goPrev} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Current template info */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold hover:bg-white/5 rounded-lg py-1 px-2 transition-colors"
          >
            <span className="truncate">
              {activeTemplate?.name || activeId}
            </span>
            <span className="text-white/40 text-xs font-normal">
              {activeIndex + 1}/{ALL_TEMPLATES.length}
            </span>
            <svg
              className={`w-3.5 h-3.5 text-white/40 transition-transform ${panelOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Next */}
          <button onClick={goNext} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* ─── Slide-down panel ─── */}
      {panelOpen && (
        <div className="fixed top-[52px] left-0 right-0 bottom-0 z-40 bg-black/95 backdrop-blur-xl overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 space-y-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Cari template..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm border border-white/10 focus:border-white/30 focus:outline-none"
            />

            {/* Layout filter */}
            <div className="flex flex-wrap gap-1.5">
              {LAYOUTS.map(l => (
                <button
                  key={l}
                  onClick={() => setLayoutFilter(l)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    layoutFilter === l
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {LAYOUT_LABELS[l]} {l !== 'Semua' && (
                    <span className="text-white/30 ml-1">
                      {ALL_TEMPLATES.filter(t => t.layout === l).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <p className="text-white/30 text-xs">{filtered.length} template</p>

            {/* Template grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filtered.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setActiveId(t.id); setPanelOpen(false) }}
                  className={`text-left rounded-xl p-3 transition-all border ${
                    activeId === t.id
                      ? 'bg-white/20 border-white/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <p className="text-white text-xs font-semibold truncate">{t.name}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{t.layout} &bull; {t.category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Template content ─── */}
      <div className="pt-[52px]">
        <TemplateFactory templateId={activeId} business={business} />
      </div>
    </div>
  )
}
