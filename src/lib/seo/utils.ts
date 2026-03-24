export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://etalaso.id'

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
