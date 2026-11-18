import Link from "next/link";
import { navLinks } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-foreground">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">SF</div>
          StudyFlow
        </Link>
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex gap-2 items-center">
          {session?.user ? (
            <Button asChild className="rounded-xl bg-[#4F8EF7] hover:bg-[#3677E8] text-white">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-xl bg-[#4F8EF7] hover:bg-[#3677E8] text-white">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
