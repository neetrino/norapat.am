import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/** Placeholder for `prisma generate` when no DB URL is set (CI/Vercel install). */
const GENERATE_ONLY_DATABASE_URL =
  'postgresql://placeholder:placeholder@localhost:5432/placeholder'

/**
 * URL for Prisma CLI (migrate, db push, studio).
 * Neon: prefer DIRECT_URL for migrations when set.
 * Do not use `env()` — it throws when unset and breaks `prisma generate` on install.
 */
function cliDatabaseUrl(): string {
  const directUrl = process.env.DIRECT_URL
  if (directUrl) {
    return directUrl
  }
  return process.env.DATABASE_URL ?? GENERATE_ONLY_DATABASE_URL
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
