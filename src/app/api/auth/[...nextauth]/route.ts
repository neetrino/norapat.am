import NextAuth from "next-auth"
import type { NextRequest } from "next/server"
import { authOptions } from "@/lib/auth"
import { syncNextAuthUrlForDevelopment } from "@/lib/syncNextAuthUrlForDevelopment"

const secret =
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "production" ? undefined : "dev-fallback-secret")

const handler = NextAuth({
  ...authOptions,
  secret: secret ?? authOptions.secret,
})

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  syncNextAuthUrlForDevelopment(req)
  return handler(req, context)
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  syncNextAuthUrlForDevelopment(req)
  return handler(req, context)
}