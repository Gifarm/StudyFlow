import Link from "next/link"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Bell, LogOut } from "lucide-react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { prisma } from "@/lib/prisma"
import { jakartaDayRange } from "@/lib/reminders"

async function handleSignOut() {
  "use server"
  await signOut({ redirectTo: "/login" })
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const isAdmin = session.user.role === "ADMIN"

  const { start: tomorrowStart, end: tomorrowEnd } = jakartaDayRange(1)
  const tomorrowCount = await prisma.task.count({
    where: {
      userId: session.user.id,
      deadline: { gte: tomorrowStart, lt: tomorrowEnd },
      status: { not: "COMPLETED" },
    },
  })

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5EAF3] hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-[#E5EAF3] flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold">
            SF
          </div>
          <span className="text-xl font-bold text-[#25324B]">StudyFlow</span>
        </div>

        <SidebarNav isAdmin={isAdmin} />

        <div className="p-4 border-t border-[#E5EAF3]">
          <form action={handleSignOut}>
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
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#E5EAF3] bg-white px-4 sm:px-6">
          <div className="flex items-center space-x-3 md:hidden">
            <MobileNav logoutAction={handleSignOut} isAdmin={isAdmin} />
            <span className="text-lg font-bold text-[#25324B]">StudyFlow</span>
          </div>
          <div className="hidden md:block text-sm text-[#5A6B82]">
            Selamat datang kembali, <span className="font-semibold text-[#25324B]">{session.user.name}</span>!
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard#tenggat-besok"
              aria-label={
                tomorrowCount > 0
                  ? `${tomorrowCount} tugas dengan tenggat besok`
                  : "Tidak ada tenggat besok"
              }
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-[#5A6B82] transition-colors hover:bg-[#EAF3FF] hover:text-[#2563EB] md:h-9 md:w-9"
            >
              <Bell className="w-5 h-5" />
              {tomorrowCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-red-600 px-1 text-center text-[10px] font-bold leading-[18px] text-white">
                  {tomorrowCount > 9 ? "9+" : tomorrowCount}
                </span>
              )}
            </Link>
            <div className="w-9 h-9 rounded-full bg-[#EAF3FF] text-[#2563EB] flex items-center justify-center font-bold">
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
