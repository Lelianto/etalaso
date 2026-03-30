import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { businessId, name, description } = body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Nama kategori wajib diisi' }, { status: 400 })
  }
  if (!businessId || typeof businessId !== 'string') {
    return NextResponse.json({ error: 'Business ID wajib' }, { status: 400 })
  }

  const { error } = await supabase
    .from('SubcategoryRequest')
    .insert({
      userId: user.id,
      businessId,
      name: name.trim(),
      description: description?.trim() || null,
    })

  if (error) {
    console.error('Subcategory request error:', error)
    return NextResponse.json({ error: 'Gagal mengajukan kategori' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
