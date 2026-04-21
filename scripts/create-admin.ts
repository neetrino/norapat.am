/**
 * Creates or updates admin user: sudo@norapat.com / os£uC4=gm1t"GN65dreKXPn/qDjP>k
 * Run: pnpm exec tsx scripts/create-admin.ts   
 */
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { createPrismaClient } from '../src/lib/prisma'

const prisma = createPrismaClient()

const ADMIN_EMAIL = 'sudo@norapat.com'
const ADMIN_PASSWORD = 'os£uC4=gm1t"GN65dreKXPn/qDjP>k'

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin',
    },
    create: {
      email: ADMIN_EMAIL,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user ready:', admin.email)
  console.log('   Password:', ADMIN_PASSWORD)
  console.log('   Login at: /login → then open /admin')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
