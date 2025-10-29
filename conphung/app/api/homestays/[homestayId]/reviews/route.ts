import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { nanoid } from 'nanoid'

const paramsSchema = z.object({
  homestayId: z.string(),
})

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional().nullable(),
  cleanlinessRating: z.number().min(1).max(5).optional(),
  communicationRating: z.number().min(1).max(5).optional(),
  accuracyRating: z.number().min(1).max(5).optional(),
  locationRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
})

const updateReviewSchema = createReviewSchema.partial().extend({
  hostResponse: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  context: { params: { homestayId: string } }
) {
  // Public endpoint - no auth required for viewing reviews

  try {
    const { homestayId } = paramsSchema.parse(context.params)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Prisma.HomestayReviewWhereInput = { 
      homestayId,
      status: 'APPROVED', // Only show approved reviews for public
    }

    const reviews = await prisma.homestayReview.findMany({
      where,
      include: {
        User: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Format for frontend
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: Number(review.overallRating),
      comment: review.content,
      createdAt: review.createdAt.toISOString(),
      User: review.User,
      cleanlinessRating: review.cleanlinessRating ? Number(review.cleanlinessRating) : null,
      accuracyRating: review.accuracyRating ? Number(review.accuracyRating) : null,
      communicationRating: review.communicationRating ? Number(review.communicationRating) : null,
      locationRating: review.locationRating ? Number(review.locationRating) : null,
      valueRating: review.valueRating ? Number(review.valueRating) : null,
    }));

    return NextResponse.json(formattedReviews)
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
  // Require authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Bạn cần đăng nhập để đánh giá' },
      { status: 401 }
    );
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
      return NextResponse.json({ error: 'Homestay không tồn tại' }, { status: 404 })
    }

    // Get reviewerId from session
    const reviewerId = session.user.id;

    const review = await prisma.homestayReview.create({
      data: {
        id: nanoid(),
        homestayId,
        reviewerId,
        overallRating: data.rating,
        content: data.comment,
        cleanlinessRating: data.cleanlinessRating,
        communicationRating: data.communicationRating,
        accuracyRating: data.accuracyRating,
        locationRating: data.locationRating,
        valueRating: data.valueRating,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        User: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    // Update homestay rating average
    await updateHomestayRating(homestayId)

    return NextResponse.json({
      id: review.id,
      rating: Number(review.overallRating),
      comment: review.content,
      createdAt: review.createdAt.toISOString(),
      User: review.User,
      message: 'Đánh giá của bạn đã được gửi và đang chờ kiểm duyệt',
    }, { status: 201 })
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
