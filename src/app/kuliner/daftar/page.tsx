import { getUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import KulinerRegisterForm from './KulinerRegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftar Kuliner Rumahan — Etalaso',
  description: 'Daftarkan usaha kuliner rumahan Anda di Etalaso. Terima pesanan via WhatsApp — gratis!',
  alternates: { canonical: '/kuliner/daftar' },
}

export default async function KulinerDaftarPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login?next=/kuliner/daftar')

  return <KulinerRegisterForm />
}
