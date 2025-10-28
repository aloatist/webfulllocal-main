import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

function generateId() {
  return randomBytes(12).toString('base64url')
}

async function createAdmin() {
  try {
    const email = 'admin@example.com'
    const password = 'admin123'
    
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('✅ Admin user already exists!')
      console.log('Email:', email)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        id: generateId(),
        email,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Role:', admin.role)
    console.log('\n⚠️  Please change the password after first login!')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
