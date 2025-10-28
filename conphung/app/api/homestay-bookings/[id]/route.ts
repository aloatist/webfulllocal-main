import { NextRequest, NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";
import { z } from "zod";
import { startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/tours/permissions";

const paramsSchema = z.object({
  id: z.string(),
});

const updateSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  adminNotes: z.string().max(2000, "Ghi chú quá dài").optional(),
});

function serialize(booking: Awaited<ReturnType<typeof prisma.homestayBooking.findUnique>>) {
  if (!booking) return null;
  return {
    id: booking.id,
    reference: booking.reference,
    homestayId: booking.homestayId,
    roomId: booking.roomId,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    status: booking.status,
    adults: booking.adults,
    children: booking.children,
    channel: booking.channel,
    channelReference: booking.channelReference,
    specialRequests: booking.specialRequests,
    adminNotes: booking.adminNotes,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = paramsSchema.parse(context.params);
    const booking = await prisma.homestayBooking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking không tồn tại" }, { status: 404 });
    }

    return NextResponse.json(serialize(booking));
  } catch (error) {
    console.error("Failed to fetch homestay booking:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Tham số không hợp lệ", details: error.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Không thể tải booking" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = paramsSchema.parse(context.params);
    const payload = await request.json();
    const data = updateSchema.parse(payload);

    if (!data.status && data.adminNotes === undefined) {
      return NextResponse.json(
        { error: "Không có dữ liệu để cập nhật" },
        { status: 400 },
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.homestayBooking.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          roomId: true,
          homestayId: true,
          checkIn: true,
        },
      });

      if (!existing) {
        throw new Error("Booking không tồn tại");
      }

      const booking = await tx.homestayBooking.update({
        where: { id },
        data: {
          status: data.status ?? undefined,
          adminNotes:
            data.adminNotes !== undefined ? (data.adminNotes || null) : undefined,
        },
      });

      if (existing.roomId && existing.checkIn) {
        const arrival = startOfDay(existing.checkIn);

        if (existing.status !== BookingStatus.CANCELLED && booking.status === BookingStatus.CANCELLED) {
          await tx.homestayAvailability.updateMany({
            where: {
              roomId: existing.roomId,
              date: arrival,
            },
            data: {
              reservedUnits: {
                decrement: 1,
              },
            },
          });

          await tx.homestayAvailability.updateMany({
            where: {
              roomId: existing.roomId,
              date: arrival,
              reservedUnits: { lt: 0 },
            },
            data: { reservedUnits: 0 },
          });
        }

        if (existing.status === BookingStatus.CANCELLED && booking.status !== BookingStatus.CANCELLED) {
          const record = await tx.homestayAvailability.findUnique({
            where: {
              roomId_date: {
                roomId: existing.roomId,
                date: arrival,
              },
            },
          });

          if (record) {
            await tx.homestayAvailability.update({
              where: { id: record.id },
              data: {
                reservedUnits: Math.min(record.totalUnits, record.reservedUnits + 1),
              },
            });
          } else {
            await tx.homestayAvailability.create({
              data: {
                roomId: existing.roomId,
                homestayId: existing.homestayId,
                date: arrival,
                totalUnits: 1,
                reservedUnits: 1,
              },
            });
          }
        }
      }

      return booking;
    });

    return NextResponse.json(serialize(updated));
  } catch (error) {
    console.error("Failed to update homestay booking:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: error.flatten() },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message.includes("Booking không tồn tại")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: "Không thể cập nhật booking" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
