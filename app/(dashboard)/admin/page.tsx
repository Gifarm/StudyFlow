import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, FileText, TrendingUp, Users } from "lucide-react"

const TZ = "Asia/Jakarta"
const DAY_MS = 24 * 60 * 60 * 1000

function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

function lastNDays(count: number) {
  const now = Date.now()
  const days: { key: string; label: string }[] = []

  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now - i * DAY_MS)
    days.push({
      key: dayKey(date),
      label: new Intl.DateTimeFormat("id-ID", {
        timeZone: TZ,
        day: "numeric",
        month: "short",
      }).format(date),
    })
  }

  return days
}

function bucketByDay(dates: Date[], days: { key: string }[]): number[] {
  const counts = new Map<string, number>()
  for (const date of dates) {
    const key = dayKey(date)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return days.map((day) => counts.get(day.key) ?? 0)
}

function formatDate(date: Date | null): string {
  if (!date) return "Belum ada aktivitas"
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    dateStyle: "medium",
  }).format(date)
}

export default async function AdminPage() {
  const session = await auth()

  if (session?.user?.role !== "ADMIN") {
    notFound()
  }

  const now = new Date()
  const last7 = new Date(now.getTime() - 7 * DAY_MS)
  const last30 = new Date(now.getTime() - 30 * DAY_MS)
  const last14 = new Date(now.getTime() - 14 * DAY_MS)

  const [
    userCount,
    newUsers7,
    newUsers30,
    taskCount,
    completedCount,
    inProgressCount,
    todoCount,
    overdueCount,
    noteCount,
    recentUsers,
    recentUserDates,
    completedTaskDates,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: last7 } } }),
    prisma.user.count({ where: { createdAt: { gte: last30 } } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: "COMPLETED" } }),
    prisma.task.count({ where: { status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { status: "TODO" } }),
    prisma.task.count({
      where: { deadline: { lt: now }, status: { not: "COMPLETED" } },
    }),
    prisma.note.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { tasks: true, notes: true } },
        tasks: {
          select: { updatedAt: true },
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
        notes: {
          select: { updatedAt: true },
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: last14 } },
      select: { createdAt: true },
    }),
    prisma.task.findMany({
      where: { status: "COMPLETED", updatedAt: { gte: last14 } },
      select: { updatedAt: true },
    }),
  ])

  const days = lastNDays(14)
  const newUserSeries = bucketByDay(recentUserDates.map((item) => item.createdAt), days)
  const completedSeries = bucketByDay(completedTaskDates.map((item) => item.updatedAt), days)
  const maxSeries = Math.max(1, ...newUserSeries, ...completedSeries)

  const completionRate =
    taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0

  const stats = [
    {
      label: "Total Pengguna",
      value: userCount,
      detail: `+${newUsers7} dalam 7 hari · +${newUsers30} dalam 30 hari`,
      icon: Users,
      color: "text-[#2563EB]",
      background: "bg-[#EAF3FF]",
    },
    {
      label: "Total Tugas",
      value: taskCount,
      detail: `${todoCount} belum · ${inProgressCount} dikerjakan`,
      icon: CheckSquare,
      color: "text-[#7C5CE6]",
      background: "bg-[#F2EDFF]",
    },
    {
      label: "Total Catatan",
      value: noteCount,
      detail: "Seluruh catatan pengguna",
      icon: FileText,
      color: "text-[#A78BFA]",
      background: "bg-[#F2EDFF]",
    },
    {
      label: "Tingkat Penyelesaian",
      value: `${completionRate}%`,
      detail: `${completedCount} selesai · ${overdueCount} terlambat`,
      icon: TrendingUp,
      color: "text-[#2F855A]",
      background: "bg-[#E7FAF2]",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#25324B]">Admin</h1>
        <p className="text-[#5A6B82] text-sm">
          Ringkasan penggunaan StudyFlow. Halaman ini hanya-baca dan tidak dapat mengubah data
          pengguna.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-[#E5EAF3] bg-white shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#5A6B82] sm:text-sm">{stat.label}</span>
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9 ${stat.background} ${stat.color}`}
                  >
                    <Icon className="size-4 sm:size-5" />
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold text-[#25324B] sm:mt-3 sm:text-3xl">
                  {stat.value}
                </div>
                <p className="mt-1 text-[11px] text-[#5A6B82] sm:text-xs">{stat.detail}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B]">Aktivitas 14 Hari Terakhir</CardTitle>
          <CardDescription className="text-[#5A6B82]">
            Pengguna baru dan tugas yang diselesaikan per hari (zona waktu Asia/Jakarta).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-[#5A6B82] mb-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2563EB]" /> Pengguna baru
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2F855A]" /> Tugas selesai
            </span>
          </div>
          <p className="mb-2 text-xs text-[#5A6B82] sm:hidden">
            Geser ke samping untuk melihat semua hari.
          </p>
          <div className="overflow-x-auto pb-1">
            <div className="flex h-40 min-w-[560px] items-end gap-2">
              {days.map((day, index) => (
                <div key={day.key} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                  <div className="flex items-end gap-0.5 h-full">
                    <div
                      className="w-2.5 rounded-t bg-[#2563EB]"
                      style={{ height: `${Math.max(4, (newUserSeries[index] / maxSeries) * 100)}%` }}
                      title={`${newUserSeries[index]} pengguna baru`}
                    />
                    <div
                      className="w-2.5 rounded-t bg-[#2F855A]"
                      style={{ height: `${Math.max(4, (completedSeries[index] / maxSeries) * 100)}%` }}
                      title={`${completedSeries[index]} tugas selesai`}
                    />
                  </div>
                  <span className="text-[10px] text-[#5A6B82] whitespace-nowrap">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B]">Pengguna Terbaru</CardTitle>
          <CardDescription className="text-[#5A6B82]">
            20 akun terakhir. Data pribadi tidak ditampilkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Daftar kartu untuk layar kecil */}
          <ul className="divide-y divide-[#E5EAF3] md:hidden">
            {recentUsers.map((user) => {
              const lastActive =
                user.tasks[0]?.updatedAt ?? user.notes[0]?.updatedAt ?? null

              return (
                <li key={user.id} className="space-y-2.5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-sm font-bold text-[#2563EB]">
                        {user.name[0]?.toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#25324B]">{user.name}</p>
                        {user.role === "ADMIN" && (
                          <span className="mt-0.5 inline-block rounded-full bg-[#EAF3FF] px-2 py-0.5 text-[10px] font-semibold text-[#2563EB]">
                            ADMIN
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] text-[#5A6B82]">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6B82]">
                    <span className="rounded-md bg-[#F8FAFF] px-2 py-1">
                      {user._count.tasks} tugas
                    </span>
                    <span className="rounded-md bg-[#F8FAFF] px-2 py-1">
                      {user._count.notes} catatan
                    </span>
                    <span className="ml-auto max-w-full truncate">
                      Aktif: {formatDate(lastActive)}
                    </span>
                  </div>
                </li>
              )
            })}
            {recentUsers.length === 0 && (
              <li className="p-8 text-center text-sm text-[#5A6B82]">
                Belum ada pengguna.
              </li>
            )}
          </ul>

          {/* Tabel untuk layar lebar */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFF] text-left text-[#5A6B82]">
                <tr>
                  <th className="px-5 py-3 font-medium">Nama</th>
                  <th className="px-5 py-3 font-medium">Tugas</th>
                  <th className="px-5 py-3 font-medium">Catatan</th>
                  <th className="px-5 py-3 font-medium">Bergabung</th>
                  <th className="px-5 py-3 font-medium">Terakhir Aktif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF3]">
                {recentUsers.map((user) => {
                  const lastActive =
                    user.tasks[0]?.updatedAt ?? user.notes[0]?.updatedAt ?? null

                  return (
                    <tr key={user.id} className="text-[#25324B]">
                      <td className="px-5 py-3">
                        <span className="font-medium">{user.name}</span>
                        {user.role === "ADMIN" && (
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#2563EB] font-semibold">
                            ADMIN
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">{user._count.tasks}</td>
                      <td className="px-5 py-3">{user._count.notes}</td>
                      <td className="px-5 py-3 text-[#5A6B82]">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-3 text-[#5A6B82]">{formatDate(lastActive)}</td>
                    </tr>
                  )
                })}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[#5A6B82]">
                      Belum ada pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
