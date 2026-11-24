import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendPush } from "@/lib/push"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 },
    )
  }

  const limit = rateLimit(`push-test:${userId}`, 3, 60 * 60 * 1000)
  if (!limit.success) {
    return NextResponse.json(
      { error: "Terlalu sering. Coba lagi nanti." },
      { status: 429 },
    )
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  })

  if (subscriptions.length === 0) {
    return NextResponse.json(
      { error: "Belum ada perangkat yang mengaktifkan notifikasi." },
      { status: 400 },
    )
  }

  let sent = 0
  let removed = 0
  let failed = 0

  for (const subscription of subscriptions) {
    try {
      await sendPush(
        {
          endpoint: subscription.endpoint,
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
        {
          title: "Notifikasi uji StudyFlow 🎉",
          body: "Kalau kamu melihat ini, notifikasi tenggat sudah aktif.",
          url: "/settings",
          tag: "studyflow-test",
        },
      )
      sent += 1
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode

      if (statusCode === 404 || statusCode === 410) {
        await prisma.pushSubscription
          .delete({ where: { id: subscription.id } })
          .catch(() => undefined)
        removed += 1
      } else {
        failed += 1
        console.error("Gagal mengirim push uji:", subscription.id, statusCode)
      }
    }
  }

  return NextResponse.json({ ok: true, sent, removed, failed })
}
