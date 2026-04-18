export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.etalaso.biz.id'

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function canonicalUrl(path: string): string {
  return `${BASE_URL}${path}`
}

export function fromSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
