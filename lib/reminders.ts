const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Rentang satu hari kalender Asia/Jakarta.
 * offsetDays = 1 berarti "besok".
 */
export function jakartaDayRange(offsetDays = 0): { start: Date; end: Date } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())

  const value = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value)

  const start = new Date(
    Date.UTC(value("year"), value("month") - 1, value("day") + offsetDays) -
      JAKARTA_OFFSET_MS,
  )

  return { start, end: new Date(start.getTime() + DAY_MS) }
}

export function formatJakartaDate(
  date: Date,
  style: "short" | "long" | "full" = "short",
): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: style,
  }).format(date)
}
