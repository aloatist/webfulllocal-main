import { NextResponse } from "next/server";
import { HomestayStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const paramsSchema = z.object({
  slug: z.string().min(1),
});

export const dynamic = "force-static";

export async function GET(
  _request: Request,
  context: { params: { slug: string } },
) {
  try {
    const { slug } = paramsSchema.parse(context.params);

    const room = await prisma.homestayRoom.findFirst({
      where: {
        slug,
        Homestay: {
          status: HomestayStatus.PUBLISHED,
        },
      },
      include: {
        Homestay: {
          include: {
            HomestayMedia: {
              orderBy: { position: "asc" },
              include: { Media: true },
            },
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({
      room: {
        id: room.id,
        slug: room.slug,
        name: room.name,
        description: room.description,
        amenities: room.amenities,
        sizeSqm: room.sizeSqm?.toString(),
        basePrice: room.basePrice?.toString(),
        currency: room.currency,
        maxGuests: room.maxGuests,
        bedTypes: room.bedTypes,
        heroImageUrl: room.heroImageUrl,
        status: room.status,
      },
      homestay: {
        id: room.Homestay.id,
        title: room.Homestay.title,
        slug: room.Homestay.slug,
        summary: room.Homestay.summary,
        description: room.Homestay.description,
        heroImageUrl: room.Homestay.heroImageUrl,
        media: room.Homestay.HomestayMedia.map((item) => ({
          id: item.id,
          type: item.type,
          position: item.position,
          url: item.Media.url,
          alt: item.Media.alt,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch room detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
