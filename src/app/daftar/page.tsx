import { getUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import RegisterForm from './RegisterForm'

export const metadata = {
  title: 'Daftarkan Bisnis Anda — Etalaso',
  description: 'Daftarkan bisnis Anda di Etalaso secara gratis. Dapatkan halaman bisnis online, template profesional, dan tombol WhatsApp.',
}

export default async function DaftarPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login?next=/daftar')

  return <RegisterForm />
}
