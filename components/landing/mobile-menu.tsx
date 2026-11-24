"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/constants"

export function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-16 border-b border-border bg-background px-4 py-4 shadow-lg"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {isLoggedIn ? (
              <Button asChild className="rounded-xl">
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button asChild className="rounded-xl">
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Daftar Gratis
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
