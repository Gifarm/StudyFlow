import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "StudyFlow | Atur Tugas & Progres Belajar dalam Satu Tempat",
  description:
    "StudyFlow membantu siswa dan mahasiswa mengatur tugas, jadwal, catatan, dan progres belajar dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          plusJakartaSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
