import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-20 space-y-6">
      <h1 className="text-4xl font-bold text-text-main">Privacy Policy</h1>
      <p className="text-text-secondary">
        Terakhir diperbarui: 18 Oktober 2026
      </p>
      <div className="prose prose-blue text-text-secondary">
        <p>
          Kami di StudyFlow sangat menghargai privasi Anda. Halaman ini
          menjelaskan bagaimana kami mengumpulkan dan melindungi data Anda.
        </p>
        <h2 className="text-xl font-bold text-text-main mt-6">
          Data yang Kami Kumpulkan
        </h2>
        <p>
          Kami hanya mengumpulkan informasi yang Anda berikan secara sukarela,
          seperti nama dan alamat email, saat Anda mendaftar.
        </p>
      </div>
      <Link href="/" className="text-primary hover:underline">
        &larr; Kembali ke Beranda
      </Link>
    </main>
  );
}
