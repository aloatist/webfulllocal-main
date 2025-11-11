import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { sanitizeReviewContent } from '@/lib/utils/sanitize';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, adminResponse } = body;

    console.log('[PATCH Review] ID:', params.id, 'Status:', status, 'Response:', adminResponse);

    // Sanitize admin response to prevent XSS (even from trusted admins)
    const sanitizedResponse = adminResponse !== undefined && adminResponse !== null
      ? sanitizeReviewContent(adminResponse, 2000)
      : undefined;

    // Try to update as homestay review first
    const homestayReview = await prisma.homestayReview.findUnique({
      where: { id: params.id },
    });

    if (homestayReview) {
      console.log('[PATCH] Found homestay review, updating...');
      
      const updated = await prisma.homestayReview.update({
        where: { id: params.id },
        data: {
          ...(status && { status: status }),
          ...(sanitizedResponse !== undefined && { hostResponse: sanitizedResponse || null }),
          updatedAt: new Date(),
        },
      });

      console.log('[PATCH] Updated homestay review:', updated.id, 'New status:', updated.status);

      return NextResponse.json({
        success: true,
        message: 'Homestay review updated successfully',
        review: {
          id: updated.id,
          status: updated.status,
          hostResponse: updated.hostResponse,
        },
      });
    }

    // Try tour review
    const tourReview = await prisma.tourReview.findUnique({
      where: { id: params.id },
    });

    if (tourReview) {
      console.log('[PATCH] Found tour review, updating...');
      
      const updated = await prisma.tourReview.update({
        where: { id: params.id },
        data: {
          ...(status && { 
            status: status,
            isPublished: status === 'APPROVED' 
          }),
          ...(sanitizedResponse !== undefined && { 
            adminResponse: sanitizedResponse || null,
            respondedAt: sanitizedResponse ? new Date() : null
          }),
          updatedAt: new Date(),
        },
      });

      console.log('[PATCH] Updated tour review:', updated.id, 'New status:', updated.status, 'Response:', updated.adminResponse);

      return NextResponse.json({
        success: true,
        message: 'Tour review updated successfully',
        review: {
          id: updated.id,
          status: updated.status,
          adminResponse: updated.adminResponse,
        },
      });
    }

    return NextResponse.json(
      { error: 'Review not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Try to delete as homestay review first
    const homestayReview = await prisma.homestayReview.findUnique({
      where: { id: params.id },
    });

    if (homestayReview) {
      await prisma.homestayReview.delete({
        where: { id: params.id },
      });

      return NextResponse.json({
        success: true,
        message: 'Homestay review deleted successfully',
      });
    }

    // Try tour review
    const tourReview = await prisma.tourReview.findUnique({
      where: { id: params.id },
    });

    if (tourReview) {
      await prisma.tourReview.delete({
        where: { id: params.id },
      });

      return NextResponse.json({
        success: true,
        message: 'Tour review deleted successfully',
      });
    }

    return NextResponse.json(
      { error: 'Review not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
