import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getClientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit"

// Hash dummy agar waktu respons login relatif sama saat username tidak ada,
// sehingga keberadaan akun tidak mudah ditebak lewat timing.
const DUMMY_HASH = "$2b$10$52PWdIJX4r03jAoDk7RIU.FP9//TIVVQhTiuZInQ8vwvrko7CVBai"

const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_PER_IDENTITY = 5
const LOGIN_MAX_PER_IP = 20

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        name: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const name =
          typeof credentials?.name === "string" ? credentials.name.trim() : ""
        const password =
          typeof credentials?.password === "string" ? credentials.password : ""

        if (!name || !password) {
          return null
        }

        const ip = getClientIp(request.headers)
        const identityKey = `login:${ip}:${name.toLowerCase()}`
        const ipKey = `login-ip:${ip}`

        const identityLimit = rateLimit(
          identityKey,
          LOGIN_MAX_PER_IDENTITY,
          LOGIN_WINDOW_MS,
        )
        const ipLimit = rateLimit(ipKey, LOGIN_MAX_PER_IP, LOGIN_WINDOW_MS)

        if (!identityLimit.success || !ipLimit.success) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: { name: { equals: name, mode: "insensitive" } },
        })

        if (!user) {
          // Tetap jalankan bcrypt agar waktu respons tidak membocorkan
          // apakah username tersebut ada.
          await bcrypt.compare(password, DUMMY_HASH)
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) {
          return null
        }

        resetRateLimit(identityKey)
        resetRateLimit(ipKey)

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          tokenVersion: user.tokenVersion,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (!token.sub) {
        return { expires: session.expires } as typeof session
      }

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { name: true, role: true, tokenVersion: true },
      })

      // Token lama otomatis tidak berlaku setelah password diubah
      // (tokenVersion dinaikkan) atau akun dihapus.
      if (!user || user.tokenVersion !== (token.tokenVersion ?? 0)) {
        return { expires: session.expires } as typeof session
      }

      session.user.id = token.sub
      session.user.name = user.name
      session.user.role = user.role
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.name = user.name
        token.role = user.role
        token.tokenVersion = user.tokenVersion
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  useSecureCookies: process.env.NODE_ENV === "production",
})
