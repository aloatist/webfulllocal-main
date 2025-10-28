import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'
import { bookingInclude, serializeBooking } from '@/lib/bookings/serializers'
import { BookingStatus, Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  tourId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export async function GET(request: NextRequest) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries())
    const parsed = querySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Tham số truy vấn không hợp lệ' },
        { status: 400 }
      )
    }

    const { page, limit, search, status, tourId, startDate, endDate } = parsed.data

    const where: Prisma.BookingWhereInput = {}

    if (status) {
      where.status = status
    }

    if (tourId) {
      where.tourId = tourId
    }

    if (search) {
      where.OR = [
        { reference: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          Customer: {
            OR: [
              { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          },
        },
        {
          Tour: {
            title: { contains: search, mode: Prisma.QueryMode.insensitive },
          },
        },
      ]
    }

    if (startDate || endDate) {
      where.TourDeparture = {
        AND: [
          startDate
            ? {
                startDate: {
                  gte: startDate,
                },
              }
            : {},
          endDate
            ? {
                startDate: {
                  lte: endDate,
                },
              }
            : {},
        ],
      }
    }

    const skip = (page - 1) * limit

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: bookingInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    return NextResponse.json({
      data: bookings.map(serializeBooking),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh sách booking' },
      { status: 500 }
    )
  }
}
