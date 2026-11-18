import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createTask, toggleTaskStatus, removeTask } from "../actions"
import { Clock, Trash2, Plus } from "lucide-react"
import { Status } from "@prisma/client"

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; q?: string }>
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const resolvedParams = await searchParams
  const statusFilter = resolvedParams.status
  const priorityFilter = resolvedParams.priority
  const searchQuery = resolvedParams.q

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(statusFilter && statusFilter !== "ALL" ? { status: statusFilter as Status } : {}),
      ...(priorityFilter && priorityFilter !== "ALL" ? { priority: priorityFilter as any } : {}),
      ...(searchQuery ? { title: { contains: searchQuery, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
  })

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
            <div className="space-y-2 md:col-span-1">
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
            <div className="space-y-2 md:col-span-1">
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
                className="w-full h-10 px-3 rounded-md border border-[#E5EAF3] text-sm text-[#25324B] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
              >
                <option value="LOW">Low (Rendah)</option>
                <option value="MEDIUM">Medium (Sedang)</option>
                <option value="HIGH">High (Tinggi)</option>
              </select>
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5EAF3] shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-[#718096]">Status:</span>
          <div className="flex space-x-1">
            <a
              href="/dashboard/tasks"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                !statusFilter || statusFilter === "ALL" ? "bg-[#4F8EF7] text-white" : "bg-[#F8FAFF] text-[#718096] hover:bg-[#EAF3FF]"
              }`}
            >
              Semua
            </a>
            <a
              href="/dashboard/tasks?status=TODO"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === "TODO" ? "bg-[#4F8EF7] text-white" : "bg-[#F8FAFF] text-[#718096] hover:bg-[#EAF3FF]"
              }`}
            >
              Todo
            </a>
            <a
              href="/dashboard/tasks?status=COMPLETED"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === "COMPLETED" ? "bg-[#4F8EF7] text-white" : "bg-[#F8FAFF] text-[#718096] hover:bg-[#EAF3FF]"
              }`}
            >
              Selesai
            </a>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl border border-[#E5EAF3] shadow-sm divide-y divide-[#E5EAF3]">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-[#718096]">
            Tidak ada tugas yang ditemukan.
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFF] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className={`font-semibold text-base ${task.status === "COMPLETED" ? "line-through text-[#718096]" : "text-[#25324B]"}`}>
                    {task.title}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    task.priority === "HIGH" ? "bg-red-50 text-red-600" :
                    task.priority === "MEDIUM" ? "bg-[#FFF6D9] text-[#B7791F]" :
                    "bg-[#EAF3FF] text-[#4F8EF7]"
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    task.status === "COMPLETED" ? "bg-[#E7FAF2] text-[#6DD6B0]" : "bg-[#EAF3FF] text-[#4F8EF7]"
                  }`}>
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-[#718096]">{task.description}</p>
                )}
                {task.deadline && (
                  <div className="text-xs text-[#718096] flex items-center space-x-1 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deadline: {new Date(task.deadline).toLocaleDateString("id-ID", { dateStyle: "full" })}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <form action={toggleTaskStatus.bind(null, task.id, task.status)}>
                  <Button
                    size="sm"
                    variant={task.status === "COMPLETED" ? "outline" : "default"}
                    className={task.status === "COMPLETED" ? "border-[#E5EAF3] text-[#718096]" : "bg-[#6DD6B0] hover:bg-[#5bc29e] text-white"}
                  >
                    {task.status === "COMPLETED" ? "Belum Selesai" : "Tandai Selesai"}
                  </Button>
                </form>

                <form action={removeTask.bind(null, task.id)}>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
