import type { DefaultSession } from "next-auth"
import type { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    tokenVersion: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
    tokenVersion?: number
  }
}
