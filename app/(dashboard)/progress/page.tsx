import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  CheckSquare,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react"

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

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const weekStart = new Date(startOfToday)
  weekStart.setDate(startOfToday.getDate() - ((startOfToday.getDay() + 6) % 7))

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS").length
  const todoTasks = tasks.filter((task) => task.status === "TODO").length
  const incompleteTasks = todoTasks + inProgressTasks
  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "COMPLETED" &&
      task.deadline &&
      new Date(task.deadline) < startOfToday,
  ).length

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const inProgressRate =
    totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0
  const todoRate =
    totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0

  const weeklyCompleted = tasks.filter(
    (task) => task.status === "COMPLETED" && new Date(task.updatedAt) >= weekStart,
  ).length
  const weeklyCreated = tasks.filter(
    (task) => new Date(task.createdAt) >= weekStart,
  ).length

  const breakdown = [
    {
      label: "Selesai",
      count: completedTasks,
      rate: completionRate,
      bar: "bg-[#6DD6B0]",
      text: "text-[#6DD6B0]",
    },
    {
      label: "Dikerjakan",
      count: inProgressTasks,
      rate: inProgressRate,
      bar: "bg-[#FFD166]",
      text: "text-[#B7791F]",
    },
    {
      label: "Todo",
      count: todoTasks,
      rate: todoRate,
      bar: "bg-[#4F8EF7]",
      text: "text-[#4F8EF7]",
    },
  ]

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
            <CardTitle className="text-sm font-medium text-[#718096]">Belum Selesai</CardTitle>
            <Clock className="w-4 h-4 text-[#FFD166]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#25324B]">{incompleteTasks}</div>
            <p className="text-xs text-[#718096] mt-1">
              {todoTasks} todo · {inProgressTasks} dikerjakan
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Terlambat</CardTitle>
            <AlertCircle className="w-4 h-4 text-[#EF4444]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#25324B]">{overdueTasks}</div>
            <p className="text-xs text-[#EF4444] font-medium mt-1">Melewati deadline</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Breakdown */}
        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#25324B]">Rincian Status Tugas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {totalTasks === 0 ? (
              <p className="text-sm text-[#718096]">
                Belum ada tugas. Tambahkan tugas pertamamu di halaman Tugas Saya.
              </p>
            ) : (
              breakdown.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-[#25324B]">
                    <span>{item.label}</span>
                    <span className={item.text}>
                      {item.count} tugas ({item.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#E5EAF3] h-3 rounded-full overflow-hidden">
                    <div
                      className={`${item.bar} h-full transition-all duration-500 rounded-full`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#25324B]">Ringkasan Minggu Ini</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E5EAF3] bg-[#F8FAFF] p-4">
                <div className="text-xs font-medium text-[#718096]">Diselesaikan</div>
                <div className="text-2xl font-bold text-[#6DD6B0]">{weeklyCompleted}</div>
                <div className="text-xs text-[#718096]">tugas</div>
              </div>
              <div className="rounded-xl border border-[#E5EAF3] bg-[#F8FAFF] p-4">
                <div className="text-xs font-medium text-[#718096]">Ditambahkan</div>
                <div className="text-2xl font-bold text-[#4F8EF7]">{weeklyCreated}</div>
                <div className="text-xs text-[#718096]">tugas</div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#E5EAF3] p-4 text-sm">
              <span className="flex items-center gap-2 text-[#718096]">
                <FileText className="w-4 h-4 text-[#A78BFA]" />
                Total catatan belajar
              </span>
              <span className="font-semibold text-[#25324B]">{notesCount}</span>
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
    </div>
  )
}
