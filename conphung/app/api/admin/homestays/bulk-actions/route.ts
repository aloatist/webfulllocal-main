import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'

const bulkActionSchema = z.object({
  action: z.enum(['publish', 'unpublish', 'feature', 'unfeature', 'verify', 'delete']),
  homestayIds: z.array(z.string()).min(1),
})

export async function POST(request: NextRequest) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { action, homestayIds } = bulkActionSchema.parse(body)

    let result: any = { success: true, affectedCount: 0 }

    switch (action) {
      case 'publish':
        result = await prisma.homestay.updateMany({
          where: { id: { in: homestayIds } },
          data: { status: 'PUBLISHED' },
        })
        break

      case 'unpublish':
        result = await prisma.homestay.updateMany({
          where: { id: { in: homestayIds } },
          data: { status: 'DRAFT' },
        })
        break

      case 'feature':
        result = await prisma.homestay.updateMany({
          where: { id: { in: homestayIds } },
          data: { isFeatured: true } as any,
        })
        break

      case 'unfeature':
        result = await prisma.homestay.updateMany({
          where: { id: { in: homestayIds } },
          data: { isFeatured: false } as any,
        })
        break

      case 'verify':
        result = await prisma.homestay.updateMany({
          where: { id: { in: homestayIds } },
          data: { isVerified: true } as any,
        })
        break

      case 'delete':
        // Delete in order to respect foreign key constraints
        await prisma.homestayReview.deleteMany({
          where: { homestayId: { in: homestayIds } },
        })
        await prisma.homestayPricingRule.deleteMany({
          where: { homestayId: { in: homestayIds } },
        })
        await prisma.homestayAvailability.deleteMany({
          where: { homestayId: { in: homestayIds } },
        })
        await prisma.homestayBooking.deleteMany({
          where: { homestayId: { in: homestayIds } },
        })
        await prisma.homestayRoom.deleteMany({
          where: { homestayId: { in: homestayIds } },
        })
        await prisma.homestayMedia.deleteMany({
          where: { homestayId: { in: homestayIds } },
        })
        result = await prisma.homestay.deleteMany({
          where: { id: { in: homestayIds } },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Bulk action ${action} executed successfully`,
      affectedCount: result.count || homestayIds.length,
    })
  } catch (error) {
    console.error('Failed to execute bulk action:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
