import { PrismaClient } from "@prisma/client"

const name = process.argv[2]?.trim()

if (!name) {
  console.error("Pemakaian: pnpm admin:promote <username>")
  process.exit(1)
}

const prisma = new PrismaClient()

try {
  const user = await prisma.user.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    select: { id: true, name: true },
  })

  if (!user) {
    console.error(`User "${name}" tidak ditemukan.`)
    process.exitCode = 1
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    })
    console.log(`✔ ${user.name} sekarang memiliki akses ADMIN.`)
  }
} catch (error) {
  console.error("Gagal promote admin:", error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
