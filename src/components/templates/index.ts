export { default as MinimalistTemplate } from './minimalist/MinimalistTemplate'
export { default as WarungTemplate } from './warung/WarungTemplate'
export { default as ElegantTemplate } from './elegant/ElegantTemplate'
export { default as BoldTemplate } from './bold/BoldTemplate'
export { default as CardTemplate } from './card/CardTemplate'
export { default as GlassTemplate } from './glass/GlassTemplate'

export * from './TemplateFactory'
export * from './types'

export const TEMPLATES = {
  minimal: 'MinimalistTemplate',
  warung: 'WarungTemplate',
  elegant: 'ElegantTemplate',
  bold: 'BoldTemplate',
  card: 'CardTemplate',
  glass: 'GlassTemplate',
} as const

export type TemplateName = keyof typeof TEMPLATES | string
