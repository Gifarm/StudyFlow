# StudyFlow --- Project Guide

> **Tujuan dokumen:** Menjadi sumber acuan utama untuk AI coding
> assistant (termasuk Claude Code) saat mengembangkan StudyFlow. Baca
> dokumen ini sebelum membuat atau mengubah kode. Jika ada instruksi
> baru dari pemilik proyek, prioritaskan instruksi terbaru tersebut.

## 1. Ringkasan Proyek

**StudyFlow** adalah aplikasi web produktivitas belajar untuk pelajar
dan mahasiswa. Aplikasi membantu pengguna mengatur tugas, jadwal
belajar, catatan, dan memantau progres akademik dalam satu tempat.

### Tujuan utama

- Membuat pengelolaan kegiatan belajar lebih teratur.
- Menyediakan pengalaman yang sederhana, cepat, dan nyaman.
- Menjadi proyek portfolio yang rapi dan layak dipublikasikan.
- Mendukung pengguna Indonesia dan, jika memungkinkan, pengguna
  global.

### Prinsip produk

1.  **UX-first:** alur penggunaan harus jelas dan minim langkah.
2.  **Simple, not cluttered:** jangan menambahkan fitur atau elemen
    visual yang tidak diperlukan.
3.  **Bright interface:** gunakan tampilan terang; jangan menjadikan
    dark mode sebagai tampilan utama.
4.  **Responsive:** nyaman digunakan di desktop, tablet, dan ponsel.
5.  **Functional over decorative:** setiap tombol, menu, dan kontrol
    harus benar-benar berfungsi.
6.  **Build incrementally:** kerjakan fitur secara bertahap, jangan
    membangun seluruh aplikasi sekaligus.

## 2. Target Pengguna dan Peran

Untuk MVP, cukup gunakan satu jenis akun terdaftar.

- **Guest:** dapat melihat landing page, mendaftar, dan login. Tidak
  dapat mengakses data pribadi.
- **User:** dapat mengelola tugas, kalender, catatan, progres, dan
  pengaturan miliknya sendiri.

Tidak perlu membuat role Admin untuk MVP kecuali diminta secara
eksplisit.

## 3. Menu dan Ruang Lingkup MVP

### Halaman publik

- **Landing Page:** penjelasan singkat StudyFlow, manfaat, preview
  fitur, tombol Register/Login, dan footer.
- **Authentication:** Register, Login, Forgot Password (boleh ditunda
  jika belum ada layanan email), dan Logout.

### Area pengguna

1.  **Dashboard**
    - Sapaan pengguna.
    - Ringkasan tugas hari ini.
    - Deadline terdekat.
    - Quick Add Task.
    - Ringkasan progres mingguan.
2.  **My Tasks**
    - Tambah, lihat, ubah, dan hapus tugas (CRUD).
    - Data tugas: judul, deskripsi opsional, mata pelajaran/kategori
      opsional, deadline, prioritas, dan status.
    - Prioritas: Low, Medium, High.
    - Status: Todo, In Progress, Completed.
    - Pencarian, filter, dan pengurutan.
3.  **Calendar**
    - Tampilan bulanan dan/atau mingguan.
    - Menampilkan deadline dan jadwal belajar.
    - Pengguna dapat membuka detail agenda.
4.  **My Notes**
    - CRUD catatan.
    - Data catatan: judul, isi, mata pelajaran/kategori opsional, dan
      tag opsional.
    - Pencarian catatan.
    - Tampilkan indikator penyimpanan jika autosave diterapkan.
5.  **My Progress**
    - Jumlah tugas selesai, belum selesai, dan terlambat.
    - Ringkasan progres mingguan.
    - Semua angka dan grafik harus berasal dari data nyata, bukan
      angka dummy di production.
6.  **Settings**
    - Profil pengguna.
    - Bahasa Indonesia/English (dapat dibuat bertahap).
    - Preferensi tema; Light adalah default.
    - Zona waktu.
    - Ubah password dan hapus akun jika alur keamanan sudah tersedia.

### Di luar MVP --- jangan dikerjakan dulu

- AI study assistant.
- Kolaborasi/grup belajar.
- Komunitas atau social feed.
- Notifikasi kompleks.
- Gamifikasi kompleks.
- Fitur berbayar atau monetisasi.

Jangan menambahkan fitur di luar ruang lingkup tanpa persetujuan pemilik
proyek.

## 4. Brand dan Design Direction

### Identitas visual

- Nama produk: **StudyFlow**
- Kesan: bright, fresh, friendly, clean, modern, calm, dan produktif.
- Gunakan banyak ruang kosong (whitespace), tipografi yang mudah
  dibaca, sudut komponen yang konsisten, dan hierarki visual yang
  jelas.
- Hindari tampilan gelap, neon berlebihan, gradient berlebihan,
  bayangan berat, dan terlalu banyak warna dalam satu layar.

### Color palette resmi

Gunakan nilai HEX berikut secara konsisten. Jangan mengganti warna brand
tanpa persetujuan.

---

Token HEX Kegunaan

