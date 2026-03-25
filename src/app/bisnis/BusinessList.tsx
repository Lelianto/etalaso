'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { toSlug } from '@/lib/seo/utils'
import { REGION_LABELS } from '@/lib/constants/regions'

interface Business {
  placeId: string
  name: string
  address: string | null
  category: string | null
  kecamatan: string | null
  region: string | null
  whatsappNumber: string | null
}

interface Props {
  totalCount: number
  categories: Array<{ name: string; count: number }>
  kecamatans: Array<{ name: string; count: number; region: string }>
}

const CATEGORY_LABELS: Record<string, string> = {
  kuliner: 'Kuliner',
  otomotif: 'Bengkel & Otomotif',
  kecantikan: 'Salon & Kecantikan',
  jasa: 'Jasa',
  retail: 'Toko & Retail',
  kesehatan: 'Apotek & Kesehatan',
  mall: 'Mall & Pusat Belanja',
  rumah_sakit: 'Rumah Sakit',
  klinik: 'Klinik',
  taman: 'Taman & Rekreasi',
  tempat_ibadah: 'Tempat Ibadah',
  lainnya: 'Lainnya',
}

const CATEGORY_ICONS: Record<string, string> = {
  kuliner: '🍜',
  otomotif: '🔧',
  kecantikan: '💇',
  jasa: '👔',
  retail: '🛒',
  kesehatan: '💊',
  mall: '🏬',
  rumah_sakit: '🏥',
  klinik: '🩺',
  taman: '🌳',
  tempat_ibadah: '🕌',
  lainnya: '📦',
}

function formatCount(n: number): string {
  return n.toLocaleString('id-ID')
}

