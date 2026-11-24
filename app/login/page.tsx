"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const passwordChanged = searchParams.get("passwordChanged")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        name,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Username atau password salah.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Terjadi kesalahan pada sistem.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-[#E5EAF3] shadow-sm bg-white">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-[#25324B]">Masuk ke StudyFlow</CardTitle>
        <CardDescription className="text-[#5A6B82]">
          Lanjutkan progres belajarmu hari ini
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {registered === "success" && (
            <div className="p-3 text-sm bg-green-50 text-green-600 rounded-md border border-green-200">
              Registrasi berhasil! Silakan masuk dengan akun Anda.
            </div>
          )}
          {passwordChanged === "success" && (
            <div role="status" className="p-3 text-sm bg-green-50 text-green-600 rounded-md border border-green-200">
              Password berhasil diubah. Silakan masuk kembali dengan password baru.
            </div>
          )}
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
              autoComplete="username"
              placeholder="nama_pengguna"
              className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
            />
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
              autoComplete="current-password"
              placeholder="••••••••"
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
            {loading ? "Memproses..." : "Masuk"}
          </Button>
          <div className="text-sm text-center text-[#5A6B82]">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#2563EB] hover:underline font-medium">
              Daftar
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] px-4">
      <Suspense fallback={<div className="text-center text-[#5A6B82]">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
