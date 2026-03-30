'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TemplateFactory, TEMPLATE_REGISTRY } from '@/components/templates/TemplateFactory'
import type { BusinessData } from '@/components/templates/types'

/** All template entries: 6 legacy + premium, limited to 2 per layout type */
const RAW_TEMPLATES = [
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

// Limit to max 2 templates per layout type
function limitPerLayout(templates: typeof RAW_TEMPLATES, max = 2) {
  const counts: Record<string, number> = {}
  return templates.filter(t => {
    counts[t.layout] = (counts[t.layout] || 0) + 1
    return counts[t.layout] <= max
  })
}

const ALL_TEMPLATES = limitPerLayout(RAW_TEMPLATES)

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
  const [hintVisible, setHintVisible] = useState(true)
  const searchParams = useSearchParams()
  const fromUrl = searchParams.get('from')

  // Auto-dismiss hint after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHintVisible(false), 8000)
    return () => clearTimeout(timer)
  }, [])

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
    setHintVisible(false)
  }

  const goPrev = () => {
    const prev = (activeIndex - 1 + ALL_TEMPLATES.length) % ALL_TEMPLATES.length
    setActiveId(ALL_TEMPLATES[prev].id)
    setHintVisible(false)
  }

  return (
    <div className="relative min-h-screen">
      {/* ─── Top bar ─── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Back to business */}
          {fromUrl && (
            <Link
              href={fromUrl}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 shrink-0"
              title="Kembali ke halaman bisnis"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
          )}
          {/* Prev/Next */}
          <button onClick={goPrev} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Current template info — styled as a visible selector */}
          <button
            onClick={() => { setPanelOpen(!panelOpen); setHintVisible(false) }}
            className={`flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold rounded-lg py-1.5 px-3 transition-all border ${
              panelOpen
                ? 'bg-white/15 border-white/30'
                : hintVisible
                  ? 'bg-white/10 border-white/20 animate-pulse'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="truncate">
              {activeTemplate?.name || activeId}
            </span>
            <span className="text-white/40 text-xs font-normal shrink-0">
              {activeIndex + 1}/{ALL_TEMPLATES.length}
            </span>
            <svg
              className={`w-3.5 h-3.5 text-white/40 transition-transform shrink-0 ${panelOpen ? 'rotate-180' : ''}`}
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

      {/* ─── Hint banner ─── */}
      {hintVisible && !panelOpen && (
        <div className="fixed top-[52px] left-0 right-0 z-[45] bg-indigo-600 text-white text-xs text-center py-1.5 px-4 flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          <span>Tap nama template di atas untuk lihat {ALL_TEMPLATES.length} pilihan lainnya</span>
          <button onClick={() => setHintVisible(false)} className="ml-2 text-white/70 hover:text-white">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

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

      {/* ─── Floating WhatsApp CTA ─── */}
      <a
        href="https://wa.me/6281578777654?text=Halo%20admin%20Etalaso%2C%20saya%20tertarik%20untuk%20mendaftarkan%20bisnis%20saya."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-sm shadow-2xl hover:scale-105 transition-transform active:scale-95 bg-green-500 hover:bg-green-600"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Hubungi via WhatsApp
      </a>
    </div>
  )
}
