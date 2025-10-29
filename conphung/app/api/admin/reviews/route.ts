import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    // Query both tour and homestay reviews
    const [tourReviews, homestayReviews] = await Promise.all([
      // Tour reviews
      prisma.tourReview.findMany({
        where: status && status !== 'all' ? {
          status: status as any,
        } : undefined,
        include: {
          Tour: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      // Homestay reviews
      prisma.homestayReview.findMany({
        where: status && status !== 'all' ? {
          status: status as any,
        } : undefined,
        include: {
          User: {
            select: {
              name: true,
              email: true,
            },
          },
          Homestay: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    // Format tour reviews
    const formattedTourReviews = tourReviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.content || '',
      status: review.status,
      createdAt: review.createdAt.toISOString(),
      user: {
        name: review.fullName,
        email: 'N/A',
      },
      booking: {
        tour: {
          id: review.Tour.id,
          title: review.Tour.title,
          slug: review.Tour.slug,
        },
      },
      adminResponse: review.adminResponse,
      type: 'tour',
    }));

    // Format homestay reviews
    const formattedHomestayReviews = homestayReviews.map(review => ({
      id: review.id,
      rating: Number(review.overallRating),
      comment: review.content || '',
      status: review.status,
      createdAt: review.createdAt.toISOString(),
      user: {
        name: review.User.name || 'N/A',
        email: review.User.email || 'N/A',
      },
      booking: {
        homestay: {
          id: review.Homestay.id,
          title: review.Homestay.title,
          slug: review.Homestay.slug,
        },
      },
      adminResponse: review.hostResponse,
      type: 'homestay',
    }));

    // Combine and sort by date
    const allReviews = [...formattedTourReviews, ...formattedHomestayReviews]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      reviews: allReviews,
      total: allReviews.length,
    });
  } catch (error) {
    console.error('Error loading reviews:', error);
    return NextResponse.json(
      { error: 'Failed to load reviews' },
      { status: 500 }
    );
  }
}
