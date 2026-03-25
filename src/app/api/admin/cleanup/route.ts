import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * POST /api/admin/cleanup
 *
 * Finds and deletes "dirty" businesses — entries with junk names
 * from Google Maps scraping (e.g. ".", ",,,,", single characters, etc.)
 *
 * Query params:
 *   ?dry=true  — preview only, don't delete (default)
 *   ?dry=false — actually delete
 */
export async function POST(request: Request) {
  // Admin check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from('UserProfile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const dryRun = searchParams.get('dry') !== 'false'

  // Fetch all business names (lightweight - just id + name)
  const allDirty: Array<{ id: number; name: string }> = []
  let from = 0
  const batchSize = 5000

  while (true) {
    const { data } = await supabaseAdmin
      .from('Business')
      .select('id, name')
      .range(from, from + batchSize - 1)

    if (!data || data.length === 0) break

    for (const row of data) {
      if (isDirtyName(row.name)) {
        allDirty.push({ id: row.id, name: row.name })
      }
    }

    if (data.length < batchSize) break
    from += batchSize
  }

  if (dryRun) {
    return NextResponse.json({
      mode: 'dry_run',
      dirtyCount: allDirty.length,
      preview: allDirty.slice(0, 100).map(d => ({ id: d.id, name: d.name })),
      message: `Found ${allDirty.length} dirty entries. Add ?dry=false to actually delete.`,
    })
  }

  // Delete in batches of 200
  let deleted = 0
  const ids = allDirty.map(d => d.id)
  for (let i = 0; i < ids.length; i += 200) {
    const batch = ids.slice(i, i + 200)
    const { error } = await supabaseAdmin
      .from('Business')
      .delete()
      .in('id', batch)

    if (error) {
      return NextResponse.json({
        error: error.message,
        deletedSoFar: deleted,
        remaining: ids.length - deleted,
      }, { status: 500 })
    }
    deleted += batch.length
  }

  return NextResponse.json({
    mode: 'executed',
    deleted,
    message: `Deleted ${deleted} dirty business entries.`,
  })
}

/**
 * Checks if a business name is "dirty" (junk data from scraping).
 *
 * Rules:
 * - After stripping punctuation & whitespace, fewer than 2 letters remain
 * - Name is only dots, commas, dashes, or other punctuation
 * - Name is a single character
 */
function isDirtyName(name: string | null): boolean {
  if (!name) return true

  const trimmed = name.trim()

  // Empty or single character
  if (trimmed.length < 2) return true

  // Strip all non-letter/non-digit characters, check what's left
  const lettersOnly = trimmed.replace(/[^a-zA-Z0-9\u00C0-\u024F\u0400-\u04FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/g, '')
  if (lettersOnly.length < 2) return true

  return false
}
