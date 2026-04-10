import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

function normalizePostgresSslMode(connectionString: string): string {
  const normalized = new URL(connectionString)
  const sslMode = normalized.searchParams.get('sslmode')

  if (sslMode === 'require') {
    normalized.searchParams.set('sslmode', 'verify-full')
  }

  return normalized.toString()
}

/**
 * URL for Prisma CLI (migrate, db push, studio).
 * Neon: prefer DIRECT_URL for migrations when set.
 */
function cliDatabaseUrl(): string {
  const directUrl = process.env.DIRECT_URL
  if (directUrl) {
    return normalizePostgresSslMode(directUrl)
  }
  return normalizePostgresSslMode(env('DATABASE_URL'))
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx scripts/seed.ts',
  },
  datasource: {
    url: cliDatabaseUrl(),
  },
})
