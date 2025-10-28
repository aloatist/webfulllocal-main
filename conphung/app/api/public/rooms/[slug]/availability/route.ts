import { NextResponse } from "next/server";
import { addDays, formatISO, startOfDay } from "date-fns";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AvailabilityStatus, HomestayStatus, HomestayRoomStatus } from "@prisma/client";


const querySchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  span: z.coerce.number().int().min(1).max(120).optional(),
});

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return startOfDay(date);
}

export async function GET(
  request: Request,
  context: { params: { slug: string } },
) {
  const { slug } = context.params;

  try {
    const url = new URL(request.url);
    const parsed = querySchema.parse(Object.fromEntries(url.searchParams));

    const room = await prisma.homestayRoom.findFirst({
      where: {
        slug,
        status: HomestayRoomStatus.ACTIVE,
        Homestay: { status: HomestayStatus.PUBLISHED },
      },
      include: {
        Homestay: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const today = startOfDay(new Date());
    const start = parseDate(parsed.start) ?? today;
    const end = parseDate(parsed.end) ?? addDays(start, parsed.span ?? 30);

    if (end < start) {
      return NextResponse.json(
        { error: "Parameter 'end' must be after 'start'" },
        { status: 400 },
      );
    }

    const records = await prisma.homestayAvailability.findMany({
      where: {
        roomId: room.id,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const days: Array<{
      date: string;
      status: AvailabilityStatus;
      totalUnits: number;
      reservedUnits: number;
      availableUnits: number;
    }> = [];

    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const recordMap = new Map<number, typeof records[number]>();
    for (const record of records) {
      recordMap.set(startOfDay(record.date).getTime(), record);
    }

    for (let i = 0; i < totalDays; i += 1) {
      const current = startOfDay(addDays(start, i));
      const key = current.getTime();
      const record = recordMap.get(key);

      if (record) {
        const available = Math.max(record.totalUnits - record.reservedUnits, 0);
        days.push({
          date: formatISO(current, { representation: "date" }),
          status: record.status,
          totalUnits: record.totalUnits,
          reservedUnits: record.reservedUnits,
          availableUnits: available,
        });
      } else {
        const defaultTotal = 1;
        days.push({
          date: formatISO(current, { representation: "date" }),
          status: AvailabilityStatus.OPEN,
          totalUnits: defaultTotal,
          reservedUnits: 0,
          availableUnits: defaultTotal,
        });
      }
    }

    return NextResponse.json({
      room: {
        id: room.id,
        slug: room.slug,
        name: room.name,
      },
      availability: days,
    });
  } catch (error) {
    console.error("Failed to fetch availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
