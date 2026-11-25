"use client"

import { useState } from "react"
import { Clock, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmButton } from "@/components/ui/confirm-button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export type TaskItemData = {
  id: string
  title: string
  description: string | null
  deadlineValue: string
  deadlineLabel: string | null
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
}

export type TaskItemActions = {
  updateAction: (formData: FormData) => Promise<void>
  toggleAction: () => Promise<void>
  deleteAction: () => Promise<void>
}

const priorityLabels: Record<TaskItemData["priority"], string> = {
  LOW: "Rendah",
  MEDIUM: "Sedang",
  HIGH: "Tinggi",
}

const priorityStyles: Record<TaskItemData["priority"], string> = {
  LOW: "bg-[#EAF3FF] text-[#2563EB]",
  MEDIUM: "bg-[#FFF6D9] text-[#8A5A0A]",
  HIGH: "bg-red-50 text-red-600",
}

const statusLabels: Record<TaskItemData["status"], string> = {
  TODO: "Belum Dikerjakan",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED: "Selesai",
}

const statusStyles: Record<TaskItemData["status"], string> = {
  TODO: "bg-[#EAF3FF] text-[#2563EB]",
  IN_PROGRESS: "bg-[#FFF6D9] text-[#8A5A0A]",
  COMPLETED: "bg-[#E7FAF2] text-[#276749]",
}

export function TaskItem({
  task,
  updateAction,
  toggleAction,
  deleteAction,
}: {
  task: TaskItemData
} & TaskItemActions) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="p-4 md:p-6 hover:bg-[#F8FAFF] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-semibold text-base ${
                task.status === "COMPLETED"
                  ? "line-through text-[#5A6B82]"
                  : "text-[#25324B]"
              }`}
            >
              {task.title}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${priorityStyles[task.priority]}`}
            >
              {priorityLabels[task.priority]}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyles[task.status]}`}
            >
              {statusLabels[task.status]}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-[#5A6B82] whitespace-pre-wrap">{task.description}</p>
          )}
          {task.deadlineLabel && (
            <div className="text-xs text-[#5A6B82] flex items-center space-x-1 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Tenggat: {task.deadlineLabel}</span>
            </div>
          )}
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsEditing((value) => !value)}
            className="flex-1 border-[#E5EAF3] text-[#25324B] sm:flex-none"
          >
            <Pencil className="w-4 h-4" />
            {isEditing ? "Tutup" : "Edit"}
          </Button>

          <form action={toggleAction} className="flex-1 sm:flex-none">
            <Button
              size="sm"
              variant={task.status === "COMPLETED" ? "outline" : "default"}
              className={
                task.status === "COMPLETED"
                  ? "w-full border-[#E5EAF3] text-[#5A6B82]"
                  : "w-full bg-[#2F855A] text-white hover:bg-[#276749]"
              }
            >
              {task.status === "COMPLETED" ? "Belum Selesai" : "Tandai Selesai"}
            </Button>
          </form>

          <form action={deleteAction}>
            <ConfirmButton
              message={`Hapus tugas "${task.title}"? Tindakan ini tidak dapat dibatalkan.`}
              aria-label={`Hapus tugas "${task.title}"`}
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </ConfirmButton>
          </form>
        </div>
      </div>

      {isEditing && (
        <form
          action={updateAction}
          onSubmit={() => setIsEditing(false)}
          className="mt-4 grid grid-cols-1 items-end gap-4 border-t border-[#E5EAF3] pt-4 sm:grid-cols-2 md:grid-cols-4"
        >
          <div className="space-y-2 sm:col-span-2 md:col-span-2">
            <label
              className="text-sm font-medium text-[#25324B]"
              htmlFor={`edit-title-${task.id}`}
            >
              Judul Tugas
            </label>
            <Input
              id={`edit-title-${task.id}`}
              name="title"
              required
              defaultValue={task.title}
              className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#25324B]"
              htmlFor={`edit-deadline-${task.id}`}
            >
              Tenggat
            </label>
            <Input
              id={`edit-deadline-${task.id}`}
              name="deadline"
              type="date"
              defaultValue={task.deadlineValue}
              className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#25324B]"
              htmlFor={`edit-priority-${task.id}`}
            >
              Prioritas
            </label>
            <Select name="priority" defaultValue={task.priority}>
              <SelectTrigger id={`edit-priority-${task.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Rendah</SelectItem>
                <SelectItem value="MEDIUM">Sedang</SelectItem>
                <SelectItem value="HIGH">Tinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2 md:col-span-3">
            <label
              className="text-sm font-medium text-[#25324B]"
              htmlFor={`edit-description-${task.id}`}
            >
              Deskripsi (Opsional)
            </label>
            <Textarea
              id={`edit-description-${task.id}`}
              name="description"
              rows={2}
              defaultValue={task.description ?? ""}
              placeholder="Detail atau catatan tambahan..."
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#25324B]"
              htmlFor={`edit-status-${task.id}`}
            >
              Status
            </label>
            <Select name="status" defaultValue={task.status}>
              <SelectTrigger id={`edit-status-${task.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">Belum Dikerjakan</SelectItem>
                <SelectItem value="IN_PROGRESS">Dikerjakan</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end md:col-span-4">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
