import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { z } from "zod";
import { AvailabilityStatus, HomestayRoomStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/tours/permissions";

const entrySchema = z.object({
  date: z.string().min(1, "Ngày không hợp lệ"),
  totalUnits: z.coerce.number().int().min(0).max(50).default(1),
  reservedUnits: z.coerce.number().int().min(0).max(50).default(0),
  status: z.nativeEnum(AvailabilityStatus).default(AvailabilityStatus.OPEN),
});

const payloadSchema = z.object({
  entries: z.array(entrySchema).min(1),
  overwrite: z.boolean().optional(),
});

export async function POST(
  request: Request,
  context: { params: { homestayId: string; roomId: string } },
) {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { homestayId, roomId } = context.params;

  try {
    const payload = payloadSchema.parse(await request.json());

    const room = await prisma.homestayRoom.findFirst({
      where: {
        id: roomId,
        homestayId,
        status: HomestayRoomStatus.ACTIVE,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const normalizedEntries = payload.entries.map((entry) => {
      const date = new Date(entry.date);
      if (Number.isNaN(date.getTime())) {
        throw new Error(`Ngày không hợp lệ: ${entry.date}`);
      }
      if (entry.reservedUnits > entry.totalUnits) {
        throw new Error("reservedUnits không được lớn hơn totalUnits");
      }
      return {
        date: startOfDay(date),
        totalUnits: entry.totalUnits,
        reservedUnits: entry.reservedUnits,
        status: entry.status,
      };
    });

    await prisma.$transaction(async (tx) => {
      if (payload.overwrite) {
        const earliest = normalizedEntries.reduce(
          (acc, curr) => (curr.date < acc ? curr.date : acc),
          normalizedEntries[0].date,
        );
        const latest = normalizedEntries.reduce(
          (acc, curr) => (curr.date > acc ? curr.date : acc),
          normalizedEntries[0].date,
        );

        await tx.homestayAvailability.deleteMany({
          where: {
            roomId,
            date: {
              gte: earliest,
              lte: latest,
            },
          },
        });
      }

      for (const entry of normalizedEntries) {
        const shouldRemove =
          entry.status === AvailabilityStatus.OPEN &&
          entry.totalUnits <= 1 &&
          entry.reservedUnits === 0;

        if (shouldRemove) {
          await tx.homestayAvailability.deleteMany({
            where: {
              roomId,
              date: entry.date,
            },
          });
          continue;
        }

        await tx.homestayAvailability.upsert({
          where: {
            roomId_date: {
              roomId,
              date: entry.date,
            },
          },
          update: {
            totalUnits: entry.totalUnits,
            reservedUnits: entry.reservedUnits,
            status: entry.status,
          },
          create: {
            roomId,
            homestayId,
            date: entry.date,
            totalUnits: entry.totalUnits,
            reservedUnits: entry.reservedUnits,
            status: entry.status,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update availability:", error);
    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message ?? "Payload không hợp lệ"
        : error instanceof Error
          ? error.message
          : "Không thể cập nhật số lượng phòng";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
