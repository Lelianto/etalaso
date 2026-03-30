'use client'

import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
    >
      Keluar
    </button>
  )
}
