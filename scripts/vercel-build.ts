import { execSync } from 'node:child_process'

function run(command: string): void {
  execSync(command, { stdio: 'inherit' })
}

function hasDatabaseEnv(): boolean {
  return Boolean(
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  )
}

function logDatabaseEnvStatus(): void {
  const hasDirect = Boolean(process.env.DIRECT_URL?.trim())
  const hasDatabase = Boolean(process.env.DATABASE_URL?.trim())
  console.info(
    `[vercel-build] DIRECT_URL=${hasDirect ? 'set' : 'missing'}, DATABASE_URL=${hasDatabase ? 'set' : 'missing'}`
  )
}

logDatabaseEnvStatus()
run('prisma generate')

if (hasDatabaseEnv()) {
  run('prisma migrate deploy')
} else {
  console.warn(
    '[vercel-build] Skipping prisma migrate deploy — add DIRECT_URL and DATABASE_URL on Vercel (Production + Preview), then redeploy.'
  )
}

run('next build --turbopack')