---

Primary `#4F8EF7` Tombol utama, link,
elemen aktif

Primary Hover `#3677E8` Hover/pressed tombol
utama

Soft Blue `#EAF3FF` Background menu aktif
dan highlight

Accent Lavender `#A78BFA` Aksen sekunder, badge,
visual pendukung

Soft Lavender `#F2EDFF` Background aksen
lavender

Mint Green `#6DD6B0` Status selesai dan
progres positif

Soft Mint `#E7FAF2` Background status
selesai

Warm Yellow `#FFD166` Deadline/perhatian
ringan

Soft Yellow `#FFF6D9` Background informasi
upcoming

Background `#F8FAFF` Background utama
aplikasi

Surface `#FFFFFF` Card, sidebar, modal,
form

Main Text `#25324B` Teks utama

Secondary Text `#718096` Teks pendukung

Border `#E5EAF3` Border dan divider

Success `#22C55E` Feedback berhasil

Warning `#F59E0B` Peringatan

Error `#EF4444` Error dan aksi
berbahaya

---

### Aturan penggunaan warna

- Primary Blue adalah warna identitas utama.
- Background halaman menggunakan `#F8FAFF`; card dan panel menggunakan
  putih.
- Gunakan lavender, mint, dan yellow sebagai aksen seperlunya, bukan
  sebagai warna utama semua komponen.
- Pastikan kontras teks dan background tetap mudah dibaca.
- Jangan menggunakan warna status hanya sebagai dekorasi; maknanya
  harus konsisten.
- Jangan membuat dark mode sebagai default. Jika dark mode dibuat,
  pertahankan Light sebagai default.

### Referensi visual

Gunakan referensi berikut untuk inspirasi, bukan untuk menyalin
mentah: - Student dashboard:
https://dribbble.com/search/student-dashboard - Productivity dashboard:
https://dribbble.com/search/productivity-dashboard - Dashboard UI:
https://www.behance.net/search/projects/dashboard%20ui - Palette
reference: https://coolors.co/4f8ef7-eaf3ff-a78bfa-6dd6b0-ffd166-f8faff

## 5. Teknologi yang Direncanakan

Gunakan stack ini sebagai pilihan awal. Periksa kondisi repository
sebelum memasang dependency atau mengganti konfigurasi.

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui bila cocok dengan kebutuhan
- **Icons:** Lucide React
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Database GUI:** DBeaver
- **Authentication:** Auth.js atau solusi autentikasi yang kompatibel
  dengan versi Next.js yang digunakan
- **Version control:** Git + GitHub
- **Deployment:** Vercel
- **Database hosting:** Neon atau provider PostgreSQL terjangkau
  lainnya
- **Domain:** target `.id` yang terjangkau; domain final ditentukan
  pemilik proyek

Jangan meng-upgrade versi major, mengganti framework, atau mengganti ORM
tanpa alasan teknis yang jelas dan persetujuan pemilik proyek.

## 6. Prinsip Arsitektur dan Keamanan

- Pisahkan UI, business logic, dan akses database secara wajar.
- Gunakan TypeScript dengan tipe yang jelas; hindari `any` jika tidak
  diperlukan.
- Validasi input di sisi server. Validasi client-side hanya untuk
  membantu UX, bukan sebagai satu-satunya perlindungan.
- Lindungi seluruh halaman dan aksi privat dengan autentikasi.
- **Setiap query data privat wajib dibatasi berdasarkan user yang
  sedang login.**
- Jangan pernah mempercayai `userId` dari request client sebagai bukti
  kepemilikan data.
- Pengguna hanya boleh membaca, mengubah, atau menghapus data miliknya
  sendiri.
- Simpan secret dan connection string di environment variables; jangan
  commit `.env`.
- Sediakan `.env.example` tanpa secret asli.
- Tangani loading, empty, success, dan error state.
- Gunakan konfirmasi untuk aksi destruktif seperti menghapus data.
- Jangan menampilkan stack trace, secret, atau detail internal server
  kepada pengguna.

## 7. Model Data Awal

Model berikut adalah rancangan awal, bukan alasan untuk membuat skema
berlebihan. Sesuaikan dengan kebutuhan implementasi dan diskusikan
perubahan besar terlebih dahulu.

- **User:** identitas akun dan informasi profil.
- **Task:** tugas milik User; menyimpan judul, deskripsi opsional,
  deadline, priority, status, dan timestamp.
- **Subject/Category:** kategori atau mata pelajaran milik User
  (opsional untuk versi pertama).
- **Note:** catatan milik User; menyimpan judul, konten, dan
  timestamp.
- **Tag:** opsional; tambahkan hanya jika pencarian/pengelompokan tag
  benar-benar dibutuhkan.

Gunakan relasi database yang benar dan aturan penghapusan yang aman.
Jangan membuat tabel/model yang belum dibutuhkan MVP.

## 8. Urutan Pengerjaan

Kerjakan satu tahap pada satu waktu. Setelah setiap tahap, periksa
hasilnya sebelum lanjut.

