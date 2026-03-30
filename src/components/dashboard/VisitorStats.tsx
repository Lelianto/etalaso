'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalViews: number
  totalClicks: number
  dailyViews: Record<string, number>
  dailyClicks: Record<string, number>
}

export default function VisitorStats({ planId }: { planId: string }) {
  const [stats7, setStats7] = useState<Stats | null>(null)
  const [stats30, setStats30] = useState<Stats | null>(null)
  const [period, setPeriod] = useState<7 | 30>(7)
  const [loading, setLoading] = useState(true)

  const isFree = planId === 'free'

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/stats?days=7').then(r => r.json()),
      fetch('/api/analytics/stats?days=30').then(r => r.json()),
    ]).then(([s7, s30]) => {
      setStats7(s7)
      setStats30(s30)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const stats = period === 7 ? stats7 : stats30

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="h-32 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Statistik Pengunjung</h2>
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setPeriod(7)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              period === 7 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            7 Hari
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              period === 30 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            30 Hari
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 mb-1">Halaman Dilihat</p>
          <p className={`text-2xl font-black text-blue-800 ${isFree ? 'blur-sm select-none' : ''}`}>
            {stats?.totalViews ?? 0}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-600 mb-1">Klik WhatsApp</p>
          <p className={`text-2xl font-black text-green-800 ${isFree ? 'blur-sm select-none' : ''}`}>
            {stats?.totalClicks ?? 0}
          </p>
        </div>
      </div>

      {isFree ? (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 text-center">
          <p className="text-indigo-800 text-sm font-semibold mb-1">
            Upgrade untuk lihat detail pengunjung
          </p>
          <p className="text-indigo-600 text-xs mb-3">
            Lihat grafik harian, tren kunjungan, dan klik WhatsApp
          </p>
          <Link
            href="/dashboard/upgrade"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2 rounded-xl transition-colors"
          >
            Upgrade Sekarang
          </Link>
        </div>
      ) : (
        /* Daily chart for paid users */
        <DailyChart
          dailyViews={stats?.dailyViews || {}}
          dailyClicks={stats?.dailyClicks || {}}
          days={period}
        />
      )}
    </div>
  )
}

function DailyChart({ dailyViews, dailyClicks, days }: {
  dailyViews: Record<string, number>
  dailyClicks: Record<string, number>
  days: number
}) {
  // Generate date labels for the period
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }

  const viewValues = dates.map(d => dailyViews[d] || 0)
  const clickValues = dates.map(d => dailyClicks[d] || 0)
  const maxVal = Math.max(...viewValues, ...clickValues, 1)

  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-400" />
          <span className="text-xs text-slate-500">Views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <span className="text-xs text-slate-500">WA Clicks</span>
        </div>
      </div>

      <div className="flex items-end gap-[2px] h-24">
        {dates.map((date, i) => {
          const vHeight = (viewValues[i] / maxVal) * 100
          const cHeight = (clickValues[i] / maxVal) * 100
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-[1px]" title={`${date}: ${viewValues[i]} views, ${clickValues[i]} clicks`}>
              <div className="w-full flex gap-[1px] items-end h-20">
                <div
                  className="flex-1 bg-blue-300 rounded-t-sm min-h-[2px]"
                  style={{ height: `${Math.max(vHeight, 2)}%` }}
                />
                <div
                  className="flex-1 bg-green-300 rounded-t-sm min-h-[2px]"
                  style={{ height: `${Math.max(cHeight, 2)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400">
          {new Date(dates[0]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>
        <span className="text-[10px] text-slate-400">
          {new Date(dates[dates.length - 1]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  )
}
