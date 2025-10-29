import { NextResponse } from "next/server";
import { Prisma, SyncDirection, SyncStatus, AvailabilityStatus } from "@prisma/client";
import { startOfDay } from "date-fns";
import { bookingRequestSchema } from "@/lib/cocoisland/booking-schema";
import { prisma } from "@/lib/prisma";
import {
  ensureIntegrationChannel,
  logChannelSyncEvent,
} from "@/lib/integrations/logger";
import { sendN8nEvent } from "@/lib/integrations/n8n-client";

export async function POST(
  request: Request,
  context: { params: { slug: string } },
) {
  const { slug } = context.params;

  try {
    const raw = await request.json();
    const data = bookingRequestSchema.parse({
      ...raw,
      roomSlug: slug,
    });

    const room = await prisma.homestayRoom.findFirst({
      where: { slug: data.roomSlug },
      include: {
        Homestay: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 },
      );
    }

    const checkIn = data.checkIn ? new Date(data.checkIn) : null;
    const checkOut = data.checkOut ? new Date(data.checkOut) : null;

    if (checkIn && Number.isNaN(checkIn.getTime())) {
      return NextResponse.json(
        { error: "Ngày nhận phòng không hợp lệ" },
        { status: 400 },
      );
    }
    if (checkOut && Number.isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { error: "Ngày trả phòng không hợp lệ" },
        { status: 400 },
      );
    }

    // Check for blocked dates before creating booking
    if (checkIn && checkOut) {
      const blockedDates = await prisma.homestayAvailability.count({
        where: {
          homestayId: room.homestayId,
          roomId: room.id,
          status: 'BLOCKED',
          date: {
            gte: checkIn,
            lt: checkOut,
          },
        },
      });

      if (blockedDates > 0) {
        return NextResponse.json(
          { error: 'Một số ngày trong khoảng thời gian này đã bị chặn. Vui lòng chọn ngày khác.' },
          { status: 400 }
        );
      }
    }

    const bookingReference = `HS-${Date.now()}`;

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.homestayBooking.create({
        data: {
          reference: bookingReference,
          Homestay: {
            connect: { id: room.homestayId },
          },
          HomestayRoom: {
            connect: { id: room.id },
          },
          checkIn: checkIn ?? new Date(),
          checkOut: checkOut ?? new Date(),
          adults: data.adults,
          children: data.children,
          specialRequests: data.specialRequests,
          adminNotes: `Yêu cầu từ cocoisland.vn – khách: ${data.fullName}`,
          channel: "cocoisland.vn",
          channelReference: data.phone,
          totalAmount: new Prisma.Decimal(0),
        },
      });

      if (checkIn) {
        const arrival = startOfDay(checkIn);
        const availability = await tx.homestayAvailability.findUnique({
          where: {
            roomId_date: {
              roomId: room.id,
              date: arrival,
            },
          },
        });

        if (availability) {
          await tx.homestayAvailability.update({
            where: { id: availability.id },
            data: {
              reservedUnits: Math.min(
                availability.totalUnits,
                availability.reservedUnits + 1,
              ),
            },
          });
        } else {
          await tx.homestayAvailability.create({
            data: {
              roomId: room.id,
              homestayId: room.homestayId,
              date: arrival,
              totalUnits: 1,
              reservedUnits: 1,
              status: AvailabilityStatus.OPEN,
            },
          });
        }
      }

      return created;
    });

    const channel = await ensureIntegrationChannel({
      name: "cocoisland",
      provider: "website",
      status: "ACTIVE",
      endpoint: "public-booking-form",
    });

    await logChannelSyncEvent({
      channelId: channel.id,
      direction: SyncDirection.INBOUND,
      operation: "homestay-booking-request",
      status: SyncStatus.SUCCESS,
      message: `Booking ${booking.reference} từ ${data.fullName}`,
      payload: {
        bookingId: booking.id,
        reference: booking.reference,
        payload: data,
      },
      markSynced: true,
    });

    // Attempt to notify n8n asynchronously (fire and forget)
    sendN8nEvent("homestay-booking-request", {
      bookingId: booking.id,
      reference: booking.reference,
      roomSlug: room.slug,
      homestayId: room.homestayId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adults: booking.adults,
      children: booking.children,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      note: data.specialRequests,
    }).catch((error) => {
      console.warn("n8n webhook failed:", error);
    });

    return NextResponse.json({
      success: true,
      bookingReference: booking.reference,
    });
  } catch (error) {
    console.error("Failed to create homestay booking request:", error);
    return NextResponse.json(
      {
        error: "Không thể tiếp nhận yêu cầu đặt phòng. Vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }
}
