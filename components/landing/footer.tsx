import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-text-main">
            StudyFlow
          </Link>
          <p className="text-text-secondary text-sm">
            Platform terbaik untuk produktivitas belajar siswa dan mahasiswa.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-text-main mb-4">Produk</h4>
          <ul className="space-y-2">
            <li><Link href="#fitur" className="text-text-secondary hover:text-primary">Fitur</Link></li>
            <li><Link href="#cara-kerja" className="text-text-secondary hover:text-primary">Cara Kerja</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-text-main mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/privacy" className="text-text-secondary hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-text-secondary hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto max-w-6xl px-4 mt-12 pt-8 border-t text-center text-text-secondary text-sm">
        &copy; {new Date().getFullYear()} StudyFlow. All rights reserved.
      </div>
    </footer>
  );
}
