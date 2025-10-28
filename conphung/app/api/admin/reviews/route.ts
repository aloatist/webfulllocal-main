import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user?.role || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    // Mock data - replace with actual database queries
    const mockReviews = [
      {
        id: '1',
        rating: 5,
        comment: 'Dịch vụ tuyệt vời! Homestay rất đẹp và sạch sẽ.',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        user: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
        },
        booking: {
          homestay: {
            title: 'Villa Đà Lạt View Đẹp',
          },
        },
      },
      {
        id: '2',
        rating: 4,
        comment: 'Tour rất hay, hướng dẫn viên nhiệt tình.',
        status: 'APPROVED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        user: {
          name: 'Trần Thị B',
          email: 'tranthib@example.com',
        },
        booking: {
          tour: {
            title: 'Tour Hà Nội - Hạ Long 3N2Đ',
          },
        },
        adminResponse: 'Cảm ơn bạn đã đánh giá! Chúng tôi rất vui khi bạn hài lòng.',
      },
      {
        id: '3',
        rating: 3,
        comment: 'Tạm được, nhưng giá hơi cao.',
        status: 'APPROVED',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        user: {
          name: 'Lê Văn C',
          email: 'levanc@example.com',
        },
        booking: {
          homestay: {
            title: 'Căn hộ Vũng Tàu gần biển',
          },
        },
      },
      {
        id: '4',
        rating: 2,
        comment: 'Không như mô tả, thất vọng.',
        status: 'REJECTED',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        user: {
          name: 'Phạm Thị D',
          email: 'phamthid@example.com',
        },
        booking: {
          tour: {
            title: 'Tour Phú Quốc 4N3Đ',
          },
        },
      },
    ];

    let filteredReviews = mockReviews;
    if (status && status !== 'all') {
      filteredReviews = mockReviews.filter((r) => r.status === status);
    }

    return NextResponse.json({
      reviews: filteredReviews,
      total: filteredReviews.length,
    });
  } catch (error) {
    console.error('Error loading reviews:', error);
    return NextResponse.json(
      { error: 'Failed to load reviews' },
      { status: 500 }
    );
  }
}
