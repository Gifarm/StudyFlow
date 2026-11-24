"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Priority, Status } from "@prisma/client"
import bcrypt from "bcryptjs"

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

export async function createTask(formData: FormData) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  const title = (formData.get("title") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()
  const priority = parsePriority(formData.get("priority"))

  if (!title) {
    throw new Error("Judul tugas wajib diisi.")
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      deadline: parseDeadline(formData.get("deadline")),
      priority,
      status: "TODO",
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/tasks")
  revalidatePath("/calendar")
  revalidatePath("/progress")
}

export async function updateTask(taskId: string, formData: FormData) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  const title = (formData.get("title") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()

  if (!title) {
    throw new Error("Judul tugas wajib diisi.")
  }

  const status = parseStatus(formData.get("status"))

  await prisma.task.updateMany({
    where: { id: taskId, userId: session.user.id },
    data: {
      title,
      description: description || null,
      deadline: parseDeadline(formData.get("deadline")),
      priority: parsePriority(formData.get("priority")),
      ...(status ? { status } : {}),
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/tasks")
  revalidatePath("/calendar")
  revalidatePath("/progress")
}

export async function toggleTaskStatus(taskId: string, currentStatus: Status) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  const newStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED"

  await prisma.task.updateMany({
    where: { id: taskId, userId: session.user.id },
    data: { status: newStatus },
  })

  revalidatePath("/dashboard")
  revalidatePath("/tasks")
  revalidatePath("/calendar")
  revalidatePath("/progress")
}

export async function removeTask(taskId: string) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.task.deleteMany({
    where: { id: taskId, userId: session.user.id },
  })

  revalidatePath("/dashboard")
  revalidatePath("/tasks")
  revalidatePath("/calendar")
  revalidatePath("/progress")
}

export async function createNote(formData: FormData) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!title || !content) {
    throw new Error("Judul dan isi catatan wajib diisi.")
  }

  await prisma.note.create({
    data: {
      title,
      content,
      userId: session.user.id,
    },
  })

  revalidatePath("/notes")
  revalidatePath("/dashboard")
}

export async function updateNote(noteId: string, formData: FormData) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  const title = (formData.get("title") as string)?.trim()
  const content = (formData.get("content") as string)?.trim()

  if (!title || !content) {
    throw new Error("Judul dan isi catatan wajib diisi.")
  }

  await prisma.note.updateMany({
    where: { id: noteId, userId: session.user.id },
    data: { title, content },
  })

  revalidatePath("/notes")
  revalidatePath("/dashboard")
}

export async function removeNote(noteId: string) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.note.deleteMany({
    where: { id: noteId, userId: session.user.id },
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
  if (!session || !session.user?.id) {
    return { error: "Sesi tidak valid. Silakan login kembali." }
  }

  const currentPassword = String(formData.get("currentPassword") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Semua kolom password wajib diisi." }
  }

  if (newPassword.length < 6) {
    return { error: "Password baru minimal 6 karakter." }
  }

  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password baru tidak cocok." }
  }

  if (newPassword === currentPassword) {
    return { error: "Password baru harus berbeda dari password saat ini." }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
    where: { id: session.user.id },
    data: { password: await bcrypt.hash(newPassword, 10) },
  })

  return { success: "Password berhasil diubah." }
}
