import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createTask, toggleTaskStatus } from "../actions"
import {
  AlertCircle,
  BellRing,
  CalendarDays,
  CheckSquare,
  Clock,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { jakartaDayRange } from "@/lib/reminders"

const priorityStyles: Record<string, string> = {
  LOW: "bg-[#EAF3FF] text-[#2563EB]",
  MEDIUM: "bg-[#FFF6D9] text-[#8A5A0A]",
  HIGH: "bg-red-50 text-red-600",
}

const priorityLabels: Record<string, string> = {
  LOW: "Rendah",
  MEDIUM: "Sedang",
  HIGH: "Tinggi",
}

const statusLabels: Record<string, string> = {
  TODO: "Belum Dikerjakan",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED: "Selesai",
}

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

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  )
  const threeDaysLater = new Date(startOfToday.getTime() + 3 * 86400000)

  const weekStart = new Date(startOfToday)
  weekStart.setDate(startOfToday.getDate() - ((startOfToday.getDay() + 6) % 7))

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const todayTasks = tasks.filter(
    (task) =>
      task.deadline &&
      new Date(task.deadline) >= startOfToday &&
      new Date(task.deadline) < startOfTomorrow,
  )

  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "COMPLETED" &&
      task.deadline &&
      new Date(task.deadline) < startOfToday,
  )

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.status !== "COMPLETED" &&
        task.deadline &&
        new Date(task.deadline) >= startOfToday,
    )
    .sort(
      (a, b) =>
        new Date(a.deadline as Date).getTime() -
        new Date(b.deadline as Date).getTime(),
    )
    .slice(0, 5)

  const weeklyCompleted = tasks.filter(
    (task) => task.status === "COMPLETED" && new Date(task.updatedAt) >= weekStart,
  ).length
  const weeklyCreated = tasks.filter(
    (task) => new Date(task.createdAt) >= weekStart,
  ).length

  const { start: tomorrowStart, end: tomorrowEnd } = jakartaDayRange(1)
  const tomorrowTasks = tasks.filter(
    (task) =>
      task.status !== "COMPLETED" &&
      task.deadline &&
      new Date(task.deadline) >= tomorrowStart &&
      new Date(task.deadline) < tomorrowEnd,
  )

  function deadlineHint(deadline: Date) {
    const diff = Math.round(
      (new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()).getTime() -
        startOfToday.getTime()) /
        86400000,
    )
    if (diff === 0) return "Hari ini"
    if (diff === 1) return "Besok"
    if (diff > 1) return `${diff} hari lagi`
    return "Terlambat"
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] p-5 text-white shadow-sm sm:p-6 md:p-8">
        <h1 className="mb-2 text-xl font-bold sm:text-2xl md:text-3xl">
          Halo, {session.user?.name || "Pengguna"}! 👋
        </h1>
        <p className="text-[#EAF3FF] max-w-xl text-sm md:text-base">
          Semangat belajarnya! Kelola tugas dan catatanmu dengan mudah hari ini agar target belajarmu tercapai.
        </p>
      </div>

      {tomorrowTasks.length > 0 && (
        <div
          id="tenggat-besok"
          className="scroll-mt-24 rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <div className="flex items-start gap-3">
            <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div className="min-w-0">
              <p className="font-semibold text-amber-900">
                Besok ada {tomorrowTasks.length} tenggat
              </p>
              <ul className="mt-1 space-y-1 text-sm text-amber-800">
                {tomorrowTasks.slice(0, 3).map((task) => (
                  <li key={task.id} className="truncate">
                    • {task.title}
                  </li>
                ))}
                {tomorrowTasks.length > 3 && (
                  <li>• +{tomorrowTasks.length - 3} tugas lainnya</li>
                )}
              </ul>
              <Link
                href="/tasks"
                className="mt-2 inline-block text-sm font-medium text-amber-900 underline"
              >
                Lihat semua tugas
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#5A6B82]">Total Tugas</CardTitle>
            <CheckSquare className="w-4 h-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#25324B]">{totalTasks}</div>
            <p className="text-xs text-[#5A6B82] mt-1">Semua tugas tercatat</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#5A6B82]">Tugas Selesai</CardTitle>
            <div className="w-4 h-4 rounded-full bg-[#E7FAF2] text-[#276749] flex items-center justify-center font-bold text-xs">✓</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#25324B]">{completedTasks}</div>
            <p className="text-xs text-[#276749] font-medium mt-1">
              {completionRate}% selesai
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#5A6B82]">Terlambat</CardTitle>
            <AlertCircle className="w-4 h-4 text-[#EF4444]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#25324B]">{overdueTasks.length}</div>
            <p className="text-xs text-[#5A6B82] mt-1">Melewati tenggat</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5EAF3] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#5A6B82]">Catatan Belajar</CardTitle>
            <FileText className="w-4 h-4 text-[#A78BFA]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#25324B]">{notesCount}</div>
            <p className="text-xs text-[#5A6B82] mt-1">Catatan tersimpan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today & Upcoming */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-[#E5EAF3] bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#25324B] flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#2563EB]" />
                Tugas Hari Ini
              </CardTitle>
              <Link
                href="/tasks"
                className="shrink-0 text-xs font-medium text-[#2563EB] hover:underline sm:text-sm"
              >
                Lihat Semua →
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-[#E5EAF3]">
              {todayTasks.length === 0 ? (
                <div className="py-6 text-center text-sm text-[#5A6B82]">
                  <p>Tidak ada tugas dengan tenggat hari ini. 🎉</p>
                  <Link
                    href="/tasks"
                    className="mt-2 inline-block font-medium text-[#2563EB] hover:underline"
                  >
                    Tambah tugas
                  </Link>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span
                        className={`font-medium truncate ${
                          task.status === "COMPLETED"
                            ? "line-through text-[#5A6B82]"
                            : "text-[#25324B]"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[task.priority]}`}
                      >
                        {priorityLabels[task.priority]}
                      </span>
                      <span className="text-xs text-[#5A6B82]">
                        {statusLabels[task.status]}
                      </span>
                    </div>
                    <form action={toggleTaskStatus.bind(null, task.id)}>
                      <Button
                        size="sm"
                        variant={task.status === "COMPLETED" ? "outline" : "default"}
                        className={
                          task.status === "COMPLETED"
                            ? "border-[#E5EAF3] text-[#5A6B82]"
                            : "bg-[#2F855A] hover:bg-[#276749] text-white"
                        }
                      >
                        {task.status === "COMPLETED" ? "Belum Selesai" : "Selesai"}
                      </Button>
                    </form>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E5EAF3] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#25324B] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FFD166]" />
                Tenggat Terdekat
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[#E5EAF3]">
              {upcomingTasks.length === 0 ? (
                <div className="py-6 text-center text-sm text-[#5A6B82]">
                  <p>Belum ada tenggat mendatang.</p>
                  <Link
                    href="/tasks"
                    className="mt-2 inline-block font-medium text-[#2563EB] hover:underline"
                  >
                    Tambah tugas
                  </Link>
                </div>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="font-medium text-[#25324B] truncate">
                        {task.title}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[task.priority]}`}
                      >
                        {priorityLabels[task.priority]}
                      </span>
                    </div>
                    <div className="text-right text-xs shrink-0">
                      <div className="font-medium text-[#25324B]">
                        {new Date(task.deadline as Date).toLocaleDateString("id-ID", {
                          dateStyle: "medium",
                        })}
                      </div>
                      <div className="text-[#5A6B82]">
                        {deadlineHint(new Date(task.deadline as Date))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Add & Weekly Progress */}
        <div className="space-y-8">
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
                      Tenggat (Opsional)
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
                    <Select name="priority" defaultValue="MEDIUM">
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Rendah</SelectItem>
                        <SelectItem value="MEDIUM">Sedang</SelectItem>
                        <SelectItem value="HIGH">Tinggi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Tugas
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>

          <Card className="border-[#E5EAF3] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#25324B] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#276749]" />
                Progres Minggu Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5A6B82]">Diselesaikan</span>
                <span className="font-semibold text-[#276749]">{weeklyCompleted} tugas</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5A6B82]">Ditambahkan</span>
                <span className="font-semibold text-[#2563EB]">{weeklyCreated} tugas</span>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-medium text-[#25324B]">
                  <span>Penyelesaian keseluruhan</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-[#E5EAF3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2F855A] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
              <Link
                href="/progress"
                className="inline-block text-sm font-medium text-[#2563EB] hover:underline"
              >
                Lihat detail progres →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
