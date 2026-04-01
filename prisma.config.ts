import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

/**
 * URL for Prisma CLI (migrate, db push, studio).
 * Neon: prefer DIRECT_URL for migrations when set.
 */
function cliDatabaseUrl(): string {
  const directUrl = process.env.DIRECT_URL
  if (directUrl) {
    return directUrl
  }
  return env('DATABASE_URL')
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
