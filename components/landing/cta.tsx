import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <div className="bg-primary p-12 md:p-20 rounded-3xl text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Siap Meningkatkan Produktivitas Anda?
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Mulai atur tugas, jadwal, dan progres belajar Anda bersama StudyFlow hari ini.
        </p>
        <Button asChild size="lg" variant="secondary" className="rounded-xl px-8">
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    </section>
  );
}
