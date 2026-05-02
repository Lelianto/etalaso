'use client'

import React from 'react'
import ClassicStorefront from './ClassicStorefront'
import ModernStorefront from './ModernStorefront'
import CompactStorefront from './CompactStorefront'
import VisualImmersiveStorefront from './VisualImmersiveStorefront'
import BentoStorefront from './BentoStorefront'
import EditorialStorefront from './EditorialStorefront'
import { BusinessData } from '../templates/types'
import { getTemplateTheme } from '../templates/registry'

// List of specialized storefront variants
const STOREFRONT_REGISTRY: Record<string, React.FC<{ business: any, theme: any }>> = {
  classic: ClassicStorefront,
  kuliner: ClassicStorefront,
  modern: ModernStorefront,
  compact: CompactStorefront,
  visual_immersive: VisualImmersiveStorefront,
  bento: BentoStorefront,
  editorial: EditorialStorefront,
}

interface StorefrontFactoryProps {
  variant?: string
  business: BusinessData
}

export function StorefrontFactory({ variant = 'classic', business }: StorefrontFactoryProps) {
  // Resolve the theme based on the variant (template ID)
  const theme = getTemplateTheme(variant)
  
  // Determine which layout to use.
  let layoutKey = variant
  
  // Handle dynamic storefront IDs: sf-[cl|md|cp]-[theme]
  if (variant.startsWith('sf-')) {
    const parts = variant.split('-')
    if (parts.length === 3) {
      const type = parts[1]
      if (type === 'cl') layoutKey = 'classic'
      if (type === 'md') layoutKey = 'modern'
      if (type === 'cp') layoutKey = 'compact'
      if (type === 'vi') layoutKey = 'visual_immersive'
      if (type === 'bt') layoutKey = 'bento'
      if (type === 'ed') layoutKey = 'editorial'
    }
  }

  // If it's one of the specialized layouts, use it.
  // Otherwise, default to 'classic' but with the selected theme's colors.
  const Storefront = STOREFRONT_REGISTRY[layoutKey] || STOREFRONT_REGISTRY.classic
  
  return <Storefront business={business} theme={theme} />
}
