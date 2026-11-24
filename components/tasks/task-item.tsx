"use client"

import { useState } from "react"
import { Clock, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmButton } from "@/components/ui/confirm-button"
import { Input } from "@/components/ui/input"

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
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
}

const priorityStyles: Record<TaskItemData["priority"], string> = {
  LOW: "bg-[#EAF3FF] text-[#4F8EF7]",
  MEDIUM: "bg-[#FFF6D9] text-[#B7791F]",
  HIGH: "bg-red-50 text-red-600",
}

const statusLabels: Record<TaskItemData["status"], string> = {
  TODO: "Todo",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED: "Selesai",
}

const statusStyles: Record<TaskItemData["status"], string> = {
  TODO: "bg-[#EAF3FF] text-[#4F8EF7]",
  IN_PROGRESS: "bg-[#FFF6D9] text-[#B7791F]",
  COMPLETED: "bg-[#E7FAF2] text-[#6DD6B0]",
}

const selectClassName =
  "w-full h-10 px-3 rounded-md border border-[#E5EAF3] text-sm text-[#25324B] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"

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
                  ? "line-through text-[#718096]"
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
            <p className="text-sm text-[#718096] whitespace-pre-wrap">{task.description}</p>
          )}
          {task.deadlineLabel && (
            <div className="text-xs text-[#718096] flex items-center space-x-1 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Deadline: {task.deadlineLabel}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-start shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsEditing((value) => !value)}
            className="border-[#E5EAF3] text-[#25324B]"
          >
            <Pencil className="w-4 h-4" />
            {isEditing ? "Tutup" : "Edit"}
          </Button>

          <form action={toggleAction}>
            <Button
              size="sm"
              variant={task.status === "COMPLETED" ? "outline" : "default"}
              className={
                task.status === "COMPLETED"
                  ? "border-[#E5EAF3] text-[#718096]"
                  : "bg-[#6DD6B0] hover:bg-[#5bc29e] text-white"
              }
            >
              {task.status === "COMPLETED" ? "Belum Selesai" : "Tandai Selesai"}
            </Button>
          </form>

          <form action={deleteAction}>
            <ConfirmButton
              message={`Hapus tugas "${task.title}"? Tindakan ini tidak dapat dibatalkan.`}
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
          className="mt-4 pt-4 border-t border-[#E5EAF3] grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="space-y-2 md:col-span-2">
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
              Deadline
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
            <select
              id={`edit-priority-${task.id}`}
              name="priority"
              defaultValue={task.priority}
              className={selectClassName}
            >
              <option value="LOW">Low (Rendah)</option>
              <option value="MEDIUM">Medium (Sedang)</option>
              <option value="HIGH">High (Tinggi)</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-3">
            <label
              className="text-sm font-medium text-[#25324B]"
              htmlFor={`edit-description-${task.id}`}
            >
              Deskripsi (Opsional)
            </label>
            <textarea
              id={`edit-description-${task.id}`}
              name="description"
              rows={2}
              defaultValue={task.description ?? ""}
              placeholder="Detail atau catatan tambahan..."
              className="w-full p-3 rounded-md border border-[#E5EAF3] text-sm text-[#25324B] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#25324B]"
              htmlFor={`edit-status-${task.id}`}
            >
              Status
            </label>
            <select
              id={`edit-status-${task.id}`}
              name="status"
              defaultValue={task.status}
              className={selectClassName}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">Dikerjakan</option>
              <option value="COMPLETED">Selesai</option>
            </select>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#4F8EF7] hover:bg-[#3677E8] text-white"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
