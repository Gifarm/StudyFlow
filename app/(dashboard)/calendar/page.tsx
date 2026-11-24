import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react"
import Link from "next/link"

const weekdayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function resolveMonth(value?: string) {
  const now = new Date()
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number)
    if (month >= 1 && month <= 12) {
      return { year, monthIndex: month - 1 }
    }
  }
  return { year: now.getFullYear(), monthIndex: now.getMonth() }
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

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

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const resolvedParams = await searchParams
  const { year, monthIndex } = resolveMonth(resolvedParams.month)

  const monthStart = new Date(year, monthIndex, 1)
  const monthEnd = new Date(year, monthIndex + 1, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingBlanks = (monthStart.getDay() + 6) % 7
  const trailingBlanks = (7 - ((leadingBlanks + daysInMonth) % 7)) % 7

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      deadline: { gte: monthStart, lt: monthEnd },
    },
    orderBy: { deadline: "asc" },
  })

  const tasksByDay = new Map<number, typeof tasks>()
  for (const task of tasks) {
    if (!task.deadline) continue
    const deadline = new Date(task.deadline)
    const day = deadline.getDate()
    const existing = tasksByDay.get(day) ?? []
    existing.push(task)
    tasksByDay.set(day, existing)
  }

  const today = new Date()
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === monthIndex

  const prevMonth = new Date(year, monthIndex - 1, 1)
  const nextMonth = new Date(year, monthIndex + 1, 1)

  const monthLabel = monthStart.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })

  const completedThisMonth = tasks.filter((task) => task.status === "COMPLETED").length
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const nextDeadline = tasks.find(
    (task) => task.deadline && new Date(task.deadline) >= startOfToday,
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#25324B]">Kalender & Agenda</h1>
          <p className="text-[#5A6B82] text-sm">Lihat tenggat tugas dalam tampilan bulanan.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon" className="border-[#E5EAF3]">
            <Link href={`/calendar?month=${monthKey(prevMonth)}`} aria-label="Bulan sebelumnya">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </Button>
          <span className="min-w-[160px] text-center text-sm font-semibold text-[#25324B] capitalize">
            {monthLabel}
          </span>
          <Button asChild variant="outline" size="icon" className="border-[#E5EAF3]">
            <Link href={`/calendar?month=${monthKey(nextMonth)}`} aria-label="Bulan berikutnya">
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
          {!isCurrentMonth && (
            <Button asChild variant="ghost" className="text-[#2563EB]">
              <Link href="/calendar">Bulan ini</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-[#E5EAF3] bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-7 border-b border-[#E5EAF3] bg-[#F8FAFF]">
                  {weekdayLabels.map((label) => (
                    <div
                      key={label}
                      className="py-2 text-center text-xs font-semibold text-[#5A6B82]"
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
              {Array.from({ length: leadingBlanks }).map((_, index) => (
                <div
                  key={`blank-start-${index}`}
                  className="min-h-[96px] border-b border-r border-[#E5EAF3] bg-[#F8FAFF]"
                />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dayTasks = tasksByDay.get(day) ?? []
                const isToday =
                  isCurrentMonth && today.getDate() === day

                return (
                  <div
                    key={day}
                    className={`min-h-[96px] border-b border-r border-[#E5EAF3] p-1.5 align-top ${
                      isToday ? "bg-[#EAF3FF]/60" : "bg-white"
                    }`}
                  >
                    <div
                      className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday
                          ? "bg-[#2563EB] text-white"
                          : "text-[#5A6B82]"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          title={task.title}
                          className={`truncate rounded px-1.5 py-0.5 text-[11px] font-medium ${
                            task.status === "COMPLETED"
                              ? "bg-[#E7FAF2] text-[#276749] line-through"
                              : priorityStyles[task.priority]
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="px-1.5 text-[11px] text-[#5A6B82]">
                          +{dayTasks.length - 3} lagi
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {Array.from({ length: trailingBlanks }).map((_, index) => (
                <div
                  key={`blank-end-${index}`}
                  className="min-h-[96px] border-b border-r border-[#E5EAF3] bg-[#F8FAFF]"
                />
              ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-[#E5EAF3] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#25324B] flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-[#2563EB]" />
                <span>Ringkasan Bulan Ini</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#5A6B82]">Total tenggat</span>
                <span className="font-semibold text-[#25324B]">{tasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A6B82]">Sudah selesai</span>
                <span className="font-semibold text-[#276749]">{completedThisMonth}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[#5A6B82]">Tenggat terdekat</span>
                <span className="text-right font-medium text-[#25324B]">
                  {nextDeadline?.deadline
                    ? new Date(nextDeadline.deadline).toLocaleDateString("id-ID", {
                        dateStyle: "medium",
                      })
                    : "-"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E5EAF3] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#25324B]">Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[#5A6B82]">
              <p>
                Setiap tugas dengan tenggat akan otomatis tampil pada tanggalnya di kalender.
              </p>
              <p>
                Warna label mengikuti prioritas tugas. Tugas selesai ditampilkan dengan
                warna hijau dan garis coret.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agenda Detail */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B]">
            Detail Agenda — {monthLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-[#E5EAF3]">
          {tasks.length === 0 ? (
            <div className="py-8 text-center text-[#5A6B82]">
              <p>Tidak ada tenggat tugas pada bulan ini.</p>
              <Link
                href="/tasks"
                className="mt-2 inline-block font-medium text-[#2563EB] hover:underline"
              >
                Tambah tugas
              </Link>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-medium ${
                        task.status === "COMPLETED"
                          ? "line-through text-[#5A6B82]"
                          : "text-[#25324B]"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        priorityStyles[task.priority]
                      }`}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#F8FAFF] text-[#5A6B82]">
                      {statusLabels[task.status]}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-[#5A6B82] whitespace-pre-wrap">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-[#2563EB] bg-[#EAF3FF] px-3 py-1.5 rounded-md font-medium shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString("id-ID", {
                          dateStyle: "full",
                        })
                      : "-"}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
