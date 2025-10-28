import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'

const paramsSchema = z.object({
  homestayId: z.string(),
})

const createReviewSchema = z.object({
  reviewerId: z.string(),
  bookingId: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'HIDDEN']).default('PENDING'),
  overallRating: z.number().min(1).max(5),
  cleanlinessRating: z.number().min(1).max(5).optional(),
  communicationRating: z.number().min(1).max(5).optional(),
  checkinRating: z.number().min(1).max(5).optional(),
  accuracyRating: z.number().min(1).max(5).optional(),
  locationRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  isVerified: z.boolean().default(false),
})

const updateReviewSchema = createReviewSchema.partial().extend({
  hostResponse: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  context: { params: { homestayId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId } = paramsSchema.parse(context.params)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Prisma.HomestayReviewWhereInput = { homestayId }
    if (status) {
      where.status = status as any
    }

    const reviews = await prisma.homestayReview.findMany({
      where,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            reference: true,
            checkIn: true,
            checkOut: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: reviews })
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid homestay id', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { homestayId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId } = paramsSchema.parse(context.params)
    const body = await request.json()
    const data = createReviewSchema.parse(body)

    // Verify homestay exists
    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
    })

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    // Verify reviewer exists
    const reviewer = await prisma.user.findUnique({
      where: { id: data.reviewerId },
    })

    if (!reviewer) {
      return NextResponse.json({ error: 'Reviewer not found' }, { status: 404 })
    }

    const review = await prisma.homestayReview.create({
      data: {
        ...data,
        homestayId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            reference: true,
            checkIn: true,
            checkOut: true,
          },
        },
      },
    })

    // Update homestay rating average
    await updateHomestayRating(homestayId)

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Failed to create review:', error)
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

async function updateHomestayRating(homestayId: string) {
  const stats = await prisma.homestayReview.aggregate({
    where: {
      homestayId,
      status: 'APPROVED',
    },
    _avg: {
      overallRating: true,
    },
    _count: {
      overallRating: true,
    },
  })

  await prisma.homestay.update({
    where: { id: homestayId },
    data: {
      ratingAverage: stats._avg.overallRating,
      reviewCount: stats._count.overallRating,
    },
  })
}
