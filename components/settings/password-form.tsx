"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { changePassword } from "@/app/(dashboard)/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PasswordForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await changePassword(new FormData(form))
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setSuccess(result.success)
        form.reset()
        // Sesi lama sengaja diinvalidasi oleh server, jadi arahkan ke login.
        setTimeout(() => {
          router.push("/login?passwordChanged=success")
          router.refresh()
        }, 1500)
      }
    } catch {
      setError("Terjadi kesalahan pada sistem. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div role="alert" className="p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="p-3 text-sm bg-green-50 text-green-600 rounded-md border border-green-200">
          {success}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#25324B]" htmlFor="currentPassword">
          Password Saat Ini
        </label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#25324B]" htmlFor="newPassword">
            Password Baru
          </label>
          <Input
            id="newPassword"
            name="newPassword"
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
            Konfirmasi Password Baru
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2563EB] text-white hover:bg-[#1D4ED8] sm:w-auto"
      >
        {loading ? "Menyimpan..." : "Ubah Password"}
      </Button>
    </form>
  )
}
