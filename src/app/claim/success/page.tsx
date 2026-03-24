import Link from 'next/link'

export default function ClaimSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Klaim Terkirim!</h1>
        <p className="text-slate-500 text-sm mb-6">
          Admin kami akan meninjau klaim Anda dalam 1-2 hari kerja.
          Anda akan mendapat notifikasi via email setelah disetujui.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Ke Dashboard
        </Link>
      </div>
    </div>
  )
}
