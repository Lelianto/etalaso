'use client'

import React, { useState } from 'react'
import { MinimalistTemplate, WarungTemplate, ElegantTemplate, BoldTemplate, CardTemplate, GlassTemplate } from '@/components/templates'
import type { BusinessData } from '@/components/templates/types'

const templates = [
  { key: 'minimal', label: 'Minimalist', component: MinimalistTemplate },
  { key: 'warung', label: 'Warung', component: WarungTemplate },
  { key: 'elegant', label: 'Elegant', component: ElegantTemplate },
  { key: 'bold', label: 'Bold', component: BoldTemplate },
  { key: 'card', label: 'Card', component: CardTemplate },
  { key: 'glass', label: 'Glass', component: GlassTemplate },
] as const

export default function TemplateSwitcher({ business }: { business: BusinessData }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const ActiveTemplate = templates[activeIndex].component

  return (
    <div className="relative">
      {/* Template Switcher Bar — fixed bottom on mobile, top on desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
        <div className="bg-black/80 backdrop-blur-xl border-t md:border-t-0 md:border-b border-white/10">
          {/* Mobile: collapsed toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full md:hidden flex items-center justify-between px-4 py-3 text-white text-sm font-semibold"
          >
            <span>Template: {templates[activeIndex].label}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Template buttons — always visible on desktop, toggled on mobile */}
          <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-none">
              <span className="hidden md:block text-white/50 text-xs font-semibold uppercase tracking-wider mr-2 shrink-0">
                Template
              </span>
              {templates.map((t, i) => (
                <button
                  key={t.key}
                  onClick={() => { setActiveIndex(i); setIsOpen(false) }}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    i === activeIndex
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template content — add padding for fixed bar */}
      <div className="md:pt-12 pb-24 md:pb-0">
        <ActiveTemplate business={business} />
      </div>
    </div>
  )
}
