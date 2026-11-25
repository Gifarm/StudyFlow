import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordForm } from "@/components/settings/password-form"
import { PushNotifications } from "@/components/settings/push-notifications"
import { Bell, Clock, Globe, Lock, Palette, User } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, createdAt: true },
  })

  if (!user) return null

  const pushDeviceCount = await prisma.pushSubscription.count({
    where: { userId },
  })

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#25324B]">Pengaturan</h1>
        <p className="text-[#5A6B82] text-sm">Kelola profil, keamanan akun, dan preferensi tampilan.</p>
      </div>

      {/* Profile */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B] flex items-center gap-2">
            <User className="w-5 h-5 text-[#2563EB]" />
            Profil Pengguna
          </CardTitle>
          <CardDescription className="text-[#5A6B82]">
            Username digunakan untuk login ke StudyFlow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-xl font-bold text-[#2563EB]">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold text-[#25324B]">{user.name}</div>
              <div className="text-sm text-[#5A6B82]">
                Bergabung sejak{" "}
                {new Date(user.createdAt).toLocaleDateString("id-ID", {
                  dateStyle: "long",
                })}
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-[#E5EAF3] bg-[#F8FAFF] p-3 text-sm text-[#5A6B82]">
            Untuk saat ini username tidak dapat diubah. Hubungi pengelola aplikasi jika
            perlu mengganti username.
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#2563EB]" />
            Keamanan Akun
          </CardTitle>
          <CardDescription className="text-[#5A6B82]">
            Ubah password akun Anda. Password baru minimal 8 karakter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#2563EB]" />
            Notifikasi Tenggat
          </CardTitle>
          <CardDescription className="text-[#5A6B82]">
            Dapatkan pengingat di HP saat ada tugas dengan tenggat besok.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PushNotifications deviceCount={pushDeviceCount} />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#A78BFA]" />
            Preferensi
          </CardTitle>
          <CardDescription className="text-[#5A6B82]">
            Preferensi yang tersedia saat ini.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-[#E5EAF3]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 first:pt-0">
            <div className="flex items-center gap-2 text-sm font-medium text-[#25324B]">
              <Globe className="w-4 h-4 text-[#5A6B82]" />
              Bahasa
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-[#EAF3FF] px-3 py-1 font-medium text-[#2563EB]">
                Bahasa Indonesia
              </span>
              <span className="rounded-full bg-[#F8FAFF] px-3 py-1 text-[#5A6B82]">
                English (segera hadir)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#25324B]">
              <Palette className="w-4 h-4 text-[#5A6B82]" />
              Tema
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-[#EAF3FF] px-3 py-1 font-medium text-[#2563EB]">
                Terang (default)
              </span>
              <span className="rounded-full bg-[#F8FAFF] px-3 py-1 text-[#5A6B82]">
                Gelap (segera hadir)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 last:pb-0">
            <div className="flex items-center gap-2 text-sm font-medium text-[#25324B]">
              <Clock className="w-4 h-4 text-[#5A6B82]" />
              Zona Waktu
            </div>
            <span className="text-sm text-[#5A6B82]">
              {timeZone} (mengikuti perangkat)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="border-[#E5EAF3] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#25324B]">Akun</CardTitle>
          <CardDescription className="text-[#5A6B82]">
            Tindakan permanen pada akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            disabled
            className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-lg border border-red-200 px-4 text-sm font-medium text-red-400 opacity-60 sm:w-auto"
            title="Belum tersedia"
          >
            Hapus Akun
          </button>
          <p className="mt-2 text-xs text-[#5A6B82]">
            Fitur hapus akun belum tersedia. Alur verifikasi keamanan tambahan diperlukan
            sebelum fitur ini diaktifkan.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
