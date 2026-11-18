"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { Priority, Status } from "@prisma/client"

export async function createTask(formData: FormData) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const deadlineStr = formData.get("deadline") as string
  const priority = (formData.get("priority") as Priority) || "MEDIUM"

  if (!title) {
    throw new Error("Judul tugas wajib diisi.")
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
      priority,
      status: "TODO",
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/tasks")
  revalidatePath("/dashboard/calendar")
  revalidatePath("/dashboard/progress")
}

export async function toggleTaskStatus(taskId: string, currentStatus: Status) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  const newStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED"

  await prisma.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { status: newStatus },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/tasks")
  revalidatePath("/dashboard/calendar")
  revalidatePath("/dashboard/progress")
}

export async function removeTask(taskId: string) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.task.delete({
    where: { id: taskId, userId: session.user.id },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/tasks")
  revalidatePath("/dashboard/calendar")
  revalidatePath("/dashboard/progress")
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

  revalidatePath("/dashboard/notes")
  revalidatePath("/dashboard")
}

export async function removeNote(noteId: string) {
  const session = await auth()
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.note.delete({
    where: { id: noteId, userId: session.user.id },
  })

  revalidatePath("/dashboard/notes")
  revalidatePath("/dashboard")
}