1.  **Inspect repository**
    - Periksa file dan konfigurasi yang sudah ada.
    - Identifikasi versi Node.js, Next.js, package manager, dan
      struktur folder.
    - Jangan menimpa pekerjaan yang sudah ada.
2.  **UI foundation**
    - Tentukan typography, spacing, layout, komponen dasar, dan design
      tokens.
    - Buat landing page dan kerangka dashboard responsif.
    - Pastikan palette resmi diterapkan.
3.  **Project setup**
    - Rapikan konfigurasi Next.js, TypeScript, Tailwind, dan komponen
      UI.
    - Siapkan PostgreSQL dan Prisma.
4.  **Authentication and database**
    - Register/Login/session.
    - Route protection.
    - User, Task, dan Note.
    - Pastikan isolasi data per pengguna.
5.  **Core features**
    - My Tasks terlebih dahulu.
    - Dashboard berdasarkan data nyata.
    - Calendar.
    - My Notes.
    - My Progress.
6.  **Polish and testing**
    - Uji desktop dan mobile.
    - Periksa loading, empty, error, dan success states.
    - Uji validasi form, akses data, dan alur autentikasi.
    - Perbaiki aksesibilitas dan konsistensi desain.
7.  **Deployment**
    - Siapkan database production.
    - Atur environment variables di hosting.
    - Deploy ke Vercel.
    - Hubungkan domain setelah deployment stabil.
    - Uji kembali fitur utama di production.

## 9. Aturan Kerja untuk AI Coding Assistant

Instruksi ini wajib diikuti setiap kali mengerjakan proyek:

1.  Baca `PROJECT_GUIDE.md` sebelum mulai mengubah kode.
2.  Pahami struktur repository dan kode yang sudah ada terlebih dahulu.
3.  Jangan berasumsi bahwa fitur, dependency, atau file tertentu sudah
    tersedia.
4.  Sebelum mengedit, jelaskan secara singkat rencana perubahan dan file
    yang akan terdampak jika tugasnya cukup besar.
5.  Kerjakan hanya permintaan pada tahap saat ini. Jangan membangun
    fitur lain secara spontan.
6.  Jangan mengganti stack, design direction, nama produk, atau palette
    tanpa persetujuan.
7.  Jangan menghapus file, data, konfigurasi, atau dependency yang belum
    dipahami.
8.  Hindari membuat komponen duplikat. Periksa apakah komponen serupa
    sudah tersedia.
9.  Gunakan komponen reusable jika memang membantu konsistensi, tetapi
    jangan membuat abstraksi berlebihan.
10. Jangan menggunakan mock data seolah-olah data production. Mock data
    hanya untuk development/demo dan harus jelas pemisahannya.
11. Jangan meninggalkan tombol atau menu yang terlihat aktif tetapi
    tidak memiliki fungsi. Jika belum diimplementasikan, tampilkan
    sebagai disabled atau beri penjelasan yang jelas.
12. Jangan mengarang hasil test. Jalankan pemeriksaan yang relevan dan
    laporkan hasil sebenarnya.
13. Setelah perubahan, jalankan lint/typecheck/test/build yang tersedia
    dan relevan. Jika gagal, jelaskan penyebabnya.
14. Jangan memperbaiki masalah di luar scope kecuali masalah tersebut
    menghalangi pekerjaan saat ini; laporkan jika ditemukan.
15. Jangan pernah menaruh credential, API key, password, atau data
    pribadi ke dalam source code maupun commit.
16. Jika instruksi pemilik proyek ambigu atau berpotensi mengubah
    arsitektur/desain secara besar, tanyakan satu pertanyaan klarifikasi
    sebelum mengambil keputusan.

### Format laporan setelah mengerjakan tugas

Berikan ringkasan singkat: - **Selesai:** perubahan yang benar-benar
dilakukan. - **File:** file yang dibuat/diubah. - **Verifikasi:**
perintah test/lint/typecheck/build yang dijalankan dan hasilnya. -
**Catatan:** hal yang belum selesai atau keputusan yang membutuhkan
persetujuan.

## 10. Definition of Done untuk MVP

MVP dianggap siap dipublikasikan ketika: - Pengguna dapat register dan
login. - Pengguna hanya dapat mengakses data miliknya. - Pengguna dapat
membuat, mengubah, melihat, dan menghapus tugas. - Dashboard menampilkan
ringkasan tugas yang benar. - Kalender menampilkan deadline tugas. -
Pengguna dapat menyimpan dan mengelola catatan. - Progres dihitung dari
data nyata. - Tampilan nyaman di desktop dan mobile. - Form memiliki
validasi dan feedback yang jelas. - Tidak ada tombol utama yang sekadar
pajangan. - Build production berhasil dan konfigurasi deployment aman.

---

**Catatan untuk AI assistant:** Dokumen ini adalah pedoman proyek, bukan
instruksi untuk langsung mengimplementasikan seluruh aplikasi. Tunggu
permintaan pemilik proyek, kerjakan secara bertahap, dan utamakan
menjaga kode yang sudah ada.
