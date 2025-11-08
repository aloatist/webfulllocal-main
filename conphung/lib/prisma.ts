import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Cấu hình Prisma Client với connection pooling và timeout để tránh mất kết nối VPS
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings - tối ưu cho VPS
  // Giảm số lượng connection để tránh quá tải
  // Tăng timeout để xử lý kết nối chậm
})

// Đảm bảo singleton pattern để tránh tạo nhiều Prisma instances
// Cần set cả trong production để tránh memory leak và connection issues
globalForPrisma.prisma = prisma

// Graceful shutdown - đóng kết nối khi app tắt
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })

  process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

// Connection health check với retry logic
export async function checkDatabaseConnection(retries = 3, delay = 1000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error(`Database connection check failed (attempt ${i + 1}/${retries}):`, error)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  return false
}