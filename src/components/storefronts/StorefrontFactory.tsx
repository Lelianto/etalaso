'use client'

import React from 'react'
import ClassicStorefront from './ClassicStorefront'
import ModernStorefront from './ModernStorefront'
import CompactStorefront from './CompactStorefront'
import { BusinessData } from '../templates/types'
import { getTemplateTheme } from '../templates/registry'

// List of specialized storefront variants
const STOREFRONT_REGISTRY: Record<string, React.FC<{ business: any, theme: any }>> = {
  classic: ClassicStorefront,
  kuliner: ClassicStorefront,
  modern: ModernStorefront,
  compact: CompactStorefront,
}

interface StorefrontFactoryProps {
  variant?: string
  business: BusinessData
}

export function StorefrontFactory({ variant = 'classic', business }: StorefrontFactoryProps) {
  // Resolve the theme based on the variant (template ID)
  const theme = getTemplateTheme(variant)
  
  // Determine which layout to use. 
  // If it's one of the specialized layouts, use it.
  // Otherwise, default to 'classic' but with the selected theme's colors.
  const Storefront = STOREFRONT_REGISTRY[variant] || STOREFRONT_REGISTRY.classic
  
  return <Storefront business={business} theme={theme} />
}
