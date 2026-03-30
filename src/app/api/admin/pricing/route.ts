import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

async function requireAdminApi() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('UserProfile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') return null
  return user
}

export async function PUT(request: Request) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plans } = await request.json() as {
    plans: { id: string; price: number; discountPrice: number | null }[]
  }

  if (!Array.isArray(plans)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  for (const plan of plans) {
    if (typeof plan.price !== 'number' || plan.price < 0) {
      return NextResponse.json({ error: `Harga tidak valid untuk paket ${plan.id}` }, { status: 400 })
    }
    if (plan.discountPrice !== null && (typeof plan.discountPrice !== 'number' || plan.discountPrice < 0)) {
      return NextResponse.json({ error: `Harga diskon tidak valid untuk paket ${plan.id}` }, { status: 400 })
    }
    if (plan.discountPrice !== null && plan.discountPrice >= plan.price) {
      return NextResponse.json({ error: `Harga diskon harus lebih kecil dari harga normal untuk paket ${plan.id}` }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('Plan')
      .update({ price: plan.price, discountPrice: plan.discountPrice })
      .eq('id', plan.id)

    if (error) {
      return NextResponse.json({ error: `Gagal update paket ${plan.id}: ${error.message}` }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
