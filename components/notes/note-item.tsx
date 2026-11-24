"use client"

import { useState } from "react"
import { FileText, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmButton } from "@/components/ui/confirm-button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export type NoteItemData = {
  id: string
  title: string
  content: string
  createdLabel: string
}

export function NoteItem({
  note,
  updateAction,
  deleteAction,
}: {
  note: NoteItemData
  updateAction: (formData: FormData) => Promise<void>
  deleteAction: () => Promise<void>
}) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card className="border-[#E5EAF3] bg-white shadow-sm flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-bold text-[#25324B] flex items-center space-x-2 min-w-0">
            <FileText className="w-4 h-4 text-[#A78BFA] shrink-0" />
            <span className="truncate">{note.title}</span>
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsEditing((value) => !value)}
            className="border-[#E5EAF3] text-[#25324B] h-8 px-2 shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            {isEditing ? "Tutup" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {isEditing ? (
          <form
            action={updateAction}
            onSubmit={() => setIsEditing(false)}
            className="space-y-3"
          >
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-[#25324B]"
                htmlFor={`note-title-${note.id}`}
              >
                Judul Catatan
              </label>
              <Input
                id={`note-title-${note.id}`}
                name="title"
                required
                defaultValue={note.title}
                className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-[#25324B]"
                htmlFor={`note-content-${note.id}`}
              >
                Isi Catatan
              </label>
              <textarea
                id={`note-content-${note.id}`}
                name="content"
                required
                rows={5}
                defaultValue={note.content}
                className="w-full p-3 rounded-md border border-[#E5EAF3] text-sm text-[#25324B] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#4F8EF7] hover:bg-[#3677E8] text-white"
              >
                Simpan
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-[#718096] whitespace-pre-wrap line-clamp-4">
            {note.content}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t border-[#E5EAF3] pt-4 flex items-center justify-between text-xs text-[#718096]">
        <span>{note.createdLabel}</span>
        <form action={deleteAction}>
          <ConfirmButton
            message={`Hapus catatan "${note.title}"? Tindakan ini tidak dapat dibatalkan.`}
            size="sm"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </ConfirmButton>
        </form>
      </CardFooter>
    </Card>
  )
}
