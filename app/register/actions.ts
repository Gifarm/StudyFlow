"use server"

import { headers } from "next/headers"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { getClientIp, rateLimit } from "@/lib/rate-limit"
import { validatePassword, validateUsername } from "@/lib/validation"

const REGISTER_WINDOW_MS = 60 * 60 * 1000
const REGISTER_MAX_PER_IP = 5

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  )
}

export async function registerUser(formData: { name?: string; password?: string }) {
  const name = typeof formData.name === "string" ? formData.name.trim() : ""
  const password = typeof formData.password === "string" ? formData.password : ""

  if (!name || !password) {
    return { error: "Nama dan password wajib diisi." }
  }

  const nameError = validateUsername(name)
  if (nameError) {
    return { error: nameError }
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    return { error: passwordError }
  }

  const requestHeaders = await headers()
  const ip = getClientIp(requestHeaders)
  const limit = rateLimit(`register:${ip}`, REGISTER_MAX_PER_IP, REGISTER_WINDOW_MS)

  if (!limit.success) {
    return { error: "Terlalu banyak pendaftaran dari perangkat ini. Coba lagi nanti." }
  }

  try {
    // Cek duplikat tanpa membedakan huruf besar/kecil.
    const existingUser = await prisma.user.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    })

    if (existingUser) {
      return { error: "Nama pengguna sudah digunakan. Silakan gunakan nama lain." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const uniqueId = crypto.randomUUID()

    await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        uniqueId,
      },
    })

    return { success: true }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Nama pengguna sudah digunakan. Silakan gunakan nama lain." }
    }
    console.error("Registration error:", error)
    return { error: "Terjadi kesalahan pada server saat mendaftarkan akun." }
  }
}
