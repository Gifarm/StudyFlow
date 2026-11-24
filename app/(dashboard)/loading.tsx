export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-md bg-[#E5EAF3]" />
        <div className="h-4 w-72 max-w-full rounded-md bg-[#EEF2F8]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl border border-[#E5EAF3] bg-white shadow-sm"
          />
        ))}
      </div>
      <div className="h-64 rounded-xl border border-[#E5EAF3] bg-white shadow-sm" />
      <span className="sr-only">Memuat halaman…</span>
    </div>
  )
}
