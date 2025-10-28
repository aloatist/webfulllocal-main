import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { seedPermissions } from './seed-permissions'
import { seedSocialMediaTemplates } from './seed-social-media'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  console.log('')
  
  // Seed permissions and roles first
  await seedPermissions()
  console.log('')
  
  // Seed social media templates
  await seedSocialMediaTemplates()
  console.log('')

  // Tạo Admin User - Tổng Giám đốc
  const adminEmail = 'conphung87@yahoo.com.vn'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        id: nanoid(),
        email: adminEmail,
        password: hashedPassword,
        name: 'Phan Văn Thông',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    console.log('✅ Created admin user:', admin.email)
  } else {
    console.log('ℹ️  Admin user already exists')
  }

  // Tạo Editor User - Phó Tổng Giám đốc
  const editorEmail = 'conphungtourist87@gmail.com'
  const existingEditor = await prisma.user.findUnique({
    where: { email: editorEmail },
  })

  if (!existingEditor) {
    const hashedPassword = await bcrypt.hash('editor123', 10)
    
    const editor = await prisma.user.create({
      data: {
        id: nanoid(),
        email: editorEmail,
        password: hashedPassword,
        name: 'Nguyễn Thị Thu Cúc',
        role: 'EDITOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    console.log('✅ Created editor user:', editor.email)
  } else {
    console.log('ℹ️  Editor user already exists')
  }

  // Tạo Default Categories
  const categories = [
    { name: 'Du lịch', slug: 'du-lich', description: 'Các bài viết về du lịch' },
    { name: 'Ẩm thực', slug: 'am-thuc', description: 'Các món ăn đặc sản' },
    { name: 'Homestay', slug: 'homestay', description: 'Thông tin về homestay' },
    { name: 'Tin tức', slug: 'tin-tuc', description: 'Tin tức và sự kiện' },
  ]

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    })

    if (!existing) {
      await prisma.category.create({
        data: {
          id: nanoid(),
          ...cat,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      console.log('✅ Created category:', cat.name)
    } else {
      console.log('ℹ️  Category already exists:', cat.name)
    }
  }

  // Tạo Default Tags
  const tags = [
    { name: 'Cồn Phụng', slug: 'con-phung' },
    { name: 'Bến Tre', slug: 'ben-tre' },
    { name: 'Miền Tây', slug: 'mien-tay' },
    { name: 'Tour', slug: 'tour' },
    { name: 'Đạo Dừa', slug: 'dao-dua' },
  ]

  for (const tag of tags) {
    const existing = await prisma.tag.findUnique({
      where: { slug: tag.slug },
    })

    if (!existing) {
      await prisma.tag.create({
        data: {
          id: nanoid(),
          ...tag,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      console.log('✅ Created tag:', tag.name)
    } else {
      console.log('ℹ️  Tag already exists:', tag.name)
    }
  }

  console.log('🎉 Seeding completed!')
  console.log('')
  console.log('📝 Login credentials:')
  console.log('   Admin (Tổng Giám đốc):  conphung87@yahoo.com.vn / admin123')
  console.log('   Editor (Phó Tổng Giám đốc): conphungtourist87@gmail.com / editor123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
