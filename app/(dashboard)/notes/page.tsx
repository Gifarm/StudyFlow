import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createNote, removeNote } from "../actions"
import { FileText, Plus, Trash2 } from "lucide-react"

export default async function NotesPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#25324B]">Catatan Belajar</h1>
        <p className="text-[#718096] text-sm">Simpan ringkasan materi, rumus, atau catatan penting di sini.</p>
      </div>

      {/* Add Note Form */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
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
              <textarea
                id="content"
                name="content"
                required
                rows={4}
                placeholder="Tulis ringkasan atau catatan di sini..."
                className="w-full p-3 rounded-md border border-[#E5EAF3] text-sm text-[#25324B] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
              />
            </div>
            <Button type="submit" className="bg-[#4F8EF7] hover:bg-[#3677E8] text-white">
              <Plus className="w-4 h-4 mr-2" /> Simpan Catatan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#718096] bg-white rounded-xl border border-[#E5EAF3]">
            Belum ada catatan. Buat catatan pertamamu sekarang!
          </div>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="border-[#E5EAF3] bg-white shadow-sm flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-bold text-[#25324B] flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#A78BFA]" />
                    <span>{note.title}</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-[#718096] whitespace-pre-wrap line-clamp-4">
                  {note.content}
                </p>
              </CardContent>
              <CardFooter className="border-t border-[#E5EAF3] pt-4 flex items-center justify-between text-xs text-[#718096]">
                <span>{new Date(note.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}</span>
                <form action={removeNote.bind(null, note.id)}>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-2">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
