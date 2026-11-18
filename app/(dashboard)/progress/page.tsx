import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, TrendingUp, FileText, Award } from "lucide-react"

export default async function ProgressPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const tasks = await prisma.task.findMany({
    where: { userId },
  })

  const notesCount = await prisma.note.count({
    where: { userId },
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length
  const todoTasks = tasks.filter((t) => t.status === "TODO").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#25324B]">Progres Akademik</h1>
        <p className="text-[#718096] text-sm">Pantau statistik penyelesaian tugas dan aktivitas belajar Anda.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Tingkat Penyelesaian</CardTitle>
            <TrendingUp className="w-4 h-4 text-[#6DD6B0]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#25324B]">{completionRate}%</div>
            <p className="text-xs text-[#718096] mt-1">Dari total {totalTasks} tugas</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Tugas Selesai</CardTitle>
            <CheckSquare className="w-4 h-4 text-[#4F8EF7]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#25324B]">{completedTasks}</div>
            <p className="text-xs text-[#6DD6B0] font-medium mt-1">Tugas berhasil diselesaikan</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Tugas Belum Selesai</CardTitle>
            <Award className="w-4 h-4 text-[#FFD166]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#25324B]">{todoTasks}</div>
            <p className="text-xs text-[#718096] mt-1">Menunggu dikerjakan</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Total Catatan</CardTitle>
            <FileText className="w-4 h-4 text-[#A78BFA]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#25324B]">{notesCount}</div>
            <p className="text-xs text-[#718096] mt-1">Materi tersimpan</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress Bar */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B]">Statistik Progres Belajar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-[#25324B]">
              <span>Penyelesaian Tugas</span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full bg-[#E5EAF3] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#6DD6B0] h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-[#F8FAFF] rounded-xl border border-[#E5EAF3] space-y-2">
            <h3 className="font-semibold text-[#25324B] text-sm">Tips Produktivitas</h3>
            <p className="text-xs text-[#718096] leading-relaxed">
              Konsistensi adalah kunci keberhasilan belajar. Selesaikan tugas-tugas dengan prioritas tinggi terlebih dahulu dan buat catatan ringkas untuk memudahkan review materi.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
