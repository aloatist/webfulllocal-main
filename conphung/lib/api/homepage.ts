import { prisma } from '@/lib/prisma'

export async function getHomepageContent() {
  return await prisma.homepageContent.findMany({
    orderBy: { order: 'asc' }
  })
}
