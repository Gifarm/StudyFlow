import { sendNotification, setVapidDetails } from "web-push"

export type PushSubscriptionKeys = {
  endpoint: string
  p256dh: string
  auth: string
}

export type PushPayload = {
  title: string
  body: string
  url?: string
  tag?: string
}

let configured = false

export function isPushConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY,
  )
}

function ensureConfigured(): boolean {
  if (configured) return true

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) return false

  setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@studyflow.local",
    publicKey,
    privateKey,
  )
  configured = true
  return true
}

export async function sendPush(
  subscription: PushSubscriptionKeys,
  payload: PushPayload,
) {
  if (!ensureConfigured()) {
    throw new Error("VAPID key belum dikonfigurasi.")
  }

  return sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    },
    JSON.stringify(payload),
    { TTL: 12 * 60 * 60 },
  )
}
