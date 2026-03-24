'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function UpgradeNudge() {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5">
      <h3 className="font-bold text-indigo-800 mb-1">Mau terima pesanan dari rumah?</h3>
      <p className="text-sm text-indigo-600 mb-3">
        Upgrade ke paket Business untuk aktifkan fitur Pre-Order dengan pembayaran transfer.
      </p>
      <Link
        href="/dashboard/upgrade"
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
      >
        Upgrade Sekarang <ArrowRight size={14} />
      </Link>
    </div>
  )
}
