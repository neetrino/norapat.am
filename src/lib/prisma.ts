import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

const SERVERLESS_POOL_MAX_CONNECTIONS = 1
const SERVERLESS_POOL_IDLE_TIMEOUT_MS = 20_000
const SERVERLESS_POOL_CONNECT_TIMEOUT_MS = 10_000

/** Neon adds this param; `pg` on Vercel serverless often fails with it. */
function normalizeDatabaseUrl(connectionString: string): string {
  const parsed = new URL(connectionString)
  parsed.searchParams.delete('channel_binding')
  return parsed.toString()
}

/**
 * Creates a Prisma Client with the PostgreSQL driver adapter (Prisma ORM 7+).
 */
export function createPrismaClient(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  const connectionString = normalizeDatabaseUrl(rawUrl)
  const pool = new Pool({
    connectionString,
    max: SERVERLESS_POOL_MAX_CONNECTIONS,
    idleTimeoutMillis: SERVERLESS_POOL_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: SERVERLESS_POOL_CONNECT_TIMEOUT_MS,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

/**
 * Lazy singleton — avoids connecting during `next build` when routes are imported.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = Reflect.get(client, prop, client) as unknown
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client)
    }
    return value
  },
})
