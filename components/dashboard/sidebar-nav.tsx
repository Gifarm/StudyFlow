"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar as CalendarIcon,
  CheckSquare,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

export const dashboardNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tugas Saya", href: "/tasks", icon: CheckSquare },
  { name: "Kalender", href: "/calendar", icon: CalendarIcon },
  { name: "Catatan", href: "/notes", icon: FileText },
  { name: "Progres", href: "/progress", icon: TrendingUp },
  { name: "Pengaturan", href: "/settings", icon: Settings },
]

export const adminNavItem = {
  name: "Admin",
  href: "/admin",
  icon: ShieldCheck,
}

export function SidebarNav({
  onNavigate,
  isAdmin = false,
}: {
  onNavigate?: () => void
  isAdmin?: boolean
}) {
  const pathname = usePathname()
  const items = isAdmin ? [...dashboardNavItems, adminNavItem] : dashboardNavItems

  return (
    <nav className="flex-1 p-4 space-y-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`flex touch-manipulation items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#EAF3FF] text-[#2563EB]"
                : "text-[#5A6B82] hover:bg-[#EAF3FF] hover:text-[#2563EB]"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
