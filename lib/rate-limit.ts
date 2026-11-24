/**
 * Rate limiter in-memory untuk satu instance server.
 *
 * Catatan: di lingkungan serverless (Vercel), setiap instance punya memory
 * sendiri sehingga batasnya tidak berlaku global. Ini tetap jauh lebih baik
 * daripada tanpa throttling, dan bisa diganti Upstash Redis nanti tanpa
 * mengubah pemanggil.
 */

type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  success: boolean
  remaining: number
  retryAfterMs: number
}

const globalKey = "__studyflowRateLimitStore" as const
const globalStore = globalThis as unknown as {
  [globalKey]?: Map<string, RateLimitEntry>
}

const store = globalStore[globalKey] ?? new Map<string, RateLimitEntry>()
globalStore[globalKey] = store

const MAX_ENTRIES = 10000

function cleanup(now: number) {
  if (store.size < MAX_ENTRIES) return
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key)
  }
  // Masih penuh setelah cleanup? Buang entri paling lama agar memory aman.
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value
    if (oldest) store.delete(oldest)
  }
}

/** Hitung satu percobaan untuk key tertentu. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  cleanup(now)

  const entry = store.get(key)
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, retryAfterMs: 0 }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, retryAfterMs: entry.resetAt - now }
  }

  entry.count += 1
  return { success: true, remaining: limit - entry.count, retryAfterMs: 0 }
}

/** Hapus hitungan, misalnya setelah login berhasil. */
export function resetRateLimit(key: string) {
  store.delete(key)
}

/** Ambil IP klien dari header proxy (Vercel/Cloudflare) dengan fallback aman. */
export function getClientIp(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return headers.get("x-real-ip")?.trim() || "unknown"
}
