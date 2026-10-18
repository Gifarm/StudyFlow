import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1 rounded-full">
            Belajar lebih terarah
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Atur Tugas, Jadwal & Progres Belajar dalam Satu Tempat
          </h1>
          <p className="text-xl text-muted-foreground">
            StudyFlow membantu siswa dan mahasiswa untuk tetap terorganisir dan produktif dalam mencapai target akademik.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="rounded-xl px-8">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-8">
              <Link href="/login">Login</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Gratis untuk pelajar.</p>
        </div>

        {/* Mockup */}
        <div className="relative bg-card p-6 rounded-2xl border border-border shadow-lg">
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-8 bg-secondary rounded-md" />
            <div className="flex-1 h-8 bg-border/30 rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-card border rounded-xl flex items-center px-4 justify-between">
              <span className="font-medium">Tugas Matematika</span>
              <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">Deadline</Badge>
            </div>
            <div className="h-12 bg-card border rounded-xl flex items-center px-4 justify-between">
              <span className="font-medium">Baca Buku Sejarah</span>
              <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">Selesai</Badge>
            </div>
            <div className="h-4 bg-secondary rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-green-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
