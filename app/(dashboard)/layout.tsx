import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  CheckSquare,
  Calendar as CalendarIcon,
  FileText,
  TrendingUp,
  LogOut
} from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tugas Saya", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Kalender", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "Catatan", href: "/dashboard/notes", icon: FileText },
    { name: "Progres", href: "/dashboard/progress", icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5EAF3] hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-[#E5EAF3] flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#4F8EF7] flex items-center justify-center text-white font-bold">
            SF
          </div>
          <span className="text-xl font-bold text-[#25324B]">StudyFlow</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-[#718096] hover:bg-[#EAF3FF] hover:text-[#4F8EF7] transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#E5EAF3]">
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5EAF3] px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-3 md:hidden">
            <span className="text-lg font-bold text-[#25324B]">StudyFlow</span>
          </div>
          <div className="hidden md:block text-sm text-[#718096]">
            Selamat datang kembali, <span className="font-semibold text-[#25324B]">{session.user.name}</span>!
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9 rounded-full bg-[#EAF3FF] text-[#4F8EF7] flex items-center justify-center font-bold">
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
