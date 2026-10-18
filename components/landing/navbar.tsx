import Link from "next/link";
import { navLinks } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-foreground">
          <div className="size-8 rounded-lg bg-primary" />
          StudyFlow
        </Link>
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex gap-2">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
