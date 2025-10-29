import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'
import { bookingInclude, serializeBooking } from '@/lib/bookings/serializers'
import { BookingStatus } from '@prisma/client'

const paramsSchema = z.object({
  id: z.string(),
})

const updateSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  adminNotes: z.string().max(2000, 'Ghi chú quá dài').optional(),
})

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { id } = paramsSchema.parse(context.params)
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: bookingInclude,
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking không tồn tại' }, { status: 404 })
    }

    return NextResponse.json(serializeBooking(booking))
  } catch (error) {
    console.error('Failed to fetch booking:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Tham số không hợp lệ', details: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Không thể tải booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { id } = paramsSchema.parse(context.params)
    const payload = await request.json()
    const data = updateSchema.parse(payload)

    if (!data.status && data.adminNotes === undefined) {
      return NextResponse.json(
        { error: 'Không có dữ liệu để cập nhật' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: data.status ?? undefined,
        adminNotes:
          data.adminNotes !== undefined ? (data.adminNotes || null) : undefined,
      },
      include: bookingInclude,
    })

    return NextResponse.json(serializeBooking(booking))
  } catch (error) {
    console.error('Failed to update booking:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Không thể cập nhật booking' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { id } = paramsSchema.parse(context.params)
    
    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { id: true, reference: true, status: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking không tồn tại' }, { status: 404 })
    }

    // Delete booking and related records in transaction
    await prisma.$transaction([
      // Delete booking addons first
      prisma.bookingAddon.deleteMany({ where: { bookingId: id } }),
      // Delete payments
      prisma.payment.deleteMany({ where: { bookingId: id } }),
      // Delete booking
      prisma.booking.delete({ where: { id } }),
    ])

    console.log(`✅ Deleted booking ${booking.reference} (${id})`)
    
    return NextResponse.json({ 
      success: true,
      message: `Đã xóa booking ${booking.reference}`,
    })
  } catch (error) {
    console.error('Failed to delete booking:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Tham số không hợp lệ', details: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Không thể xóa booking' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
