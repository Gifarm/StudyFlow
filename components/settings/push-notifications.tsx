"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type Status =
  | "loading"
  | "unsupported"
  | "unconfigured"
  | "inactive"
  | "active"
  | "denied"
  | "error"

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = window.atob(base64)
  const output = new Uint8Array(new ArrayBuffer(raw.length))

  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i)
  }

  return output
}

export function PushNotifications({ deviceCount }: { deviceCount: number }) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const [status, setStatus] = useState<Status>("loading")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!publicKey) {
      setStatus("unconfigured")
      return
    }

    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setStatus("unsupported")
      return
    }

    let cancelled = false

    navigator.serviceWorker
      .getRegistration("/sw.js")
      .then(async (registration) => {
        const subscription = await registration?.pushManager.getSubscription()
        if (cancelled) return

        if (subscription) {
          setStatus("active")
        } else if (Notification.permission === "denied") {
          setStatus("denied")
        } else {
          setStatus("inactive")
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("inactive")
      })

    return () => {
      cancelled = true
    }
  }, [publicKey])

  async function enable() {
    if (!publicKey) return

    setBusy(true)
    setMessage(null)

    try {
      const permission = await Notification.requestPermission()

      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "inactive")
        setMessage("Izin notifikasi belum diberikan.")
        return
      }

      const registration = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready

      const existing = await registration.pushManager.getSubscription()
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }))

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })

      if (!response.ok) {
        throw new Error("Gagal menyimpan langganan.")
      }

      setStatus("active")
      setMessage("Notifikasi aktif di perangkat ini.")
    } catch (error) {
      console.error(error)
      setStatus("error")
      setMessage("Gagal mengaktifkan notifikasi. Coba lagi.")
    } finally {
      setBusy(false)
    }
  }

  async function sendTest() {
    setBusy(true)
    setMessage(null)

    try {
      const response = await fetch("/api/push/test", { method: "POST" })
      const data = (await response.json()) as {
        error?: string
        sent?: number
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Gagal mengirim notifikasi uji.")
      }

      setMessage(
        data.sent && data.sent > 0
          ? "Notifikasi uji terkirim. Cek notifikasi di perangkatmu."
          : "Belum ada perangkat aktif yang bisa dikirimi.",
      )
    } catch (error) {
      console.error(error)
      setMessage("Gagal mengirim notifikasi uji. Coba lagi.")
    } finally {
      setBusy(false)
    }
  }

  async function disable() {
    setBusy(true)
    setMessage(null)

    try {
      const registration = await navigator.serviceWorker.getRegistration("/sw.js")
      const subscription = await registration?.pushManager.getSubscription()

      if (subscription) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
        await subscription.unsubscribe()
      }

      setStatus("inactive")
      setMessage("Notifikasi dimatikan di perangkat ini.")
    } catch (error) {
      console.error(error)
      setStatus("error")
      setMessage("Gagal mematikan notifikasi. Coba lagi.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-[#2563EB]">
          <Bell className="size-4" />
        </div>
        <div className="space-y-1 text-sm text-[#5A6B82]">
          <p>
            Kami mengirim pengingat sekali sehari sekitar pukul 08.00 WIB jika
            ada tugas dengan tenggat besok.
          </p>
          <p>
            Di iPhone, tambahkan StudyFlow ke Home Screen terlebih dahulu agar
            notifikasi dapat muncul.
          </p>
          {deviceCount > 0 && (
            <p className="text-xs">
              Tersimpan di {deviceCount} perangkat.
            </p>
          )}
        </div>
      </div>

      {status === "loading" && (
        <p className="text-sm text-[#5A6B82]">Memeriksa status notifikasi...</p>
      )}

      {status === "unsupported" && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Browser ini belum mendukung notifikasi push. Coba Chrome, Edge, atau
          Firefox terbaru.
        </p>
      )}

      {status === "unconfigured" && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Notifikasi belum dikonfigurasi di server. Hubungi pengelola aplikasi.
        </p>
      )}

      {status === "denied" && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Izin notifikasi diblokir. Buka pengaturan situs di browser, izinkan
          notifikasi untuk StudyFlow, lalu muat ulang halaman ini.
        </p>
      )}

      {status === "active" ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={sendTest}
            disabled={busy}
            className="border-[#E5EAF3] text-[#25324B]"
          >
            {busy ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Bell className="mr-2 size-4" />
            )}
            Kirim Notifikasi Uji
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={disable}
            disabled={busy}
            className="border-[#E5EAF3] text-[#25324B]"
          >
            <BellOff className="mr-2 size-4" />
            Matikan di Perangkat Ini
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          onClick={enable}
          disabled={
            busy ||
            status === "loading" ||
            status === "unsupported" ||
            status === "unconfigured" ||
            status === "denied"
          }
          className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
        >
          {busy ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Bell className="mr-2 size-4" />
          )}
          Aktifkan Notifikasi
        </Button>
      )}

      {message && (
        <p role="status" className="text-sm text-[#5A6B82]">
          {message}
        </p>
      )}
    </div>
  )
}
