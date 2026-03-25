'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface CategoryFilterProps {
  categories: Array<{ name: string; count: number }>
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const active = searchParams.get('kategori') || ''

  const setCategory = useCallback((cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set('kategori', cat)
    } else {
      params.delete('kategori')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, router, pathname])

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory('')}
        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
          !active
            ? 'bg-charcoal text-white border-charcoal'
            : 'bg-white text-charcoal border-neutral-200 hover:border-amber/40 hover:bg-amber/5'
        }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => setCategory(cat.name)}
          className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
            active === cat.name
              ? 'bg-charcoal text-white border-charcoal'
              : 'bg-white text-charcoal border-neutral-200 hover:border-amber/40 hover:bg-amber/5'
          }`}
        >
          {cat.name} <span className={active === cat.name ? 'text-neutral-300' : 'text-neutral-400'}>({cat.count})</span>
        </button>
      ))}
    </div>
  )
}
