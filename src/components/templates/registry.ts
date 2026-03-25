/**
 * Template registry data — server-safe (no 'use client').
 * Separated from TemplateFactory so it can be imported in server components.
 */
import { THEMES, type ThemeType, type LayoutType } from './DesignSystem'

export interface TemplateDefinition {
  id: string
  name: string
  category: string
  layout: LayoutType
  theme: ThemeType
}

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  // ─── Standard Layout ──────────────────────────────────
  'std-minimal':    { id: 'std-minimal',    name: 'Pure Clean',       category: 'Minimalis',  layout: 'standard', theme: 'minimal' },
  'std-midnight':   { id: 'std-midnight',   name: 'Midnight Pro',     category: 'Dark',       layout: 'standard', theme: 'midnight' },
  'std-elegant':    { id: 'std-elegant',    name: 'Elegant Classic',  category: 'Premium',    layout: 'standard', theme: 'elegant' },
  'std-emerald':    { id: 'std-emerald',    name: 'Emerald Fresh',    category: 'Nature',     layout: 'standard', theme: 'emerald' },
  'std-sunset':     { id: 'std-sunset',     name: 'Sunset Warm',      category: 'Warm',       layout: 'standard', theme: 'sunset' },
  'std-ocean':      { id: 'std-ocean',      name: 'Ocean Blue',       category: 'Cool',       layout: 'standard', theme: 'ocean' },
  'std-neo':        { id: 'std-neo',        name: 'Neo-Brutal',       category: 'Bold',       layout: 'standard', theme: 'neobrutalist' },
  'std-business':   { id: 'std-business',   name: 'Trust Pro',        category: 'Bisnis',     layout: 'standard', theme: 'business' },
  'std-nordic':     { id: 'std-nordic',     name: 'Nordic Clean',     category: 'Minimalis',  layout: 'standard', theme: 'nordic' },
  'std-luxury':     { id: 'std-luxury',     name: 'Luxury Gold',      category: 'Premium',    layout: 'standard', theme: 'luxury' },
  'std-industrial': { id: 'std-industrial', name: 'Loft Industrial',  category: 'Bold',       layout: 'standard', theme: 'industrial' },
  'std-organic':    { id: 'std-organic',    name: 'Earth Organic',    category: 'Nature',     layout: 'standard', theme: 'organic' },
  'std-creative':   { id: 'std-creative',   name: 'Bold Creative',    category: 'Bold',       layout: 'standard', theme: 'creative' },
  'std-retro':      { id: 'std-retro',      name: '80s Retro',        category: 'Retro',      layout: 'standard', theme: 'retro' },
  'std-candy':      { id: 'std-candy',      name: 'Sweet Candy',      category: 'Fun',        layout: 'standard', theme: 'candy' },
  'std-playful':    { id: 'std-playful',    name: 'Playful Pop',      category: 'Fun',        layout: 'standard', theme: 'playful' },
  'std-cyberpunk':  { id: 'std-cyberpunk',  name: 'Neon Cyber',       category: 'Dark',       layout: 'standard', theme: 'cyberpunk' },
  'std-glass':      { id: 'std-glass',      name: 'Aero Glass',       category: 'Modern',     layout: 'standard', theme: 'glass' },
  'std-dark-nordic':   { id: 'std-dark-nordic',   name: 'Nordic Night',    category: 'Dark',    layout: 'standard', theme: 'nordic_dark' },
  'std-dark-elegant':  { id: 'std-dark-elegant',  name: 'Elegant Dark',    category: 'Dark',    layout: 'standard', theme: 'elegant_dark' },

  // ─── Split Layout ─────────────────────────────────────
  'split-minimal':    { id: 'split-minimal',    name: 'Split Clean',     category: 'Minimalis',  layout: 'split', theme: 'minimal' },
  'split-glass':      { id: 'split-glass',      name: 'Glass Modern',    category: 'Modern',     layout: 'split', theme: 'glass' },
  'split-sunset':     { id: 'split-sunset',     name: 'Sunset Glow',     category: 'Warm',       layout: 'split', theme: 'sunset' },
  'split-emerald':    { id: 'split-emerald',    name: 'Emerald Forest',  category: 'Nature',     layout: 'split', theme: 'emerald' },
  'split-midnight':   { id: 'split-midnight',   name: 'Midnight Split',  category: 'Dark',       layout: 'split', theme: 'midnight' },
  'split-elegant':    { id: 'split-elegant',    name: 'Elegant Split',   category: 'Premium',    layout: 'split', theme: 'elegant' },
  'split-neo':        { id: 'split-neo',        name: 'Brutal Split',    category: 'Bold',       layout: 'split', theme: 'neobrutalist' },
  'split-business':   { id: 'split-business',   name: 'Corporate',       category: 'Bisnis',     layout: 'split', theme: 'business' },
  'split-luxury':     { id: 'split-luxury',     name: 'Luxury Split',    category: 'Premium',    layout: 'split', theme: 'luxury' },
  'split-ocean':      { id: 'split-ocean',      name: 'Ocean Split',     category: 'Cool',       layout: 'split', theme: 'ocean' },
  'split-candy':      { id: 'split-candy',      name: 'Candy Split',     category: 'Fun',        layout: 'split', theme: 'candy' },
  'split-organic':    { id: 'split-organic',     name: 'Organic Split',  category: 'Nature',     layout: 'split', theme: 'organic' },
  'split-dark-elegant': { id: 'split-dark-elegant', name: 'Dark Elegant Split', category: 'Dark', layout: 'split', theme: 'elegant_dark' },
  'split-nordic':     { id: 'split-nordic',     name: 'Nordic Split',    category: 'Minimalis', layout: 'split', theme: 'nordic' },
  'split-retro':      { id: 'split-retro',      name: 'Retro Split',     category: 'Retro',     layout: 'split', theme: 'retro' },
  'split-creative':   { id: 'split-creative',   name: 'Creative Split',  category: 'Bold',      layout: 'split', theme: 'creative' },
  'split-industrial': { id: 'split-industrial', name: 'Industrial Split', category: 'Bold',     layout: 'split', theme: 'industrial' },
  'split-playful':    { id: 'split-playful',    name: 'Playful Split',   category: 'Fun',       layout: 'split', theme: 'playful' },
  'split-cyberpunk':  { id: 'split-cyberpunk',  name: 'Neon Split',      category: 'Dark',      layout: 'split', theme: 'cyberpunk' },
  'split-dark-nordic':{ id: 'split-dark-nordic',name: 'Nordic Night Split', category: 'Dark',   layout: 'split', theme: 'nordic_dark' },

  // ─── App Layout ───────────────────────────────────────
  'app-minimal':    { id: 'app-minimal',    name: 'App Clean',       category: 'Minimalis', layout: 'app', theme: 'minimal' },
  'app-midnight':   { id: 'app-midnight',   name: 'App Dark',        category: 'Dark',      layout: 'app', theme: 'midnight' },
  'app-emerald':    { id: 'app-emerald',    name: 'App Nature',      category: 'Nature',    layout: 'app', theme: 'emerald' },
  'app-sunset':     { id: 'app-sunset',     name: 'App Warm',        category: 'Warm',      layout: 'app', theme: 'sunset' },
  'app-glass':      { id: 'app-glass',      name: 'App Glass',       category: 'Modern',    layout: 'app', theme: 'glass' },
  'app-neo':        { id: 'app-neo',        name: 'App Brutal',      category: 'Bold',      layout: 'app', theme: 'neobrutalist' },
  'app-business':   { id: 'app-business',   name: 'App Corporate',   category: 'Bisnis',    layout: 'app', theme: 'business' },
  'app-candy':      { id: 'app-candy',      name: 'App Playful',     category: 'Fun',       layout: 'app', theme: 'candy' },
  'app-luxury':     { id: 'app-luxury',     name: 'App Luxury',      category: 'Premium',   layout: 'app', theme: 'luxury' },
  'app-cyberpunk':  { id: 'app-cyberpunk',  name: 'App Neon',        category: 'Dark',      layout: 'app', theme: 'cyberpunk' },
  'app-nordic':     { id: 'app-nordic',     name: 'App Nordic',      category: 'Minimalis', layout: 'app', theme: 'nordic' },
  'app-ocean':      { id: 'app-ocean',      name: 'App Ocean',       category: 'Cool',      layout: 'app', theme: 'ocean' },
  'app-elegant':    { id: 'app-elegant',    name: 'App Elegant',     category: 'Premium',   layout: 'app', theme: 'elegant' },
  'app-retro':      { id: 'app-retro',      name: 'App Retro',       category: 'Retro',     layout: 'app', theme: 'retro' },
  'app-creative':   { id: 'app-creative',   name: 'App Creative',    category: 'Bold',      layout: 'app', theme: 'creative' },
  'app-organic':    { id: 'app-organic',    name: 'App Earth',       category: 'Nature',    layout: 'app', theme: 'organic' },
  'app-industrial': { id: 'app-industrial', name: 'App Loft',        category: 'Bold',      layout: 'app', theme: 'industrial' },
  'app-playful':    { id: 'app-playful',    name: 'App Pop',         category: 'Fun',       layout: 'app', theme: 'playful' },
  'app-dark-elegant': { id: 'app-dark-elegant', name: 'App Dark Elegant', category: 'Dark', layout: 'app', theme: 'elegant_dark' },
  'app-dark-nordic':  { id: 'app-dark-nordic',  name: 'App Nordic Night', category: 'Dark', layout: 'app', theme: 'nordic_dark' },

  // ─── Gallery Layout ───────────────────────────────────
  'gallery-minimal':   { id: 'gallery-minimal',   name: 'Gallery Clean',    category: 'Minimalis', layout: 'gallery', theme: 'minimal' },
  'gallery-midnight':  { id: 'gallery-midnight',  name: 'Gallery Dark',     category: 'Dark',      layout: 'gallery', theme: 'midnight' },
  'gallery-elegant':   { id: 'gallery-elegant',   name: 'Gallery Elegant',  category: 'Premium',   layout: 'gallery', theme: 'elegant' },
  'gallery-sunset':    { id: 'gallery-sunset',    name: 'Gallery Warm',     category: 'Warm',      layout: 'gallery', theme: 'sunset' },
  'gallery-emerald':   { id: 'gallery-emerald',   name: 'Gallery Nature',   category: 'Nature',    layout: 'gallery', theme: 'emerald' },
  'gallery-luxury':    { id: 'gallery-luxury',    name: 'Gallery Luxury',   category: 'Premium',   layout: 'gallery', theme: 'luxury' },
  'gallery-cyberpunk': { id: 'gallery-cyberpunk', name: 'Gallery Neon',     category: 'Dark',      layout: 'gallery', theme: 'cyberpunk' },
  'gallery-ocean':     { id: 'gallery-ocean',     name: 'Gallery Ocean',    category: 'Cool',      layout: 'gallery', theme: 'ocean' },
  'gallery-industrial':{ id: 'gallery-industrial',name: 'Gallery Loft',     category: 'Bold',      layout: 'gallery', theme: 'industrial' },
  'gallery-retro':     { id: 'gallery-retro',     name: 'Gallery Retro',    category: 'Retro',     layout: 'gallery', theme: 'retro' },
  'gallery-glass':     { id: 'gallery-glass',     name: 'Gallery Glass',    category: 'Modern',    layout: 'gallery', theme: 'glass' },
  'gallery-neo':       { id: 'gallery-neo',       name: 'Gallery Brutal',   category: 'Bold',      layout: 'gallery', theme: 'neobrutalist' },
  'gallery-business':  { id: 'gallery-business',  name: 'Gallery Business', category: 'Bisnis',    layout: 'gallery', theme: 'business' },
  'gallery-candy':     { id: 'gallery-candy',     name: 'Gallery Sweet',    category: 'Fun',       layout: 'gallery', theme: 'candy' },
  'gallery-nordic':    { id: 'gallery-nordic',    name: 'Gallery Nordic',   category: 'Minimalis', layout: 'gallery', theme: 'nordic' },
  'gallery-organic':   { id: 'gallery-organic',   name: 'Gallery Earth',    category: 'Nature',    layout: 'gallery', theme: 'organic' },

  // ─── Cards Layout ─────────────────────────────────────
  'cards-minimal':   { id: 'cards-minimal',   name: 'Cards Clean',     category: 'Minimalis', layout: 'cards', theme: 'minimal' },
  'cards-midnight':  { id: 'cards-midnight',  name: 'Cards Dark',      category: 'Dark',      layout: 'cards', theme: 'midnight' },
  'cards-elegant':   { id: 'cards-elegant',   name: 'Cards Elegant',   category: 'Premium',   layout: 'cards', theme: 'elegant' },
  'cards-sunset':    { id: 'cards-sunset',    name: 'Cards Warm',      category: 'Warm',      layout: 'cards', theme: 'sunset' },
  'cards-glass':     { id: 'cards-glass',     name: 'Cards Glass',     category: 'Modern',    layout: 'cards', theme: 'glass' },
  'cards-neo':       { id: 'cards-neo',       name: 'Cards Brutal',    category: 'Bold',      layout: 'cards', theme: 'neobrutalist' },
  'cards-playful':   { id: 'cards-playful',   name: 'Cards Playful',   category: 'Fun',       layout: 'cards', theme: 'playful' },
  'cards-organic':   { id: 'cards-organic',   name: 'Cards Earth',     category: 'Nature',    layout: 'cards', theme: 'organic' },
  'cards-candy':     { id: 'cards-candy',     name: 'Cards Sweet',     category: 'Fun',       layout: 'cards', theme: 'candy' },
  'cards-luxury':    { id: 'cards-luxury',    name: 'Cards Luxury',    category: 'Premium',   layout: 'cards', theme: 'luxury' },
  'cards-business':  { id: 'cards-business',  name: 'Cards Corporate', category: 'Bisnis',   layout: 'cards', theme: 'business' },
  'cards-ocean':     { id: 'cards-ocean',     name: 'Cards Ocean',     category: 'Cool',      layout: 'cards', theme: 'ocean' },
  'cards-emerald':   { id: 'cards-emerald',   name: 'Cards Fresh',     category: 'Nature',    layout: 'cards', theme: 'emerald' },
  'cards-retro':     { id: 'cards-retro',     name: 'Cards Retro',     category: 'Retro',     layout: 'cards', theme: 'retro' },
  'cards-nordic':    { id: 'cards-nordic',    name: 'Cards Nordic',    category: 'Minimalis', layout: 'cards', theme: 'nordic' },
  'cards-industrial':{ id: 'cards-industrial',name: 'Cards Loft',     category: 'Bold',      layout: 'cards', theme: 'industrial' },
  'cards-creative':  { id: 'cards-creative',  name: 'Cards Creative',  category: 'Bold',      layout: 'cards', theme: 'creative' },
  'cards-cyberpunk': { id: 'cards-cyberpunk', name: 'Cards Neon',      category: 'Dark',      layout: 'cards', theme: 'cyberpunk' },

  // ─── Magazine Layout ─────────────────────────────────
  'mag-minimal':    { id: 'mag-minimal',    name: 'Editorial Clean',   category: 'Minimalis', layout: 'magazine', theme: 'minimal' },
  'mag-midnight':   { id: 'mag-midnight',   name: 'Dark Editorial',    category: 'Dark',      layout: 'magazine', theme: 'midnight' },
  'mag-elegant':    { id: 'mag-elegant',    name: 'Luxury Editorial',  category: 'Premium',   layout: 'magazine', theme: 'elegant' },
  'mag-sunset':     { id: 'mag-sunset',     name: 'Warm Editorial',    category: 'Warm',      layout: 'magazine', theme: 'sunset' },
  'mag-ocean':      { id: 'mag-ocean',      name: 'Ocean Editorial',   category: 'Cool',      layout: 'magazine', theme: 'ocean' },
  'mag-luxury':     { id: 'mag-luxury',     name: 'Gold Editorial',    category: 'Premium',   layout: 'magazine', theme: 'luxury' },
  'mag-business':   { id: 'mag-business',   name: 'Corp Editorial',    category: 'Bisnis',    layout: 'magazine', theme: 'business' },
  'mag-organic':    { id: 'mag-organic',    name: 'Earth Editorial',   category: 'Nature',    layout: 'magazine', theme: 'organic' },
  'mag-cyberpunk':  { id: 'mag-cyberpunk',  name: 'Neon Editorial',    category: 'Dark',      layout: 'magazine', theme: 'cyberpunk' },
  'mag-nordic':     { id: 'mag-nordic',     name: 'Nordic Editorial',  category: 'Minimalis', layout: 'magazine', theme: 'nordic' },

  // ─── Sidebar Layout ──────────────────────────────────
  'side-minimal':   { id: 'side-minimal',   name: 'Sidebar Clean',     category: 'Minimalis', layout: 'sidebar', theme: 'minimal' },
  'side-midnight':  { id: 'side-midnight',  name: 'Sidebar Dark',      category: 'Dark',      layout: 'sidebar', theme: 'midnight' },
  'side-elegant':   { id: 'side-elegant',   name: 'Sidebar Elegant',   category: 'Premium',   layout: 'sidebar', theme: 'elegant' },
  'side-emerald':   { id: 'side-emerald',   name: 'Sidebar Nature',    category: 'Nature',    layout: 'sidebar', theme: 'emerald' },
  'side-sunset':    { id: 'side-sunset',    name: 'Sidebar Warm',      category: 'Warm',      layout: 'sidebar', theme: 'sunset' },
  'side-ocean':     { id: 'side-ocean',     name: 'Sidebar Ocean',     category: 'Cool',      layout: 'sidebar', theme: 'ocean' },
  'side-business':  { id: 'side-business',  name: 'Sidebar Corp',      category: 'Bisnis',    layout: 'sidebar', theme: 'business' },
  'side-luxury':    { id: 'side-luxury',    name: 'Sidebar Luxury',    category: 'Premium',   layout: 'sidebar', theme: 'luxury' },
  'side-industrial':{ id: 'side-industrial',name: 'Sidebar Loft',      category: 'Bold',      layout: 'sidebar', theme: 'industrial' },
  'side-nordic':    { id: 'side-nordic',    name: 'Sidebar Nordic',    category: 'Minimalis', layout: 'sidebar', theme: 'nordic' },

  // ─── Stack Layout ────────────────────────────────────
  'stack-minimal':  { id: 'stack-minimal',  name: 'Stack Clean',       category: 'Minimalis', layout: 'stack', theme: 'minimal' },
  'stack-midnight': { id: 'stack-midnight', name: 'Stack Dark',        category: 'Dark',      layout: 'stack', theme: 'midnight' },
  'stack-elegant':  { id: 'stack-elegant',  name: 'Stack Elegant',     category: 'Premium',   layout: 'stack', theme: 'elegant' },
  'stack-emerald':  { id: 'stack-emerald',  name: 'Stack Nature',      category: 'Nature',    layout: 'stack', theme: 'emerald' },
  'stack-sunset':   { id: 'stack-sunset',   name: 'Stack Warm',        category: 'Warm',      layout: 'stack', theme: 'sunset' },
  'stack-ocean':    { id: 'stack-ocean',    name: 'Stack Ocean',       category: 'Cool',      layout: 'stack', theme: 'ocean' },
  'stack-neo':      { id: 'stack-neo',      name: 'Stack Brutal',      category: 'Bold',      layout: 'stack', theme: 'neobrutalist' },
  'stack-luxury':   { id: 'stack-luxury',   name: 'Stack Luxury',      category: 'Premium',   layout: 'stack', theme: 'luxury' },
  'stack-cyberpunk':{ id: 'stack-cyberpunk',name: 'Stack Neon',        category: 'Dark',      layout: 'stack', theme: 'cyberpunk' },
  'stack-business': { id: 'stack-business', name: 'Stack Corp',        category: 'Bisnis',    layout: 'stack', theme: 'business' },

  // ─── Compact Layout ──────────────────────────────────
  'cmpct-minimal':  { id: 'cmpct-minimal',  name: 'Compact Clean',     category: 'Minimalis', layout: 'compact', theme: 'minimal' },
  'cmpct-midnight': { id: 'cmpct-midnight', name: 'Compact Dark',      category: 'Dark',      layout: 'compact', theme: 'midnight' },
  'cmpct-sunset':   { id: 'cmpct-sunset',   name: 'Compact Warm',      category: 'Warm',      layout: 'compact', theme: 'sunset' },
  'cmpct-emerald':  { id: 'cmpct-emerald',  name: 'Compact Nature',    category: 'Nature',    layout: 'compact', theme: 'emerald' },
  'cmpct-ocean':    { id: 'cmpct-ocean',    name: 'Compact Ocean',     category: 'Cool',      layout: 'compact', theme: 'ocean' },
  'cmpct-candy':    { id: 'cmpct-candy',    name: 'Compact Sweet',     category: 'Fun',       layout: 'compact', theme: 'candy' },
  'cmpct-business': { id: 'cmpct-business', name: 'Compact Corp',      category: 'Bisnis',    layout: 'compact', theme: 'business' },
  'cmpct-organic':  { id: 'cmpct-organic',  name: 'Compact Earth',     category: 'Nature',    layout: 'compact', theme: 'organic' },
  'cmpct-glass':    { id: 'cmpct-glass',    name: 'Compact Glass',     category: 'Modern',    layout: 'compact', theme: 'glass' },
  'cmpct-playful':  { id: 'cmpct-playful',  name: 'Compact Pop',       category: 'Fun',       layout: 'compact', theme: 'playful' },

  // ─── Showcase Layout ─────────────────────────────────
  'show-minimal':   { id: 'show-minimal',   name: 'Showcase Clean',    category: 'Minimalis', layout: 'showcase', theme: 'minimal' },
  'show-midnight':  { id: 'show-midnight',  name: 'Showcase Dark',     category: 'Dark',      layout: 'showcase', theme: 'midnight' },
  'show-elegant':   { id: 'show-elegant',   name: 'Showcase Elegant',  category: 'Premium',   layout: 'showcase', theme: 'elegant' },
  'show-emerald':   { id: 'show-emerald',   name: 'Showcase Nature',   category: 'Nature',    layout: 'showcase', theme: 'emerald' },
  'show-sunset':    { id: 'show-sunset',    name: 'Showcase Warm',     category: 'Warm',      layout: 'showcase', theme: 'sunset' },
  'show-ocean':     { id: 'show-ocean',     name: 'Showcase Ocean',    category: 'Cool',      layout: 'showcase', theme: 'ocean' },
  'show-luxury':    { id: 'show-luxury',    name: 'Showcase Luxury',   category: 'Premium',   layout: 'showcase', theme: 'luxury' },
  'show-business':  { id: 'show-business',  name: 'Showcase Corp',     category: 'Bisnis',    layout: 'showcase', theme: 'business' },
  'show-cyberpunk': { id: 'show-cyberpunk', name: 'Showcase Neon',     category: 'Dark',      layout: 'showcase', theme: 'cyberpunk' },
  'show-creative':  { id: 'show-creative',  name: 'Showcase Creative', category: 'Bold',      layout: 'showcase', theme: 'creative' },
}

/** Get the theme config for a template ID — server-safe */
export function getTemplateTheme(templateId: string): typeof THEMES.minimal {
  const config = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['std-minimal']
  return THEMES[config.theme] || THEMES.minimal
}
