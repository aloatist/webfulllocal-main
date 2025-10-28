import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'

export async function GET() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role

  if (!role || !['ADMIN', 'EDITOR'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [total, pending, confirmed, completed, revenue] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      prisma.booking.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
        },
      }),
    ])

    return NextResponse.json({
      total,
      pending,
      confirmed,
      completed,
      revenue: Number(revenue._sum.totalAmount ?? 0),
    })
  } catch (error) {
    console.error('Failed to load booking stats:', error)
    return NextResponse.json(
      { error: 'Failed to load booking stats' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
