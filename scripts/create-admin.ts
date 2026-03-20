/**
 * Creates or updates admin user: admin@gmail.com / admin123
 * Run: pnpm exec tsx scripts/create-admin.ts
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin123'

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
