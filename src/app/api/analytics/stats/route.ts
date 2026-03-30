import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's business
  const { data: business } = await supabase
    .from('Business')
    .select('id')
    .eq('ownerId', user.id)
    .limit(1)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'No business' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7')
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString()

  // Get total counts
  const [viewsResult, clicksResult] = await Promise.all([
    supabaseAdmin
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .gte('created_at', sinceStr),
    supabaseAdmin
      .from('wa_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .gte('created_at', sinceStr),
  ])

  // Get daily breakdown (for paid tiers — frontend decides what to show)
  const { data: dailyViews } = await supabaseAdmin
    .from('page_views')
    .select('created_at')
    .eq('business_id', business.id)
    .gte('created_at', sinceStr)
    .order('created_at', { ascending: true })

  const { data: dailyClicks } = await supabaseAdmin
    .from('wa_clicks')
    .select('created_at')
    .eq('business_id', business.id)
    .gte('created_at', sinceStr)
    .order('created_at', { ascending: true })

  // Group by date
  const groupByDate = (items: Array<{ created_at: string }> | null) => {
    const map: Record<string, number> = {}
    for (const item of items || []) {
      const date = item.created_at.split('T')[0]
      map[date] = (map[date] || 0) + 1
    }
    return map
  }

  return NextResponse.json({
    totalViews: viewsResult.count || 0,
    totalClicks: clicksResult.count || 0,
    dailyViews: groupByDate(dailyViews),
    dailyClicks: groupByDate(dailyClicks),
  })
}
