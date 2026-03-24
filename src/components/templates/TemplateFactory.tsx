'use client'

import React from 'react'
import { BusinessData } from './types'
import { THEMES, ThemeType, LayoutType } from './DesignSystem'
import { StandardLayout, SplitLayout, AppLayout, GalleryLayout, CardsLayout } from './layouts/Layouts'
import MinimalistTemplate from './minimalist/MinimalistTemplate'
import WarungTemplate from './warung/WarungTemplate'
import ElegantTemplate from './elegant/ElegantTemplate'
import BoldTemplate from './bold/BoldTemplate'
import CardTemplate from './card/CardTemplate'
import GlassTemplate from './glass/GlassTemplate'

export interface TemplateDefinition {
  id: string
  name: string
  layout: LayoutType
  theme: ThemeType
}

/** Legacy Template Mapping */
const LEGACY_TEMPLATES = {
  minimal: MinimalistTemplate,
  warung: WarungTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
  card: CardTemplate,
  glass: GlassTemplate,
} as const

/** 
 * Central Registry of all 100+ Premium Templates.
 * Each template is a unique combination of a Layout and a Theme.
 */
export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  // --- Standard Layout Themes ---
  'std-minimal': { id: 'std-minimal', name: 'Minimal Pure', layout: 'standard', theme: 'minimal' },
  'std-midnight': { id: 'std-midnight', name: 'Midnight Pro', layout: 'standard', theme: 'midnight' },
  'std-neo': { id: 'std-neo', name: 'Neo-Brutalist', layout: 'standard', theme: 'neobrutalist' },
  'std-elegant': { id: 'std-elegant', name: 'Elegant Classic', layout: 'standard', theme: 'elegant' },
  
  // --- Split Layout Themes ---
  'split-glass': { id: 'split-glass', name: 'Glass Modern', layout: 'split', theme: 'glass' },
  'split-sunset': { id: 'split-sunset', name: 'Sunset Glow', layout: 'split', theme: 'sunset' },
  'split-emerald': { id: 'split-emerald', name: 'Emerald Forest', layout: 'split', theme: 'emerald' },
}

// Dynamically generate up to 100 placeholders for demonstration
const LAYOUT_OPTIONS: LayoutType[] = ['standard', 'split', 'app', 'gallery', 'cards']
const THEME_OPTIONS: ThemeType[] = [
  'minimal', 'midnight', 'neobrutalist', 'elegant', 'glass', 
  'emerald', 'sunset', 'ocean', 'candy', 'nordic', 
  'industrial', 'organic', 'creative', 'business', 'retro'
]

// Premium Naming Generator
const ADJECTIVES = ['Azure', 'Onyx', 'Emerald', 'Ivory', 'Slate', 'Golden', 'Sapphire', 'Crimson', 'Urban', 'Stellar', 'Zen', 'Refined', 'Luxe', 'Nordic', 'Velvet']
const NOUNS = ['Studio', 'Pro', 'Essence', 'Flow', 'Vista', 'Edge', 'Pure', 'Horizon', 'Prime', 'Signature', 'Elite', 'Vogue', 'Pulse', 'Zenith', 'Aura']

for (let i = 1; i <= 100; i++) {
  const id = `premium-${i.toString().padStart(3, '0')}`
  if (!TEMPLATE_REGISTRY[id]) {
    const layout = LAYOUT_OPTIONS[i % LAYOUT_OPTIONS.length]
    const theme = THEME_OPTIONS[i % THEME_OPTIONS.length]
    const adj = ADJECTIVES[i % ADJECTIVES.length]
    const noun = NOUNS[i % NOUNS.length]
    
    TEMPLATE_REGISTRY[id] = {
      id,
      name: `${adj} ${noun}`,
      layout,
      theme
    }
  }
}

interface TemplateFactoryProps {
  templateId: string
  business: BusinessData
}

// 5 Templates allowed for UMKM subscribers
export const UMKM_ALLOWED_TEMPLATES = [
  'minimal', 
  'warung', 
  'std-minimal', 
  'std-elegant', 
  'premium-001'
]

export const TemplateFactory: React.FC<TemplateFactoryProps> = ({ templateId, business }) => {
  const isUMKM = business.subscriptionType === 'umkm'
  let activeTemplateId = templateId

  // Enforce UMKM limit
  if (isUMKM && !UMKM_ALLOWED_TEMPLATES.includes(templateId)) {
    activeTemplateId = 'minimal' // Fallback for UMKM
  }

  // 1. Try Legacy Templates first
  if (activeTemplateId in LEGACY_TEMPLATES) {
    const Template = LEGACY_TEMPLATES[activeTemplateId as keyof typeof LEGACY_TEMPLATES]
    return <Template business={business} />
  }

  // 2. Resolve via Design Factory (Layout x Theme)
  const config = TEMPLATE_REGISTRY[activeTemplateId] || TEMPLATE_REGISTRY['std-minimal']
  const theme = THEMES[config.theme] || THEMES.minimal
  
  switch (config.layout) {
    case 'standard': return <StandardLayout business={business} theme={theme} />
    case 'split': return <SplitLayout business={business} theme={theme} />
    case 'app': return <AppLayout business={business} theme={theme} />
    case 'gallery': return <GalleryLayout business={business} theme={theme} />
    case 'cards': return <CardsLayout business={business} theme={theme} />
    default: return <StandardLayout business={business} theme={theme} />
  }
}
