import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createNote, removeNote, updateNote } from "../actions"
import { Search, Plus } from "lucide-react"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { NoteItem } from "@/components/notes/note-item"

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const resolvedParams = await searchParams
  const searchQuery = resolvedParams.q?.trim() ?? ""

  const where: Prisma.NoteWhereInput = {
    userId,
    ...(searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { content: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const notes = await prisma.note.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#25324B]">Catatan Belajar</h1>
        <p className="text-[#5A6B82] text-sm">Simpan ringkasan materi, rumus, atau catatan penting di sini.</p>
      </div>

      {/* Add Note Form */}
      <Card id="tambah-catatan" className="scroll-mt-24 border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B]">Buat Catatan Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createNote} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="title">
                Judul Catatan
              </label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Contoh: Rumus Fisika Gerak Lurus"
                className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="content">
                Isi Catatan
              </label>
              <Textarea
                id="content"
                name="content"
                required
                rows={4}
                placeholder="Tulis ringkasan atau catatan di sini..."
                className="min-h-[120px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2563EB] text-white hover:bg-[#1D4ED8] sm:w-auto"
            >
              <Plus className="mr-2 w-4 h-4" /> Simpan Catatan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search */}
      <form
        method="GET"
        action="/notes"
        className="flex flex-col gap-3 rounded-xl border border-[#E5EAF3] bg-white p-4 shadow-sm sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6B82]" />
          <Input
            name="q"
            defaultValue={searchQuery}
            placeholder="Cari judul atau isi catatan..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1 bg-[#2563EB] text-white hover:bg-[#1D4ED8] sm:flex-none"
          >
            Cari
          </Button>
          {searchQuery && (
            <Button
              asChild
              variant="outline"
              className="flex-1 border-[#E5EAF3] text-[#5A6B82] sm:flex-none"
            >
              <Link href="/notes">Reset</Link>
            </Button>
          )}
        </div>
      </form>

      <p className="text-sm text-[#5A6B82]">{notes.length} catatan ditemukan</p>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full rounded-xl border border-[#E5EAF3] bg-white p-8 text-center text-[#5A6B82] sm:py-12">
            <p>
              {searchQuery
                ? "Tidak ada catatan yang cocok dengan pencarian."
                : "Belum ada catatan. Buat catatan pertamamu sekarang!"}
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 border-[#E5EAF3] text-[#25324B]"
            >
              <Link href={searchQuery ? "/notes" : "#tambah-catatan"}>
                {searchQuery ? "Reset Pencarian" : "Buat Catatan Pertama"}
              </Link>
            </Button>
          </div>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={{
                id: note.id,
                title: note.title,
                content: note.content,
                createdLabel: new Date(note.createdAt).toLocaleDateString("id-ID", {
                  dateStyle: "medium",
                }),
              }}
              updateAction={updateNote.bind(null, note.id)}
              deleteAction={removeNote.bind(null, note.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
