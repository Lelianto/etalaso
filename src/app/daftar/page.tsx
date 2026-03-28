import { getUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import RegisterForm from './RegisterForm'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftarkan Bisnis Anda',
  description: 'Daftarkan bisnis Anda di Etalaso secara gratis. Dapatkan halaman bisnis online, template profesional, dan tombol WhatsApp untuk pelanggan.',
  alternates: {
    canonical: '/daftar',
  },
  openGraph: {
    title: 'Daftarkan Bisnis Anda — Etalaso',
    description: 'Gratis! Dapatkan halaman bisnis online, template profesional, dan tombol WhatsApp untuk pelanggan.',
    url: '/daftar',
  },
}

export default async function DaftarPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login?next=/daftar')

  return <RegisterForm />
}
