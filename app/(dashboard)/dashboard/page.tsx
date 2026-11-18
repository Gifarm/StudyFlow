import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createTask, toggleTaskStatus } from "../actions"
import { CheckSquare, Clock, AlertCircle, FileText, Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  const notesCount = await prisma.note.count({
    where: { userId },
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length
  const urgentTasks = tasks.filter(
    (t) => t.status !== "COMPLETED" && t.deadline && new Date(t.deadline) <= new Date(Date.now() + 86400000 * 3)
  ).length

  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#4F8EF7] to-[#3677E8] rounded-2xl p-6 md:p-8 text-white shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Halo, {session.user?.name || "Pengguna"}! 👋
        </h1>
        <p className="text-[#EAF3FF] max-w-xl text-sm md:text-base">
          Semangat belajarnya! Kelola tugas dan catatanmu dengan mudah hari ini agar target belajarmu tercapai.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Total Tugas</CardTitle>
            <CheckSquare className="w-4 h-4 text-[#4F8EF7]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#25324B]">{totalTasks}</div>
            <p className="text-xs text-[#718096] mt-1">Semua tugas tercatat</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Tugas Selesai</CardTitle>
            <div className="w-4 h-4 rounded-full bg-[#E7FAF2] text-[#6DD6B0] flex items-center justify-center font-bold text-xs">✓</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#25324B]">{completedTasks}</div>
            <p className="text-xs text-[#6DD6B0] font-medium mt-1">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% selesai
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Mendekati Deadline</CardTitle>
            <AlertCircle className="w-4 h-4 text-[#FFD166]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#25324B]">{urgentTasks}</div>
            <p className="text-xs text-[#718096] mt-1">Dalam 3 hari ke depan</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#718096]">Catatan Belajar</CardTitle>
            <FileText className="w-4 h-4 text-[#A78BFA]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#25324B]">{notesCount}</div>
            <p className="text-xs text-[#718096] mt-1">Catatan tersimpan</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid: Quick Add & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#25324B]">Tugas Terbaru</h2>
            <Link href="/dashboard/tasks" className="text-sm font-medium text-[#4F8EF7] hover:underline">
              Lihat Semua →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-[#E5EAF3] shadow-sm divide-y divide-[#E5EAF3]">
            {recentTasks.length === 0 ? (
              <div className="p-8 text-center text-[#718096]">
                Belum ada tugas. Tambahkan tugas pertamamu sekarang!
              </div>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFF] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${task.status === "COMPLETED" ? "line-through text-[#718096]" : "text-[#25324B]"}`}>
                        {task.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        task.priority === "HIGH" ? "bg-red-50 text-red-600" :
                        task.priority === "MEDIUM" ? "bg-[#FFF6D9] text-[#B7791F]" :
                        "bg-[#EAF3FF] text-[#4F8EF7]"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.deadline && (
                      <div className="text-xs text-[#718096] flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Deadline: {new Date(task.deadline).toLocaleDateString("id-ID", { dateStyle: "medium" })}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                      <Button
                        size="sm"
                        variant={task.status === "COMPLETED" ? "outline" : "default"}
                        className={task.status === "COMPLETED" ? "border-[#E5EAF3] text-[#718096]" : "bg-[#6DD6B0] hover:bg-[#5bc29e] text-white"}
                      >
                        {task.status === "COMPLETED" ? "Batal Selesai" : "Selesai"}
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Add Task */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#25324B]">Tambah Tugas Cepat</h2>
          <Card className="border-[#E5EAF3] bg-white shadow-sm">
            <form action={createTask}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#25324B]" htmlFor="title">
                    Judul Tugas
                  </label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Contoh: Belajar Matematika"
                    className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#25324B]" htmlFor="deadline">
                    Deadline (Opsional)
                  </label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#25324B]" htmlFor="priority">
                    Prioritas
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue="MEDIUM"
                    className="w-full h-10 px-3 rounded-md border border-[#E5EAF3] text-sm text-[#25324B] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                  >
                    <option value="LOW">Low (Rendah)</option>
                    <option value="MEDIUM">Medium (Sedang)</option>
                    <option value="HIGH">High (Tinggi)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-[#4F8EF7] hover:bg-[#3677E8] text-white">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Tugas
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
