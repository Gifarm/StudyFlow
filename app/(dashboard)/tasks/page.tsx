import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const selectClassName =
  "w-full h-10 px-3 rounded-md border border-[#E5EAF3] text-sm text-[#25324B] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"

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
          <p className="text-[#718096] text-sm">Kelola daftar tugas dan pantau status pengerjaannya.</p>
        </div>
      </div>

      {/* Add Task Form Card */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B]">Tambah Tugas Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTask} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
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
                Deadline
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
                className={selectClassName}
              >
                <option value="LOW">Low (Rendah)</option>
                <option value="MEDIUM">Medium (Sedang)</option>
                <option value="HIGH">High (Tinggi)</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="description">
                Deskripsi (Opsional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                placeholder="Detail atau catatan tambahan..."
                className="w-full p-3 rounded-md border border-[#E5EAF3] text-sm text-[#25324B] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
              />
            </div>
            <div>
              <Button type="submit" className="w-full bg-[#4F8EF7] hover:bg-[#3677E8] text-white">
                <Plus className="w-4 h-4 mr-2" /> Tambah
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <form
        method="GET"
        action="/tasks"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 bg-white p-4 rounded-xl border border-[#E5EAF3] shadow-sm items-end"
      >
        <div className="space-y-1 lg:col-span-2">
          <label className="text-sm font-medium text-[#718096]" htmlFor="q">
            Cari Tugas
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="q"
              name="q"
              defaultValue={searchQuery}
              placeholder="Cari judul atau deskripsi..."
              className="pl-9 border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#718096]" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={statusFilter ?? "ALL"}
            className={selectClassName}
          >
            <option value="ALL">Semua status</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">Dikerjakan</option>
            <option value="COMPLETED">Selesai</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#718096]" htmlFor="priority-filter">
            Prioritas
          </label>
          <select
            id="priority-filter"
            name="priority"
            defaultValue={priorityFilter ?? "ALL"}
            className={selectClassName}
          >
            <option value="ALL">Semua prioritas</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#718096]" htmlFor="sort">
            Urutkan
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sortKey}
            className={selectClassName}
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="deadline">Deadline terdekat</option>
            <option value="priority">Prioritas tertinggi</option>
            <option value="title">Judul A-Z</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-[#4F8EF7] hover:bg-[#3677E8] text-white">
            Terapkan
          </Button>
          {hasActiveFilter && (
            <Button asChild variant="outline" className="border-[#E5EAF3] text-[#718096]">
              <Link href="/tasks">Reset</Link>
            </Button>
          )}
        </div>
      </form>

      {/* Task List */}
      <div className="bg-white rounded-xl border border-[#E5EAF3] shadow-sm">
        <div className="px-4 md:px-6 py-3 border-b border-[#E5EAF3] text-sm text-[#718096]">
          {tasks.length} tugas ditemukan
        </div>
        <div className="divide-y divide-[#E5EAF3]">
          {tasks.length === 0 ? (
            <div className="p-12 text-center text-[#718096]">
              Tidak ada tugas yang ditemukan.
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
