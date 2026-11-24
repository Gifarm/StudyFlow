import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { sendPush } from "@/lib/push"
import { formatJakartaDate, jakartaDayRange } from "@/lib/reminders"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET

  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET belum dikonfigurasi." },
      { status: 500 },
    )
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { start, end } = jakartaDayRange(1)

  const tasks = await prisma.task.findMany({
    where: {
      deadline: { gte: start, lt: end },
      status: { not: "COMPLETED" },
    },
    include: {
      user: {
        select: {
          id: true,
          pushSubscriptions: true,
        },
      },
    },
    orderBy: { deadline: "asc" },
  })

  const perUser = new Map<
    string,
    {
      tasks: typeof tasks
      subscriptions: (typeof tasks)[number]["user"]["pushSubscriptions"]
    }
  >()

  for (const task of tasks) {
    if (task.user.pushSubscriptions.length === 0) continue

    const group = perUser.get(task.user.id)
    if (group) {
      group.tasks.push(task)
    } else {
      perUser.set(task.user.id, {
        tasks: [task],
        subscriptions: task.user.pushSubscriptions,
      })
    }
  }

  let sent = 0
  let removed = 0
  let failed = 0

  for (const group of perUser.values()) {
    const titles = group.tasks.map((task) => task.title)
    const preview = titles.slice(0, 3).join(", ")
    const more =
      titles.length > 3 ? ` +${titles.length - 3} tugas lainnya` : ""

    const payload = {
      title: "Tenggat besok 📚",
      body: `${titles.length} tugas: ${preview}${more}`,
      url: "/dashboard#tenggat-besok",
      tag: "studyflow-deadline-tomorrow",
    }

    for (const subscription of group.subscriptions) {
      try {
        await sendPush(
          {
            endpoint: subscription.endpoint,
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
          payload,
        )
        sent += 1
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode

        if (statusCode === 404 || statusCode === 410) {
          // Langganan sudah kedaluwarsa (browser uninstall/izin dicabut).
          await prisma.pushSubscription
            .delete({ where: { id: subscription.id } })
            .catch(() => undefined)
          removed += 1
        } else {
          failed += 1
          console.error("Gagal mengirim push:", subscription.id, statusCode)
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    date: formatJakartaDate(start, "full"),
    users: perUser.size,
    sent,
    removed,
    failed,
  })
}
