import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

type SubscriptionBody = {
  endpoint?: unknown
  keys?: {
    p256dh?: unknown
    auth?: unknown
  }
}

function readEndpoint(body: SubscriptionBody): string {
  return typeof body.endpoint === "string" ? body.endpoint.trim() : ""
}

export async function POST(request: Request) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 },
    )
  }

  let body: SubscriptionBody
  try {
    body = (await request.json()) as SubscriptionBody
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 })
  }

  const endpoint = readEndpoint(body)
  const p256dh =
    typeof body.keys?.p256dh === "string" ? body.keys.p256dh.trim() : ""
  const authKey =
    typeof body.keys?.auth === "string" ? body.keys.auth.trim() : ""

  if (
    !endpoint.startsWith("https://") ||
    endpoint.length > 2048 ||
    !p256dh ||
    p256dh.length > 512 ||
    !authKey ||
    authKey.length > 256
  ) {
    return NextResponse.json(
      { error: "Data langganan tidak valid." },
      { status: 400 },
    )
  }

  // Satu endpoint hanya boleh terhubung ke satu akun. Jika browser yang sama
  // dipakai login akun lain, langganan dipindahkan ke akun yang aktif.
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId, p256dh, auth: authKey },
    create: { userId, endpoint, p256dh, auth: authKey },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 },
    )
  }

  let body: SubscriptionBody
  try {
    body = (await request.json()) as SubscriptionBody
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 })
  }

  const endpoint = readEndpoint(body)
  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint wajib diisi." }, { status: 400 })
  }

  await prisma.pushSubscription.deleteMany({
    where: { endpoint, userId },
  })

  return NextResponse.json({ ok: true })
}
