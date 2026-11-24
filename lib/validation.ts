export const USERNAME_MIN = 3
export const USERNAME_MAX = 32
export const PASSWORD_MIN = 8
export const PASSWORD_MAX_BYTES = 72
export const TASK_TITLE_MAX = 200
export const TASK_DESCRIPTION_MAX = 2000
export const NOTE_TITLE_MAX = 200
export const NOTE_CONTENT_MAX = 50000
export const SEARCH_MAX = 100

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/

/** Ambil nilai string dari FormData, atau null bila bukan string (mis. File). */
export function readString(value: FormDataEntryValue | null | undefined): string | null {
  return typeof value === "string" ? value : null
}

/** Ambil dan trim nilai string; null bila kosong atau bukan string. */
export function readTrimmed(value: FormDataEntryValue | null | undefined): string | null {
  const text = readString(value)
  if (text === null) return null
  const trimmed = text.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function byteLength(value: string): number {
  return Buffer.byteLength(value, "utf8")
}

export function validateUsername(name: string): string | null {
  if (name.length < USERNAME_MIN || name.length > USERNAME_MAX) {
    return `Nama pengguna harus ${USERNAME_MIN}–${USERNAME_MAX} karakter.`
  }
  if (!USERNAME_PATTERN.test(name)) {
    return "Nama pengguna hanya boleh berisi huruf, angka, titik, garis bawah, dan tanda hubung."
  }
  return null
}

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN) {
    return `Password minimal ${PASSWORD_MIN} karakter.`
  }
  if (byteLength(password) > PASSWORD_MAX_BYTES) {
    return `Password maksimal ${PASSWORD_MAX_BYTES} byte (sekitar 72 karakter).`
  }
  return null
}

export function validateText(
  value: string,
  min: number,
  max: number,
  label: string,
): string | null {
  if (value.length < min) return `${label} wajib diisi.`
  if (value.length > max) return `${label} maksimal ${max} karakter.`
  return null
}
