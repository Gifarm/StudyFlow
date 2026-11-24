"use client"

import { useState } from "react"

import { changePassword } from "@/app/(dashboard)/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PasswordForm() {
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
        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 text-sm bg-green-50 text-green-600 rounded-md border border-green-200">
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
            minLength={6}
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
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
            minLength={6}
            autoComplete="new-password"
            className="border-[#E5EAF3] focus-visible:ring-[#4F8EF7]"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#4F8EF7] hover:bg-[#3677E8] text-white"
      >
        {loading ? "Menyimpan..." : "Ubah Password"}
      </Button>
    </form>
  )
}
