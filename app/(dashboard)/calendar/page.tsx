import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

export default async function CalendarPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      deadline: { not: null },
    },
    orderBy: { deadline: "asc" },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#25324B]">Kalender & Agenda</h1>
        <p className="text-[#718096] text-sm">Daftar deadline tugas dan jadwal belajar Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-[#E5EAF3] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#25324B] flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-[#4F8EF7]" />
                <span>Agenda Deadline Mendatang</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[#E5EAF3]">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-[#718096]">
                  Tidak ada tugas dengan deadline yang dijadwalkan.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="py-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[#25324B]">{task.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          task.priority === "HIGH" ? "bg-red-50 text-red-600" :
                          task.priority === "MEDIUM" ? "bg-[#FFF6D9] text-[#B7791F]" :
                          "bg-[#EAF3FF] text-[#4F8EF7]"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-[#718096]">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-[#4F8EF7] bg-[#EAF3FF] px-3 py-1.5 rounded-md font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{task.deadline ? new Date(task.deadline).toLocaleDateString("id-ID", { dateStyle: "medium" }) : "-"}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-[#E5EAF3] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#25324B]">Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[#718096]">
              <p>
                Setiap tugas yang Anda tambahkan dengan tanggal deadline akan otomatis muncul di halaman kalender dan agenda ini.
              </p>
              <p>
                Pastikan untuk memeriksa deadline secara berkala agar tidak ada tugas yang terlewat!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
