'use client'

import React from 'react'
import { BusinessData } from './types'
import { THEMES } from './DesignSystem'
import type { LayoutType } from './DesignSystem'
import { TEMPLATE_REGISTRY } from './registry'
import { StandardLayout, SplitLayout, AppLayout, GalleryLayout, CardsLayout, MagazineLayout, SidebarLayout, StackLayout, CompactLayout, ShowcaseLayout } from './layouts/Layouts'
import MinimalistTemplate from './minimalist/MinimalistTemplate'
import WarungTemplate from './warung/WarungTemplate'
import ElegantTemplate from './elegant/ElegantTemplate'
import BoldTemplate from './bold/BoldTemplate'
import CardTemplate from './card/CardTemplate'
import GlassTemplate from './glass/GlassTemplate'

// Re-export for backward compatibility
export { TEMPLATE_REGISTRY, type TemplateDefinition, getTemplateTheme } from './registry'

/** Legacy (hand-crafted) templates — always available as fallback */
const LEGACY_TEMPLATES: Record<string, React.FC<{ business: BusinessData }>> = {
  minimal: MinimalistTemplate,
  warung: WarungTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
  card: CardTemplate,
  glass: GlassTemplate,
}

/** Get total template count (legacy + registry) */
export function getTemplateCount(): number {
  return Object.keys(LEGACY_TEMPLATES).length + Object.keys(TEMPLATE_REGISTRY).length
}

/** Get all templates grouped by category for display */
export function getTemplatesByCategory(): Record<string, Array<typeof TEMPLATE_REGISTRY[string]>> {
  const grouped: Record<string, Array<typeof TEMPLATE_REGISTRY[string]>> = {}
  for (const def of Object.values(TEMPLATE_REGISTRY)) {
    if (!grouped[def.category]) grouped[def.category] = []
    grouped[def.category].push(def)
  }
  return grouped
}

const LAYOUT_MAP: Record<LayoutType, React.FC<{ business: BusinessData; theme: typeof THEMES.minimal; orderingActive?: boolean }>> = {
  standard: StandardLayout,
  split: SplitLayout,
  app: AppLayout,
  gallery: GalleryLayout,
  cards: CardsLayout,
  magazine: MagazineLayout,
  sidebar: SidebarLayout,
  stack: StackLayout,
  compact: CompactLayout,
  showcase: ShowcaseLayout,
}

interface TemplateFactoryProps {
  templateId: string
  business: BusinessData
  orderingActive?: boolean
}

export const TemplateFactory: React.FC<TemplateFactoryProps> = ({ templateId, business, orderingActive = false }) => {
  // 1. Try legacy hand-crafted templates first
  if (templateId in LEGACY_TEMPLATES) {
    const Template = LEGACY_TEMPLATES[templateId]
    return <Template business={business} />
  }

  // 2. Resolve via Design System (Layout × Theme)
  const config = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['std-minimal']
  const theme = THEMES[config.theme] || THEMES.minimal
  const Layout = LAYOUT_MAP[config.layout] || StandardLayout

  return <Layout business={business} theme={theme} orderingActive={orderingActive} />
}
