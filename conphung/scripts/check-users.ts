import { prisma } from '../lib/prisma'

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
      take: 5,
    })

    console.log('Users in database:')
    console.log(JSON.stringify(users, null, 2))

    if (users.length === 0) {
      console.log('\n⚠️  No users found in database!')
      console.log('You need to create a user first.')
      console.log('Run: npm run seed or create a user via the register API')
    }
  } catch (error) {
    console.error('Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
