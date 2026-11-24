"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Priority, Status } from "@prisma/client"
import bcrypt from "bcryptjs"
import { rateLimit } from "@/lib/rate-limit"
import {
  NOTE_CONTENT_MAX,
  NOTE_TITLE_MAX,
  PASSWORD_MAX_BYTES,
  TASK_DESCRIPTION_MAX,
  TASK_TITLE_MAX,
  byteLength,
  readString,
  readTrimmed,
  validatePassword,
} from "@/lib/validation"

const priorityValues = Object.values(Priority)
const statusValues = Object.values(Status)

function parsePriority(value: FormDataEntryValue | null): Priority {
  return priorityValues.includes(value as Priority) ? (value as Priority) : "MEDIUM"
}

function parseStatus(value: FormDataEntryValue | null): Status | null {
  return statusValues.includes(value as Status) ? (value as Status) : null
}

function parseDeadline(value: FormDataEntryValue | null): Date | null {
  if (typeof value !== "string" || value.trim() === "") {
    return null
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

async function requireUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }
  return session.user.id
}

function validateTaskInput(title: string, description: string | null) {
  if (title.length > TASK_TITLE_MAX) {
    throw new Error(`Judul tugas maksimal ${TASK_TITLE_MAX} karakter.`)
  }
  if (description && description.length > TASK_DESCRIPTION_MAX) {
    throw new Error(`Deskripsi maksimal ${TASK_DESCRIPTION_MAX} karakter.`)
  }
}

function revalidateAll() {
  revalidatePath("/dashboard")
  revalidatePath("/tasks")
  revalidatePath("/calendar")
  revalidatePath("/progress")
}

export async function createTask(formData: FormData) {
  const userId = await requireUserId()

  const title = readTrimmed(formData.get("title"))
  const description = readTrimmed(formData.get("description"))

  if (!title) {
    throw new Error("Judul tugas wajib diisi.")
  }
  validateTaskInput(title, description)

  await prisma.task.create({
    data: {
      title,
      description,
      deadline: parseDeadline(formData.get("deadline")),
      priority: parsePriority(formData.get("priority")),
      status: "TODO",
      userId,
    },
  })

  revalidateAll()
}

export async function updateTask(taskId: string, formData: FormData) {
  const userId = await requireUserId()

  const title = readTrimmed(formData.get("title"))
  const description = readTrimmed(formData.get("description"))

  if (!title) {
    throw new Error("Judul tugas wajib diisi.")
  }
  validateTaskInput(title, description)

  const status = parseStatus(formData.get("status"))

  await prisma.task.updateMany({
    where: { id: taskId, userId },
    data: {
      title,
      description,
      deadline: parseDeadline(formData.get("deadline")),
      priority: parsePriority(formData.get("priority")),
      ...(status ? { status } : {}),
    },
  })

  revalidateAll()
}

export async function toggleTaskStatus(taskId: string) {
  const userId = await requireUserId()

  // Status diambil dari database, bukan dari client, agar tidak bisa
  // dipaksa lewat parameter arbitrer.
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { status: true },
  })

  if (!task) {
    return
  }

  await prisma.task.updateMany({
    where: { id: taskId, userId },
    data: { status: task.status === "COMPLETED" ? "TODO" : "COMPLETED" },
  })

  revalidateAll()
}

export async function removeTask(taskId: string) {
  const userId = await requireUserId()

  await prisma.task.deleteMany({
    where: { id: taskId, userId },
  })

  revalidateAll()
}

export async function createNote(formData: FormData) {
  const userId = await requireUserId()

  const title = readTrimmed(formData.get("title"))
  const content = readTrimmed(formData.get("content"))

  if (!title || !content) {
    throw new Error("Judul dan isi catatan wajib diisi.")
  }
  if (title.length > NOTE_TITLE_MAX) {
    throw new Error(`Judul catatan maksimal ${NOTE_TITLE_MAX} karakter.`)
  }
  if (content.length > NOTE_CONTENT_MAX) {
    throw new Error(`Isi catatan maksimal ${NOTE_CONTENT_MAX} karakter.`)
  }

  await prisma.note.create({
    data: {
      title,
      content,
      userId,
    },
  })

  revalidatePath("/notes")
  revalidatePath("/dashboard")
}

export async function updateNote(noteId: string, formData: FormData) {
  const userId = await requireUserId()

  const title = readTrimmed(formData.get("title"))
  const content = readTrimmed(formData.get("content"))

  if (!title || !content) {
    throw new Error("Judul dan isi catatan wajib diisi.")
  }
  if (title.length > NOTE_TITLE_MAX) {
    throw new Error(`Judul catatan maksimal ${NOTE_TITLE_MAX} karakter.`)
  }
  if (content.length > NOTE_CONTENT_MAX) {
    throw new Error(`Isi catatan maksimal ${NOTE_CONTENT_MAX} karakter.`)
  }

  await prisma.note.updateMany({
    where: { id: noteId, userId },
    data: { title, content },
  })

  revalidatePath("/notes")
  revalidatePath("/dashboard")
}

export async function removeNote(noteId: string) {
  const userId = await requireUserId()

  await prisma.note.deleteMany({
    where: { id: noteId, userId },
  })

  revalidatePath("/notes")
  revalidatePath("/dashboard")
}

export type PasswordChangeResult = {
  error?: string
  success?: string
}

export async function changePassword(
  formData: FormData,
): Promise<PasswordChangeResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Sesi tidak valid. Silakan login kembali." }
  }

  const userId = session.user.id

  const limit = rateLimit(`change-password:${userId}`, 5, 60 * 60 * 1000)
  if (!limit.success) {
    return { error: "Terlalu banyak percobaan. Coba lagi beberapa saat lagi." }
  }

  const currentPassword = readString(formData.get("currentPassword")) ?? ""
  const newPassword = readString(formData.get("newPassword")) ?? ""
  const confirmPassword = readString(formData.get("confirmPassword")) ?? ""

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Semua kolom password wajib diisi." }
  }

  const passwordError = validatePassword(newPassword)
  if (passwordError) {
    return { error: passwordError }
  }

  if (byteLength(newPassword) > PASSWORD_MAX_BYTES) {
    return { error: `Password maksimal ${PASSWORD_MAX_BYTES} byte.` }
  }

  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password baru tidak cocok." }
  }

  if (newPassword === currentPassword) {
    return { error: "Password baru harus berbeda dari password saat ini." }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  })

  if (!user) {
    return { error: "Akun tidak ditemukan." }
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password)
  if (!passwordMatches) {
    return { error: "Password saat ini salah." }
  }

  await prisma.user.updateMany({
    where: { id: userId },
    data: {
      password: await bcrypt.hash(newPassword, 10),
      // Naikkan versi token agar semua sesi lama (termasuk yang dicuri)
      // langsung tidak berlaku.
      tokenVersion: { increment: 1 },
    },
  })

  return {
    success: "Password berhasil diubah. Silakan login kembali dengan password baru.",
  }
}
