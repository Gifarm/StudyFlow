"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(formData: { name?: string; password?: string }) {
  const name = formData.name?.trim()
  const password = formData.password

  if (!name || !password) {
    return { error: "Nama dan password wajib diisi." }
  }

  if (password.length < 6) {
    return { error: "Password minimal harus 6 karakter." }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { name }
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
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Terjadi kesalahan pada server saat mendaftarkan akun." }
  }
}
