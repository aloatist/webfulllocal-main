import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!role || !['ADMIN', 'EDITOR'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const last30Days = subDays(now, 30);
    const last60Days = subDays(now, 60);

    // Basic counts
    const [posts, categories, tags, media, totalBookings, tours, totalCustomers] = await Promise.all([
      prisma.post.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.media.count(),
      prisma.booking.count(),
      prisma.tour.count(),
      prisma.user.count({ where: { role: 'USER' } }),
    ]);

    // Revenue calculation (mock data for now - replace with actual booking revenue)
    const totalRevenue = totalBookings * 1500000; // Mock: 1.5M VND per booking
    const previousRevenue = totalBookings * 1200000; // Mock previous period
    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Bookings change
    const recentBookings = await prisma.booking.count({
      where: { createdAt: { gte: last30Days } }
    });
    const previousBookings = await prisma.booking.count({
      where: { 
        createdAt: { 
          gte: last60Days,
          lt: last30Days
        } 
      }
    });
    const bookingsChange = previousBookings > 0
      ? ((recentBookings - previousBookings) / previousBookings) * 100
      : 0;

    // Customer change (mock)
    const customersChange = 15.5; // Mock data

    // Average rating (mock)
    const avgRating = 4.7;

    // Generate revenue data for last 7 days
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const dayBookings = Math.floor(Math.random() * 10) + 5; // Mock data
      revenueData.push({
        date: format(date, 'dd/MM'),
        tours: dayBookings * 800000,
        homestays: dayBookings * 700000,
        total: dayBookings * 1500000,
      });
    }

    // Generate booking data for last 7 days
    const bookingData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      bookingData.push({
        date: format(date, 'dd/MM'),
        confirmed: Math.floor(Math.random() * 8) + 3,
        pending: Math.floor(Math.random() * 5) + 1,
        cancelled: Math.floor(Math.random() * 2),
      });
    }

    return NextResponse.json({
      posts,
      categories,
      tags,
      media,
      totalBookings,
      tours,
      totalRevenue,
      totalCustomers,
      avgRating,
      revenueChange,
      bookingsChange,
      customersChange,
      revenueData,
      bookingData,
    });
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard stats' },
      { status: 500 },
    );
  }
}
