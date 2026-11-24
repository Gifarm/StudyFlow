"use client"

import { useState } from "react"
import { LogOut, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"

export function MobileNav({
  logoutAction,
}: {
  logoutAction: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[#25324B]"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-white flex flex-col">
        <SheetHeader className="p-6 border-b border-[#E5EAF3] text-left">
          <SheetTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#4F8EF7] flex items-center justify-center text-white font-bold text-sm">
              SF
            </div>
            <span className="text-xl font-bold text-[#25324B]">StudyFlow</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigasi utama StudyFlow
          </SheetDescription>
        </SheetHeader>

        <SidebarNav onNavigate={() => setOpen(false)} />

        <div className="p-4 border-t border-[#E5EAF3]">
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