export default function BusinessList({ totalCount, categories, kecamatans }: Props) {
  const [activeCategory, setActiveCategory] = useState('')
  const [activeKecamatan, setActiveKecamatan] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [kecSearch, setKecSearch] = useState('')
  const [kecDropdownOpen, setKecDropdownOpen] = useState(false)

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [resultTotal, setResultTotal] = useState(totalCount)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Close kecamatan dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setKecDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchBusinesses = useCallback(async (pageNum: number, append: boolean) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    const params = new URLSearchParams()
    params.set('page', String(pageNum))
    if (activeCategory) params.set('category', activeCategory)
    if (activeKecamatan) params.set('kecamatan', activeKecamatan)
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim())

    try {
      const res = await fetch(`/api/business/list?${params}`)
      const data = await res.json()
      if (res.ok) {
        setBusinesses(prev => append ? [...prev, ...data.businesses] : data.businesses)
        setResultTotal(data.total)
        setHasMore(data.hasMore)
        setPage(pageNum)
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [activeCategory, activeKecamatan, debouncedSearch])

  // Fetch on filter change (reset to page 1)
  useEffect(() => {
    fetchBusinesses(1, false)
  }, [fetchBusinesses])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBusinesses(page + 1, true)
    }
  }

  const hasActiveFilters = activeCategory || activeKecamatan || debouncedSearch.trim()

  const clearAll = () => {
    setActiveCategory('')
    setActiveKecamatan('')
    setSearch('')
    setDebouncedSearch('')
    setKecSearch('')
  }

  // Group kecamatans by region for the dropdown
  const regionGroups = Object.entries(REGION_LABELS).map(([key, label]) => ({
    region: key,
    label,
    items: kecamatans.filter(k => k.region === key),
  })).filter(g => g.items.length > 0)

  // Filter kecamatan dropdown items by search
  const filteredRegionGroups = kecSearch.trim()
    ? regionGroups.map(g => ({
        ...g,
        items: g.items.filter(k =>
          k.name.toLowerCase().includes(kecSearch.toLowerCase())
        ),
      })).filter(g => g.items.length > 0)
    : regionGroups

  const activeKecLabel = activeKecamatan || 'Semua kecamatan'

  return (
    <div>
      {/* ── Search bar ── */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama bisnis..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-neutral-200 bg-white text-sm text-charcoal placeholder-neutral-400 focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all shadow-sm"
        />
        {search && (
          <button
            onClick={() => { setSearch(''); setDebouncedSearch('') }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Filters row ── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Category filter */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-semibold tracking-wide uppercase text-neutral-400 mb-2.5">Kategori</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                !activeCategory
                  ? 'bg-charcoal text-white border-charcoal shadow-sm'
                  : 'bg-white text-charcoal border-neutral-200 hover:border-neutral-300'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  activeCategory === cat.name
                    ? 'bg-charcoal text-white border-charcoal shadow-sm'
                    : 'bg-white text-charcoal border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <span className="text-base leading-none">{CATEGORY_ICONS[cat.name] || '📦'}</span>
                <span>{CATEGORY_LABELS[cat.name] || cat.name}</span>
                <span className={`text-xs tabular-nums ${activeCategory === cat.name ? 'text-neutral-300' : 'text-neutral-400'}`}>
                  {formatCount(cat.count)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Kecamatan dropdown ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative" ref={dropdownRef}>
          <h2 className="text-xs font-semibold tracking-wide uppercase text-neutral-400 mb-2.5 sm:sr-only">Kecamatan</h2>
          <button
            onClick={() => setKecDropdownOpen(!kecDropdownOpen)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all min-w-[200px] justify-between ${
              activeKecamatan
                ? 'bg-amber/10 text-amber border-amber/30'
                : 'bg-white text-charcoal border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="truncate">{activeKecLabel}</span>
            </span>
            <svg
              className={`w-4 h-4 flex-shrink-0 opacity-40 transition-transform ${kecDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {kecDropdownOpen && (
            <div className="absolute z-30 top-full mt-2 left-0 w-72 bg-white rounded-xl border border-neutral-200 shadow-xl shadow-neutral-200/40 overflow-hidden">
              {/* Search within dropdown */}
              <div className="p-2 border-b border-neutral-100">
                <input
                  type="text"
                  value={kecSearch}
                  onChange={e => setKecSearch(e.target.value)}
                  placeholder="Cari kecamatan..."
                  autoFocus
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-100 text-sm placeholder-neutral-400 focus:border-amber/40 focus:outline-none"
                />
              </div>

              <div className="max-h-64 overflow-y-auto">
                {/* All option */}
                <button
                  onClick={() => { setActiveKecamatan(''); setKecDropdownOpen(false); setKecSearch('') }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                    !activeKecamatan ? 'text-amber font-medium bg-amber/5' : 'text-charcoal'
                  }`}
                >
                  <span>Semua kecamatan</span>
                  <span className="text-xs text-neutral-400 tabular-nums">{formatCount(totalCount)}</span>
                </button>

                {/* Grouped by region */}
                {filteredRegionGroups.map((group) => (
                  <div key={group.region}>
                    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 bg-neutral-50/80 sticky top-0">
                      {group.label}
                    </div>
                    {group.items.map((k) => (
                      <button
                        key={k.name}
                        onClick={() => {
                          setActiveKecamatan(activeKecamatan === k.name ? '' : k.name)
                          setKecDropdownOpen(false)
                          setKecSearch('')
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                          activeKecamatan === k.name ? 'text-amber font-medium bg-amber/5' : 'text-charcoal'
                        }`}
                      >
                        <span className="pl-2">{k.name}</span>
                        <span className="text-xs text-neutral-400 tabular-nums">{formatCount(k.count)}</span>
                      </button>
                    ))}
                  </div>
                ))}

                {filteredRegionGroups.length === 0 && (
                  <p className="px-4 py-6 text-sm text-neutral-400 text-center">Tidak ditemukan</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Active filter summary + reset */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap sm:mt-6">
            {activeCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-charcoal/5 text-xs text-charcoal font-medium">
                {CATEGORY_ICONS[activeCategory]} {CATEGORY_LABELS[activeCategory] || activeCategory}
                <button onClick={() => setActiveCategory('')} className="ml-0.5 text-neutral-400 hover:text-neutral-600">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {activeKecamatan && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber/10 text-xs text-amber font-medium">
                {activeKecamatan}
                <button onClick={() => setActiveKecamatan('')} className="ml-0.5 text-amber/60 hover:text-amber">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            <button
              onClick={clearAll}
              className="text-xs text-neutral-400 hover:text-neutral-600 font-medium transition-colors"
            >
              Reset semua
            </button>
          </div>
        )}
      </div>

      {/* ── Result summary ── */}
      <div className="flex items-center justify-between mb-6 py-3 border-t border-neutral-100">
        <p className="text-sm text-neutral-500">
          Menampilkan <span className="font-semibold text-charcoal">{formatCount(businesses.length)}</span> dari{' '}
          <span className="font-semibold text-charcoal">{formatCount(resultTotal)}</span> bisnis
        </p>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-neutral-100 p-5 animate-pulse">
              <div className="h-4 w-3/4 bg-neutral-100 rounded mb-3" />
              <div className="h-3 w-1/3 bg-neutral-100 rounded mb-3" />
              <div className="h-3 w-full bg-neutral-50 rounded mb-1" />
              <div className="h-3 w-2/3 bg-neutral-50 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && businesses.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-neutral-500 text-lg font-medium">Tidak ada bisnis ditemukan</p>
          <p className="text-neutral-400 text-sm mt-1">
            Coba ubah kata kunci atau filter yang digunakan.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="mt-4 text-sm text-amber font-medium hover:underline"
            >
              Hapus semua filter
            </button>
          )}
        </div>
      )}

      {/* ── Business grid (flat, no grouping) ── */}
      {!loading && businesses.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {businesses.map((biz) => {
              const city = toSlug(biz.kecamatan || 'indonesia')
              const category = toSlug(biz.category || 'bisnis')
              const slug = toSlug(biz.name)
              return (
                <Link
                  key={biz.placeId}
                  href={`/p/${city}/${category}/${slug}`}
                  className="block bg-white rounded-xl border border-neutral-100 p-5 hover:border-amber/40 hover:shadow-md hover:shadow-amber/5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-charcoal group-hover:text-amber transition-colors leading-snug">
                      {biz.name}
                    </div>
                    {biz.whatsappNumber && (
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-50 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {biz.category && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-50 text-xs text-neutral-500">
                        <span className="text-sm leading-none">{CATEGORY_ICONS[biz.category] || '📦'}</span>
                        {CATEGORY_LABELS[biz.category] || biz.category}
                      </span>
                    )}
                    {biz.kecamatan && (
                      <span className="text-xs text-neutral-400">{biz.kecamatan}</span>
                    )}
                  </div>
                  {biz.address && (
                    <p className="mt-2 text-xs text-neutral-400 line-clamp-2 leading-relaxed">{biz.address}</p>
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Load more ── */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-neutral-200 bg-white text-sm font-medium text-charcoal hover:border-neutral-300 hover:bg-neutral-50 transition-all disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memuat...
                  </>
                ) : (
                  <>
                    Muat lebih banyak
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
              <p className="mt-2 text-xs text-neutral-400">
                {formatCount(businesses.length)} dari {formatCount(resultTotal)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
