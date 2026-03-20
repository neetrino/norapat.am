import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const secret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  (process.env.NODE_ENV === "production" ? undefined : "dev-fallback-secret")

const handler = NextAuth({
  ...authOptions,
  secret: secret ?? authOptions.secret,
})

export { handler as GET, handler as POST }