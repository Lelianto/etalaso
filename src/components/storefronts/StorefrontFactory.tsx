'use client'

import React from 'react'
import ClassicStorefront from './ClassicStorefront'
import ModernStorefront from './ModernStorefront'
import CompactStorefront from './CompactStorefront'
import { BusinessData } from '../templates/types'

// For now we'll define a few variants. 
// In the future, these can be completely different components.
const STOREFRONT_REGISTRY: Record<string, React.FC<{ business: any }>> = {
  classic: ClassicStorefront,
  modern: ModernStorefront,
  compact: CompactStorefront,
}

interface StorefrontFactoryProps {
  variant?: string
  business: BusinessData
}

export function StorefrontFactory({ variant = 'classic', business }: StorefrontFactoryProps) {
  const Storefront = STOREFRONT_REGISTRY[variant] || STOREFRONT_REGISTRY.classic
  
  return <Storefront business={business} />
}
