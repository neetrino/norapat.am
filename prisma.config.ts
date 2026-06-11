import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * URL for Prisma CLI (migrate, db push, studio).
 * Neon: prefer DIRECT_URL for migrations when set.
 * Empty string allows `prisma generate` without a live DB (postinstall).
 * Do not use `env()` — it throws when unset and breaks `prisma generate` on install.
 */
function cliDatabaseUrl(): string {
  const directUrl = process.env.DIRECT_URL?.trim()
  if (directUrl) {
    return directUrl
  }
  return process.env.DATABASE_URL?.trim() ?? ''
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
