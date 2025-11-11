import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sanitizeReviewContent, sanitizeUserName } from '@/lib/utils/sanitize';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  fullName: z.string().min(1).max(100),
  comment: z.string().optional().nullable(),
  // Legacy fields for backward compatibility
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});

// GET - Get all reviews for a tour
export async function GET(
  request: NextRequest,
  context: { params: { tourId: string } }
) {
  try {
    const { tourId } = context.params;

    const reviews = await prisma.tourReview.findMany({
      where: {
        tourId,
        isPublished: true, // Only show published reviews
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format for frontend - use fullName from review
    // Note: Content is already sanitized when saved, but we ensure it's safe for display
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.content || null, // Already sanitized in database
      createdAt: review.createdAt.toISOString(),
      User: { name: review.fullName || 'Người dùng', image: null }, // Already sanitized in database
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error('Failed to fetch tour reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Submit a new review
export async function POST(
  request: NextRequest,
  context: { params: { tourId: string } }
) {
  try {

    const { tourId } = context.params;
    const body = await request.json();
    const data = reviewSchema.parse(body);

    // Check if tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      select: { id: true },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour không tồn tại' },
        { status: 404 }
      );
    }

    // Note: Customer ID check removed - allow anonymous reviews
    // In production, you may want to check customerId or email

    // Optional: Check if user has booked this tour
    // const hasBooking = await prisma.tourBooking.findFirst({
    //   where: {
    //     tourId,
    //     userId: session.user.id,
    //     status: 'CONFIRMED',
    //   },
    // });
    // if (!hasBooking) {
    //   return NextResponse.json(
    //     { error: 'Bạn cần đặt tour này trước khi đánh giá' },
    //     { status: 403 }
    //   );
    // }

    // Sanitize user input to prevent XSS attacks
    const sanitizedFullName = sanitizeUserName(data.fullName);
    // Support both 'comment' and 'content' fields for backward compatibility
    const commentText = data.comment || data.content || '';
    const sanitizedContent = sanitizeReviewContent(commentText, 5000);
    const sanitizedTitle = data.title ? sanitizeReviewContent(data.title, 200) : null;

    // Create review
    const review = await prisma.tourReview.create({
      data: {
        id: nanoid(),
        tourId,
        customerId: null, // Anonymous review
        fullName: sanitizedFullName,
        rating: data.rating,
        title: sanitizedTitle,
        content: sanitizedContent || null,
        isPublished: false, // Requires admin approval
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Update tour average rating
    const allReviews = await prisma.tourReview.findMany({
      where: {
        tourId,
        isPublished: true,
      },
      select: {
        rating: true,
      },
    });

    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await prisma.tour.update({
        where: { id: tourId },
        data: {
          // Note: Add ratingAverage field to Tour model if not exists
          // ratingAverage: avgRating,
          // reviewCount: allReviews.length,
        },
      });
    }

    return NextResponse.json({
      id: review.id,
      rating: review.rating,
      comment: review.content,
      createdAt: review.createdAt.toISOString(),
      User: { name: review.fullName, image: null },
      message: 'Đánh giá của bạn đã được gửi và đang chờ kiểm duyệt',
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create tour review:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Không thể tạo đánh giá' },
      { status: 500 }
    );
  }
}
