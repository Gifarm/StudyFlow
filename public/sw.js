self.addEventListener("push", (event) => {
  let data = {}

  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : "" }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "StudyFlow", {
      body: data.body || "Ada pengingat baru untukmu.",
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: data.tag || "studyflow",
      data: { url: data.url || "/dashboard" },
    }),
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || "/dashboard"

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      })

      for (const client of windows) {
        if ("focus" in client) {
          try {
            await client.navigate(targetUrl)
          } catch {
            // Navigasi lintas origin tidak diizinkan; cukup fokus.
          }
          return client.focus()
        }
      }

      return self.clients.openWindow(targetUrl)
    })(),
  )
})
