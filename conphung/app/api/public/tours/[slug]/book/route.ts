import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BookingStatus, TourStatus, Prisma } from '@prisma/client'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { sendBookingConfirmationEmail } from '@/lib/bookings/notifications'

const bookingSchema = z.object({
  customer: z.object({
    fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().min(6, 'Số điện thoại không hợp lệ').optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    notes: z.string().optional(),
  }),
  departureId: z.string().min(1, 'Vui lòng chọn lịch khởi hành'),
  adults: z.number().int().min(1, 'Ít nhất 1 người lớn'),
  children: z.number().int().min(0).default(0),
  infants: z.number().int().min(0).default(0),
  addonIds: z.array(z.string().min(1)).optional(),
  specialRequests: z.string().optional(),
})

class BookingError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

function generateReferenceCode() {
  const timePart = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CP${timePart}${randomPart}`
}

export async function POST(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const payload = bookingSchema.parse(body)
    const slug = context.params.slug

    const result = await prisma.$transaction(async (tx) => {
      const tour = await tx.tour.findFirst({
        where: {
          slug,
          status: TourStatus.PUBLISHED,
        },
        include: {
          TourDeparture: true,
          TourAddon: true,
        },
      })

      if (!tour) {
        throw new BookingError('Tour không tồn tại hoặc đã ngừng kinh doanh', 404)
      }

      const totalGuests = payload.adults + payload.children + payload.infants
      if (totalGuests <= 0) {
        throw new BookingError('Vui lòng chọn số lượng khách hợp lệ')
      }

      const departure = tour.TourDeparture.find(
        (item) => item.id === payload.departureId
      )

      if (!departure) {
        throw new BookingError('Lịch khởi hành không hợp lệ', 404)
      }

      const seatsAvailable =
        departure.seatsAvailable ?? departure.seatsTotal ?? 0

      if (seatsAvailable < totalGuests) {
        throw new BookingError(
          `Lịch khởi hành chỉ còn ${seatsAvailable} chỗ trống`,
          409
        )
      }

      const baseAdult =
        Number(departure.priceAdult ?? tour.basePrice ?? 0) || 0
      const baseChild =
        Number(departure.priceChild ?? baseAdult) || baseAdult
      const baseInfant =
        Number(departure.priceInfant ?? baseChild * 0.3) || 0

      let addonsTotal = 0
      const selectedAddons: { id: string }[] = []

      if (payload.addonIds && payload.addonIds.length > 0) {
        const addonMap = new Map(
          tour.TourAddon.map((addon) => [addon.id, addon])
        )

        payload.addonIds.forEach((addonId) => {
          const addon = addonMap.get(addonId)
          if (addon) {
            const addonPrice = Number(addon.price ?? 0)
            const multiplier = addon.perPerson ? totalGuests : 1
            addonsTotal += addonPrice * multiplier
            selectedAddons.push({ id: addon.id })
          }
        })
      }

      const subtotal =
        baseAdult * payload.adults +
        baseChild * payload.children +
        baseInfant * payload.infants +
        addonsTotal

      const customerEmail = payload.customer.email.trim().toLowerCase()
      const customer = await tx.customer.upsert({
        where: { email: customerEmail },
        update: {
          fullName: payload.customer.fullName,
          phone: payload.customer.phone,
          country: payload.customer.country,
          city: payload.customer.city,
          notes: payload.customer.notes,
          updatedAt: new Date(),
        },
        create: {
          id: nanoid(),
          fullName: payload.customer.fullName,
          email: customerEmail,
          phone: payload.customer.phone,
          country: payload.customer.country,
          city: payload.customer.city,
          notes: payload.customer.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      const booking = await tx.booking.create({
        data: {
          id: nanoid(),
          reference: generateReferenceCode(),
          tourId: tour.id,
          departureId: departure.id,
          customerId: customer.id,
          adults: payload.adults,
          children: payload.children,
          infants: payload.infants,
          totalAmount: new Prisma.Decimal(subtotal),
          currency: tour.currency ?? 'VND',
          status: BookingStatus.PENDING,
          specialRequests: payload.specialRequests,
          createdAt: new Date(),
          updatedAt: new Date(),
          BookingAddon:
            selectedAddons.length > 0
              ? {
                  create: selectedAddons.map((addon) => ({
                    id: nanoid(),
                    addonId: addon.id,
                    quantity: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })),
                }
              : undefined,
        },
        include: {
          BookingAddon: {
            include: {
              TourAddon: true,
            },
          },
          Customer: true,
          Tour: {
            select: {
              title: true,
              slug: true,
            },
          },
          TourDeparture: true,
        },
      })

      await tx.tourDeparture.update({
        where: { id: departure.id },
        data: {
          seatsAvailable: seatsAvailable - totalGuests,
        },
      })

      return {
        bookingId: booking.id,
        reference: booking.reference,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        status: booking.status,
        tour: booking.Tour,
        departure: booking.TourDeparture,
        customer: {
          fullName: booking.Customer.fullName,
          email: booking.Customer.email,
          phone: booking.Customer.phone,
        },
      }
    })

    await sendBookingConfirmationEmail(result).catch((notificationError) => {
      console.error('Failed to queue confirmation email', notificationError)
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    if (error instanceof BookingError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Không thể tạo booking. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
