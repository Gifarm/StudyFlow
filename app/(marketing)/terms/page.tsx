import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-20 space-y-6">
      <h1 className="text-4xl font-bold text-text-main">Terms of Service</h1>
      <p className="text-text-secondary">Terakhir diperbarui: 18 Oktober 2026</p>
      <div className="prose prose-blue text-text-secondary">
        <p>Dengan menggunakan StudyFlow, Anda setuju dengan ketentuan layanan berikut.</p>
        <h2 className="text-xl font-bold text-text-main mt-6">Penggunaan Layanan</h2>
        <p>Anda bertanggung jawab penuh atas data dan aktivitas yang dilakukan melalui akun Anda.</p>
      </div>
      <Link href="/" className="text-primary hover:underline">&larr; Kembali ke Beranda</Link>
    </main>
  );
}
