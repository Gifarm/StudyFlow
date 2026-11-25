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
import { Textarea } from "@/components/ui/textarea"
import { createTask, removeTask, toggleTaskStatus, updateTask } from "../actions"
import { Plus, Search } from "lucide-react"
import { Priority, Prisma, Status } from "@prisma/client"
import Link from "next/link"
import { TaskItem } from "@/components/tasks/task-item"

const statusValues = Object.values(Status)
const priorityValues = Object.values(Priority)

const sortOptions: Record<string, Prisma.TaskOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  deadline: { deadline: { sort: "asc", nulls: "last" } },
  priority: { priority: "desc" },
  title: { title: "asc" },
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    priority?: string
    q?: string
    sort?: string
  }>
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const resolvedParams = await searchParams
  const rawStatus = resolvedParams.status
  const rawPriority = resolvedParams.priority
  const searchQuery = resolvedParams.q?.trim() ?? ""
  const sortKey =
    resolvedParams.sort && resolvedParams.sort in sortOptions
      ? resolvedParams.sort
      : "newest"

  const statusFilter =
    rawStatus && statusValues.includes(rawStatus as Status)
      ? (rawStatus as Status)
      : undefined
  const priorityFilter =
    rawPriority && priorityValues.includes(rawPriority as Priority)
      ? (rawPriority as Priority)
      : undefined

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(priorityFilter ? { priority: priorityFilter } : {}),
    ...(searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: sortOptions[sortKey],
  })

  const hasActiveFilter =
    Boolean(statusFilter || priorityFilter || searchQuery) || sortKey !== "newest"

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#25324B]">Tugas Saya</h1>
          <p className="text-[#5A6B82] text-sm">Kelola daftar tugas dan pantau status pengerjaannya.</p>
        </div>
      </div>

      {/* Add Task Form Card */}
      <Card id="tambah-tugas" className="scroll-mt-24 border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B]">Tambah Tugas Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createTask}
            className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 md:grid-cols-4"
          >
            <div className="space-y-2 sm:col-span-2 md:col-span-2">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="title">
                Judul Tugas
              </label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Judul tugas..."
                className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="deadline">
                Tenggat
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
            <div className="space-y-2 sm:col-span-2 md:col-span-3">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="description">
                Deskripsi (Opsional)
              </label>
              <Textarea
                id="description"
                name="description"
                rows={2}
                placeholder="Detail atau catatan tambahan..."
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <Button
                type="submit"
                className="w-full bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
              >
                <Plus className="w-4 h-4" /> Tambah
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <form
        method="GET"
        action="/tasks"
        className="grid grid-cols-2 items-end gap-3 rounded-xl border border-[#E5EAF3] bg-white p-4 shadow-sm lg:grid-cols-6"
      >
        <div className="col-span-2 space-y-1 lg:col-span-2">
          <label className="text-sm font-medium text-[#5A6B82]" htmlFor="q">
            Cari Tugas
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6B82]" />
            <Input
              id="q"
              name="q"
              defaultValue={searchQuery}
              placeholder="Cari judul atau deskripsi..."
              className="pl-9"
            />
          </div>
        </div>
        <div className="col-span-1 space-y-1">
          <label className="text-sm font-medium text-[#5A6B82]" htmlFor="status">
            Status
          </label>
          <Select name="status" defaultValue={statusFilter ?? "ALL"}>
            <SelectTrigger id="status" className="px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="TODO">Belum Dikerjakan</SelectItem>
              <SelectItem value="IN_PROGRESS">Dikerjakan</SelectItem>
              <SelectItem value="COMPLETED">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1 space-y-1">
          <label className="text-sm font-medium text-[#5A6B82]" htmlFor="priority-filter">
            Prioritas
          </label>
          <Select name="priority" defaultValue={priorityFilter ?? "ALL"}>
            <SelectTrigger id="priority-filter" className="px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="LOW">Rendah</SelectItem>
              <SelectItem value="MEDIUM">Sedang</SelectItem>
              <SelectItem value="HIGH">Tinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1 lg:col-span-1">
          <label className="text-sm font-medium text-[#5A6B82]" htmlFor="sort">
            Urutkan
          </label>
          <Select name="sort" defaultValue={sortKey}>
            <SelectTrigger id="sort" className="px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="deadline">Tenggat terdekat</SelectItem>
              <SelectItem value="priority">Prioritas tertinggi</SelectItem>
              <SelectItem value="title">Judul A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 flex flex-col gap-2 sm:flex-row lg:col-span-1 lg:flex-col">
          <Button
            type="submit"
            className="flex-1 bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
          >
            Terapkan
          </Button>
          {hasActiveFilter && (
            <Button asChild variant="outline" className="flex-1 border-[#E5EAF3] text-[#5A6B82]">
              <Link href="/tasks">Reset</Link>
            </Button>
          )}
        </div>
      </form>

      {/* Task List */}
      <div className="bg-white rounded-xl border border-[#E5EAF3] shadow-sm">
        <div className="px-4 md:px-6 py-3 border-b border-[#E5EAF3] text-sm text-[#5A6B82]">
          {tasks.length} tugas ditemukan
        </div>
        <div className="divide-y divide-[#E5EAF3]">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-[#5A6B82] sm:p-12">
              <p>
                {hasActiveFilter
                  ? "Tidak ada tugas yang cocok dengan filter atau pencarian."
                  : "Belum ada tugas. Yuk, catat tugas pertamamu!"}
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 border-[#E5EAF3] text-[#25324B]"
              >
                <Link href={hasActiveFilter ? "/tasks" : "#tambah-tugas"}>
                  {hasActiveFilter ? "Reset Filter" : "Tambah Tugas Pertama"}
                </Link>
              </Button>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={{
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  deadlineValue: task.deadline
                    ? new Date(task.deadline).toISOString().slice(0, 10)
                    : "",
                  deadlineLabel: task.deadline
                    ? new Date(task.deadline).toLocaleDateString("id-ID", {
                        dateStyle: "full",
                      })
                    : null,
                  priority: task.priority,
                  status: task.status,
                }}
                updateAction={updateTask.bind(null, task.id)}
                toggleAction={toggleTaskStatus.bind(null, task.id)}
                deleteAction={removeTask.bind(null, task.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
