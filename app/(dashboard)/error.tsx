"use client"

import { useEffect } from "react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Detail error tetap di console, tidak ditampilkan ke pengguna.
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-[#E5EAF3] bg-white p-6 text-center shadow-sm">
        <h2 className="text-lg font-bold text-[#25324B]">Terjadi kendala saat memuat halaman</h2>
        <p className="mt-2 text-sm text-[#5A6B82]">
          Data kamu tidak hilang. Silakan coba lagi; jika masih gagal, muat ulang halaman.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-md bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8]"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  )
}
