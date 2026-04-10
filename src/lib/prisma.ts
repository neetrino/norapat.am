import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

function normalizePostgresSslMode(connectionString: string): string {
  const normalized = new URL(connectionString)
  const sslMode = normalized.searchParams.get('sslmode')

  if (sslMode === 'require') {
    normalized.searchParams.set('sslmode', 'verify-full')
  }

  return normalized.toString()
}

/**
 * Creates a Prisma Client with the PostgreSQL driver adapter (Prisma ORM 7+).
 */
export function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  const adapter = new PrismaPg({
    connectionString: normalizePostgresSslMode(connectionString),
  })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
