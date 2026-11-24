"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "./actions"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.")
      setLoading(false)
      return
    }

    try {
      const result = await registerUser({ name, password })
      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/login?registered=success")
      }
    } catch (err) {
      setError("Terjadi kesalahan pada sistem.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] px-4">
      <Card className="w-full max-w-md border-[#E5EAF3] shadow-sm bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-[#25324B]">Daftar ke StudyFlow</CardTitle>
          <CardDescription className="text-[#5A6B82]">
            Mulai kelola tugas dan jadwal belajarmu dengan lebih teratur
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div role="alert" className="p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="name">
                Username / Nama
              </label>
              <Input
                id="name"
                name="name"
                required
                minLength={3}
                maxLength={32}
                autoComplete="username"
                placeholder="nama_pengguna"
                className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
              />
              <p className="text-xs text-[#5A6B82]">
                3–32 karakter: huruf, angka, titik, garis bawah, atau tanda hubung.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#25324B]" htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Ulangi password"
                className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              {loading ? "Memproses..." : "Daftar"}
            </Button>
            <div className="text-sm text-center text-[#5A6B82]">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-[#2563EB] hover:underline font-medium">
                Masuk
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
