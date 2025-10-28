import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'

export async function GET(request: NextRequest) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const [
      totalHomestays,
      publishedHomestays,
      draftHomestays,
      totalBookings,
      totalRevenue,
      averageRating,
      recentHomestays,
      topHomestays,
    ] = await Promise.all([
      // Total homestays
      prisma.homestay.count(),
      
      // Published homestays
      prisma.homestay.count({
        where: { status: 'PUBLISHED' },
      }),
      
      // Draft homestays
      prisma.homestay.count({
        where: { status: 'DRAFT' },
      }),
      
      // Total bookings
      prisma.homestayBooking.count(),
      
      // Total revenue
      prisma.homestayBooking.aggregate({
        where: {
          status: { in: ['CONFIRMED', 'COMPLETED'] },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      
      // Average rating
      prisma.homestay.aggregate({
        where: {
          ratingAverage: { not: null },
        },
        _avg: {
          ratingAverage: true,
        },
      }),
      
      // Recent homestays
      prisma.homestay.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          HomestayRoom: true,
          _count: {
            select: {
              HomestayBooking: true,
              HomestayReview: true,
            },
          },
        },
      }),
      
      // Top performing homestays
      prisma.homestay.findMany({
        take: 5,
        orderBy: { bookingCount: 'desc' },
        include: {
          HomestayRoom: true,
          _count: {
            select: {
              HomestayBooking: true,
              HomestayReview: true,
            },
          },
        },
      }),
    ])

    // Calculate additional metrics
    const occupancyRate = await calculateOccupancyRate()
    const revenueByMonth = await getRevenueByMonth()
    const bookingsByStatus = await getBookingsByStatus()

    const dashboard = {
      statistics: {
        totalHomestays,
        publishedHomestays,
        draftHomestays,
        totalBookings,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        averageRating: averageRating._avg.ratingAverage || 0,
        occupancyRate,
      },
      recentHomestays: recentHomestays.map(homestay => ({
        id: homestay.id,
        title: homestay.title,
        slug: homestay.slug,
        status: homestay.status,
        city: homestay.city,
        basePrice: homestay.basePrice,
        currency: homestay.currency,
        ratingAverage: homestay.ratingAverage,
        reviewCount: homestay.reviewCount,
        bookingCount: homestay.bookingCount,
        createdAt: homestay.createdAt,
        roomsCount: homestay.HomestayRoom.length,
        totalBookings: homestay._count.HomestayBooking,
        totalReviews: homestay._count.HomestayReview,
      })),
      topHomestays: topHomestays.map(homestay => ({
        id: homestay.id,
        title: homestay.title,
        slug: homestay.slug,
        status: homestay.status,
        city: homestay.city,
        basePrice: homestay.basePrice,
        currency: homestay.currency,
        ratingAverage: homestay.ratingAverage,
        reviewCount: homestay.reviewCount,
        bookingCount: homestay.bookingCount,
        isFeatured: homestay.isFeatured,
        isVerified: homestay.isVerified,
        roomsCount: homestay.HomestayRoom.length,
        totalBookings: homestay._count.HomestayBooking,
        totalReviews: homestay._count.HomestayReview,
      })),
      analytics: {
        revenueByMonth,
        bookingsByStatus,
      },
    }

    return NextResponse.json(dashboard)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function calculateOccupancyRate(): Promise<number> {
  // This is a simplified calculation
  // In a real implementation, you'd calculate based on actual availability
  const totalRooms = await prisma.homestayRoom.count()
  const bookedRooms = await prisma.homestayBooking.count({
    where: {
      status: { in: ['CONFIRMED', 'COMPLETED'] },
      checkIn: { lte: new Date() },
      checkOut: { gte: new Date() },
    },
  })

  return totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0
}

async function getRevenueByMonth() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const revenue = await prisma.homestayBooking.groupBy({
    by: ['checkIn'],
    where: {
      status: { in: ['CONFIRMED', 'COMPLETED'] },
      checkIn: { gte: sixMonthsAgo },
    },
    _sum: {
      totalAmount: true,
    },
  })

  // Group by month
  const monthlyRevenue = revenue.reduce((acc, item) => {
    const month = new Date(item.checkIn).toISOString().slice(0, 7) // YYYY-MM
    acc[month] = (acc[month] || 0) + Number(item._sum.totalAmount || 0)
    return acc
  }, {} as Record<string, number>)

  return monthlyRevenue
}

async function getBookingsByStatus() {
  const bookings = await prisma.homestayBooking.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  })

  return bookings.reduce((acc, item) => {
    acc[item.status] = item._count.status
    return acc
  }, {} as Record<string, number>)
}
