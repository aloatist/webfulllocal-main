import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bookingSchema = z.object({
  roomId: z.string().optional().nullable(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1),
  children: z.number().int().min(0),
  infants: z.number().int().min(0),
  totalAmount: z.number().positive(),
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    // Find homestay
    const homestay = await prisma.homestay.findUnique({
      where: { 
        slug: params.slug,
        status: 'PUBLISHED',
      },
      include: {
        HomestayRoom: true,
      },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: 'Homestay không tồn tại' },
        { status: 404 }
      );
    }

    // Validate dates
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return NextResponse.json(
        { error: 'Ngày check-in phải từ hôm nay trở đi' },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: 'Ngày check-out phải sau ngày check-in' },
        { status: 400 }
      );
    }

    // Calculate nights
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Validate minimum nights
    if (homestay.minNights && nights < homestay.minNights) {
      return NextResponse.json(
        { error: `Số đêm tối thiểu là ${homestay.minNights}` },
        { status: 400 }
      );
    }

    // Validate maximum nights
    if (homestay.maxNights && nights > homestay.maxNights) {
      return NextResponse.json(
        { error: `Số đêm tối đa là ${homestay.maxNights}` },
        { status: 400 }
      );
    }

    // Validate guests
    const totalGuests = data.adults + data.children;
    if (homestay.maxGuests && totalGuests > homestay.maxGuests) {
      return NextResponse.json(
        { error: `Số khách tối đa là ${homestay.maxGuests}` },
        { status: 400 }
      );
    }

    // Validate room if specified
    let room = null;
    if (data.roomId) {
      room = homestay.HomestayRoom.find((r: any) => r.id === data.roomId && r.status === 'ACTIVE');
      if (!room) {
        return NextResponse.json(
          { error: 'Phòng không khả dụng' },
          { status: 400 }
        );
      }

      if (room.maxGuests && totalGuests > room.maxGuests) {
        return NextResponse.json(
          { error: `Phòng này chỉ phù hợp cho tối đa ${room.maxGuests} khách` },
          { status: 400 }
        );
      }
    }

    // Check availability (simplified - you may want more complex logic)
    const existingBookings = await prisma.homestayBooking.count({
      where: {
        homestayId: homestay.id,
        ...(data.roomId && { roomId: data.roomId }),
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            checkIn: {
              lte: checkOutDate,
            },
            checkOut: {
              gte: checkInDate,
            },
          },
        ],
      },
    });

    if (existingBookings > 0) {
      return NextResponse.json(
        { error: 'Homestay/phòng đã được đặt trong khoảng thời gian này' },
        { status: 400 }
      );
    }

    // Create or find customer
    let customer;
    if (data.customerEmail) {
      customer = await prisma.customer.upsert({
        where: { email: data.customerEmail },
        update: {
          fullName: data.customerName || 'Guest',
          phone: data.customerPhone,
        },
        create: {
          id: nanoid(),
          fullName: data.customerName || 'Guest',
          email: data.customerEmail,
          phone: data.customerPhone,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else {
      // Create guest customer
      customer = await prisma.customer.create({
        data: {
          id: nanoid(),
          fullName: data.customerName || 'Guest',
          email: `guest-${Date.now()}@conphungtourist.com`,
          phone: data.customerPhone,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Generate reference
    const reference = `HS${Date.now().toString().slice(-8)}`;

    // Create booking
    const booking = await prisma.homestayBooking.create({
      data: {
        id: nanoid(),
        reference,
        homestayId: homestay.id,
        roomId: data.roomId || null,
        customerId: customer.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: data.adults,
        children: data.children,
        infants: data.infants,
        totalAmount: data.totalAmount,
        currency: homestay.currency,
        status: 'PENDING',
        specialRequests: data.specialRequests,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        Homestay: {
          select: {
            title: true,
            slug: true,
          },
        },
        Customer: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Send notification via n8n (if configured)
    if (process.env.N8N_HOMESTAY_BOOKING_WEBHOOK_URL && booking.Customer) {
      try {
        await fetch(process.env.N8N_HOMESTAY_BOOKING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: booking.reference,
            homestayTitle: booking.Homestay.title,
            homestaySlug: booking.Homestay.slug,
            customerName: booking.Customer.fullName,
            customerEmail: booking.Customer.email,
            customerPhone: booking.Customer.phone,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            nights,
            adults: data.adults,
            children: data.children,
            infants: data.infants,
            totalAmount: data.totalAmount,
            currency: homestay.currency,
            bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/homestay-bookings/${booking.id}`,
          }),
        });
      } catch (error) {
        console.error('Failed to send n8n notification:', error);
        // Don't fail the booking if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      reference: booking.reference,
      bookingId: booking.id,
      message: 'Đặt phòng thành công',
    });
  } catch (error) {
    console.error('Booking error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
