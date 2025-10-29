import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { Prisma, HomestayRoomStatus } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'
import {
  homestayInclude,
  serializeHomestay,
} from '@/lib/homestays/serializers'
import {
  homestayRoomSchema,
  updateHomestaySchema,
} from '@/lib/homestays/schemas'
import { sanitizeMediaUrl } from '@/lib/homestays/utils'
import { ensureUniqueSlug, slugify, toOptionalDecimal } from '@/lib/tours/utils'

const paramsSchema = z.object({
  homestayId: z.string(),
})

export async function GET(
  _request: NextRequest,
  context: { params: { homestayId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId } = paramsSchema.parse(context.params)

    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      include: homestayInclude,
    })

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    return NextResponse.json(serializeHomestay(homestay))
  } catch (error) {
    console.error('Failed to fetch homestay:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid homestay id', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { homestayId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId } = paramsSchema.parse(context.params)
    const payload = await request.json()
    const data = updateHomestaySchema.parse(payload)

    const existing = await prisma.homestay.findUnique({
      where: { id: homestayId },
      include: {
        HomestayRoom: true,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    let slug: string | undefined
    if (data.slug && data.slug.trim()) {
      // Only process slug if explicitly provided and not empty
      const baseSlug = slugify(data.slug.trim())
      
      // Only check for duplicate if slug is changing
      if (baseSlug !== existing.slug) {
        // Check if slug already exists
        const duplicate = await prisma.homestay.findFirst({
          where: { 
            slug: baseSlug,
            id: { not: homestayId } // Exclude current homestay
          },
          select: { id: true },
        })

        if (duplicate) {
          // Return error - don't auto-change slug to preserve SEO
          return NextResponse.json(
            { 
              error: 'Slug đã tồn tại. Vui lòng chọn slug khác để giữ đường dẫn SEO.',
              currentSlug: existing.slug,
              attemptedSlug: baseSlug,
            },
            { status: 409 }
          )
        }
        
        slug = baseSlug
      }
      // If slug is the same, slug stays undefined (no update)
    }
    // If no slug provided, slug stays undefined (no update)

    if (data.media) {
      const mediaIds = Array.from(
        new Set(data.media.map((item) => item.mediaId))
      )
      if (mediaIds.length > 0) {
        const existingMedia = await prisma.media.findMany({
          where: { id: { in: mediaIds } },
          select: { id: true },
        })
        const missingMedia = mediaIds.filter(
          (id) => !existingMedia.some((item) => item.id === id)
        )
        if (missingMedia.length > 0) {
          return NextResponse.json(
            {
              error: 'Some media could not be found',
              missingMedia,
            },
            { status: 400 }
          )
        }
      }
    }

    let roomOperations: Prisma.HomestayRoomUpdateManyWithoutHomestayNestedInput | null =
      null

    if (data.rooms) {
      const existingSlugMap = new Map(
        existing.HomestayRoom.map((room) => [room.id, room.slug] as const)
      )
      const slugSet = new Set(existing.HomestayRoom.map((room) => room.slug))

      const keepIds: string[] = []
      const roomUpserts: Prisma.HomestayRoomUpsertWithWhereUniqueWithoutHomestayInput[] =
        []
      const roomCreates: Prisma.HomestayRoomCreateWithoutHomestayInput[] = []

      data.rooms.forEach((roomInput) => {
        const parsedRoom = homestayRoomSchema.parse(roomInput)
        const baseSlug = slugify(parsedRoom.slug ?? parsedRoom.name) || 'room'

        if (parsedRoom.id) {
          keepIds.push(parsedRoom.id)
          const previousSlug = existingSlugMap.get(parsedRoom.id)
          if (previousSlug) {
            slugSet.delete(previousSlug)
          }
          const roomSlug = ensureUniqueSlug(baseSlug, slugSet)
          slugSet.add(roomSlug)

          const existingRoom = existing.HomestayRoom.find(
            (room) => room.id === parsedRoom.id
          )
          const resolvedStatus =
            parsedRoom.status ?? existingRoom?.status ?? HomestayRoomStatus.ACTIVE

          const roomPayload = {
            name: parsedRoom.name,
            slug: roomSlug,
            description: parsedRoom.description,
            sizeSqm:
              parsedRoom.sizeSqm !== undefined
                ? toOptionalDecimal(parsedRoom.sizeSqm)
                : undefined,
            basePrice:
              parsedRoom.basePrice !== undefined
                ? toOptionalDecimal(parsedRoom.basePrice)
                : undefined,
            currency: parsedRoom.currency ?? existing.currency,
            maxGuests: parsedRoom.maxGuests,
            bedTypes: parsedRoom.bedTypes ?? [],
            amenities: parsedRoom.amenities ?? [],
            status: resolvedStatus,
            heroImageUrl: sanitizeMediaUrl(parsedRoom.heroImageUrl),
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          roomUpserts.push({
            where: { id: parsedRoom.id },
            update: roomPayload,
            create: {
              id: nanoid(),
              ...roomPayload,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        } else {
          const roomSlug = ensureUniqueSlug(baseSlug, slugSet)
          slugSet.add(roomSlug)

          roomCreates.push({
            id: nanoid(),
            name: parsedRoom.name,
            slug: roomSlug,
            description: parsedRoom.description,
            sizeSqm:
              parsedRoom.sizeSqm !== undefined
                ? toOptionalDecimal(parsedRoom.sizeSqm)
                : undefined,
            basePrice:
              parsedRoom.basePrice !== undefined
                ? toOptionalDecimal(parsedRoom.basePrice)
                : undefined,
            currency: parsedRoom.currency ?? existing.currency,
            maxGuests: parsedRoom.maxGuests,
            bedTypes: parsedRoom.bedTypes ?? [],
            amenities: parsedRoom.amenities ?? [],
            status: parsedRoom.status ?? HomestayRoomStatus.ACTIVE,
            heroImageUrl: sanitizeMediaUrl(parsedRoom.heroImageUrl),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      })

      roomOperations = {
        deleteMany: {
          homestayId,
          ...(keepIds.length > 0
            ? { id: { notIn: keepIds } }
            : { }),
        },
        ...(roomUpserts.length > 0 ? { upsert: roomUpserts } : {}),
        ...(roomCreates.length > 0 ? { create: roomCreates } : {}),
      }
    }

    const updateData: Prisma.HomestayUpdateInput = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(slug ? { slug } : {}),
      ...(data.summary !== undefined ? { summary: data.summary } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.addressLine1 !== undefined
        ? { addressLine1: data.addressLine1 }
        : {}),
      ...(data.addressLine2 !== undefined
        ? { addressLine2: data.addressLine2 }
        : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.state !== undefined ? { state: data.state } : {}),
      ...(data.country !== undefined ? { country: data.country } : {}),
      ...(data.postalCode !== undefined ? { postalCode: data.postalCode } : {}),
      ...(data.latitude !== undefined
        ? { latitude: toOptionalDecimal(data.latitude) ?? null }
        : {}),
      ...(data.longitude !== undefined
        ? { longitude: toOptionalDecimal(data.longitude) ?? null }
        : {}),
      ...(data.basePrice !== undefined
        ? { basePrice: toOptionalDecimal(data.basePrice) ?? null }
        : {}),
      ...(data.currency !== undefined ? { currency: data.currency } : {}),
      ...(data.maxGuests !== undefined ? { maxGuests: data.maxGuests } : {}),
      ...(data.minNights !== undefined ? { minNights: data.minNights } : {}),
      ...(data.maxNights !== undefined ? { maxNights: data.maxNights } : {}),
      ...(data.checkInTime !== undefined
        ? { checkInTime: data.checkInTime }
        : {}),
      ...(data.checkOutTime !== undefined
        ? { checkOutTime: data.checkOutTime }
        : {}),
      ...(data.heroImageUrl !== undefined
        ? { heroImageUrl: sanitizeMediaUrl(data.heroImageUrl) }
        : {}),
      ...(data.galleryImageUrls !== undefined 
        ? { galleryImageUrls: data.galleryImageUrls } 
        : {}),
      ...(data.amenities !== undefined ? { amenities: data.amenities } : {}),
      ...(data.houseRules !== undefined ? { houseRules: data.houseRules } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
      ...(data.seoDescription !== undefined
        ? { seoDescription: data.seoDescription }
        : {}),
      ...(data.seoKeywords !== undefined
        ? { seoKeywords: data.seoKeywords }
        : {}),
      ...(data.structuredData !== undefined
        ? { structuredData: data.structuredData }
        : {}),
      ...(roomOperations
        ? {
            HomestayRoom: roomOperations,
          }
        : {}),
      ...(data.media
        ? {
            HomestayMedia: {
              deleteMany: { homestayId },
              create: data.media.map((item, index) => ({
                id: nanoid(),
                Media: { connect: { id: item.mediaId } },
                type: item.type ?? 'IMAGE',
                position: item.position ?? index,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
          }
        : {}),
    }

    const homestay = await prisma.homestay.update({
      where: { id: homestayId },
      data: updateData,
      include: homestayInclude,
    })

    // Process availability blocks AFTER homestay update succeeds
    console.log('🔍 API DEBUG - Received data:', {
      hasAvailabilityBlocks: !!data.availabilityBlocks,
      blockCount: data.availabilityBlocks?.length || 0,
      blocks: data.availabilityBlocks,
    });

    if (data.availabilityBlocks && data.availabilityBlocks.length > 0) {
      console.log('✅ Processing availability blocks...');
      
      // Get or create a default room for availability
      let targetRoomId = homestay.HomestayRoom[0]?.id;
      
      if (!targetRoomId) {
        console.log('⚠️ No room found, creating default room...');
        // Create a default room if none exists
        const defaultRoom = await prisma.homestayRoom.create({
          data: {
            id: nanoid(),
            homestayId,
            name: 'Phòng chính',
            slug: 'phong-chinh',
            status: HomestayRoomStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        targetRoomId = defaultRoom.id;
        console.log(`✅ Created default room: ${targetRoomId}`);
      } else {
        console.log(`✅ Using existing room: ${targetRoomId}`);
      }

      // Delete existing blocked dates for this homestay
      console.log('🗑️ Deleting existing blocked dates...');
      const deleted = await prisma.homestayAvailability.deleteMany({
        where: {
          homestayId,
          status: 'BLOCKED',
        },
      });
      console.log(`🗑️ Deleted ${deleted.count} existing blocked dates`);

      // Create new blocked dates from blocks
      const availabilityRecords: Prisma.HomestayAvailabilityCreateManyInput[] = []
      
      for (const block of data.availabilityBlocks) {
        const startDate = new Date(block.startDate)
        const endDate = new Date(block.endDate)
        console.log(`📅 Processing block: ${block.startDate} to ${block.endDate}`);
        
        // Generate a date for each day in the range
        const currentDate = new Date(startDate)
        while (currentDate <= endDate) {
          availabilityRecords.push({
            id: nanoid(),
            homestayId,
            roomId: targetRoomId,
            date: new Date(currentDate),
            totalUnits: 1,
            reservedUnits: 1,
            status: 'BLOCKED',
            source: block.notes || 'Manual block',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          
          currentDate.setDate(currentDate.getDate() + 1)
        }
      }

      console.log(`📊 Generated ${availabilityRecords.length} availability records`);

      if (availabilityRecords.length > 0) {
        console.log(`✅ Creating ${availabilityRecords.length} availability records...`);
        const result = await prisma.homestayAvailability.createMany({
          data: availabilityRecords,
          skipDuplicates: true,
        });
        console.log(`✅ Created ${result.count} availability records successfully!`);
      } else {
        console.log('⚠️ No availability records to create');
      }
    } else {
      console.log('⚠️ No availability blocks in data or length is 0');
    }

    return NextResponse.json(serializeHomestay(homestay))
  } catch (error) {
    console.error('Failed to update homestay:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', details: error.flatten() },
        { status: 400 }
      )
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Homestay not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { homestayId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId } = paramsSchema.parse(context.params)

    const exists = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: { id: true },
    })

    if (!exists) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.homestayMedia.deleteMany({ where: { homestayId } }),
      prisma.homestayRoom.deleteMany({ where: { homestayId } }),
      prisma.homestayBooking.deleteMany({ where: { homestayId } }),
      prisma.homestay.delete({ where: { id: homestayId } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete homestay:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid homestay id', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
