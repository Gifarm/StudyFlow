import { Badge } from "@/components/ui/badge";

export function Preview() {
  return (
    <section id="preview" className="container mx-auto max-w-6xl px-4 py-20 space-y-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-text-main mb-12">
        Preview Fitur
      </h2>

      {/* Block 1 */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-text-main">Manajemen Tugas</h3>
          <p className="text-text-secondary text-lg">
            Pantau semua tugas, deadline, dan status penyelesaian dalam satu daftar yang rapi.
          </p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
           <div className="space-y-3">
             {[
               {title: "Tugas Kalkulus", status: "Deadline", color: "text-yellow"},
               {title: "Laporan Praktikum", status: "Selesai", color: "text-mint"},
               {title: "Ujian Pemrograman", status: "Deadline", color: "text-yellow"}
             ].map(item => (
                <div key={item.title} className="flex justify-between items-center p-3 border rounded-xl">
                  <span className="font-medium">{item.title}</span>
                  <Badge variant="outline" className={item.color}>{item.status}</Badge>
                </div>
             ))}
           </div>
        </div>
      </div>

       {/* Block 2 (reversed) */}
      <div className="grid lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
           <div className="grid grid-cols-7 gap-2">
             {Array.from({length: 30}).map((_, i) => (
                <div key={i} className="size-8 rounded-lg bg-soft-blue flex items-center justify-center text-xs text-primary">
                    {i + 1}
                </div>
             ))}
           </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-text-main">Jadwal Belajar</h3>
          <p className="text-text-secondary text-lg">
            Visualisasikan jadwal harian dan mingguan agar waktu belajar lebih terstruktur.
          </p>
        </div>
      </div>
    </section>
  );
}
