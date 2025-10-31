import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { PERMISSIONS } from '../lib/permissions/definitions'

function generateId() {
  return randomBytes(12).toString('base64url')
}

async function createDefaultAdmin() {
  try {
    const email = 'aloatist@gmail.com'
    const password = 'ChangeMe123!'
    const permissions = Object.keys(PERMISSIONS)
    
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('✅ Default admin user already exists!')
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
        name: 'Administrator',
        role: 'SUPER_ADMIN',
        permissions,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    console.log('✅ Default admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('👤 Role:', admin.role)
    console.log('🛡️ Permissions:', 'Full access (SUPER_ADMIN)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n⚠️  IMPORTANT: Please change this password after first login!')
    console.log('🔗 Login at: http://localhost:3000/login')
  } catch (error) {
    console.error('❌ Error creating default admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultAdmin()
