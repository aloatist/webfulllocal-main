import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'
import { serializeRoom } from '@/lib/homestays/serializers'
import { updateHomestayRoomSchema } from '@/lib/homestays/schemas'
import { ensureUniqueSlug, slugify, toOptionalDecimal } from '@/lib/tours/utils'
import { sanitizeMediaUrl } from '@/lib/homestays/utils'

const paramsSchema = z.object({
  homestayId: z.string(),
  roomId: z.string(),
})

export async function GET(
  _request: NextRequest,
  context: { params: { homestayId: string; roomId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId, roomId } = paramsSchema.parse(context.params)

    const room = await prisma.homestayRoom.findFirst({
      where: { id: roomId, homestayId },
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json(serializeRoom(room))
  } catch (error) {
    console.error('Failed to fetch homestay room:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.flatten() },
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
  context: { params: { homestayId: string; roomId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId, roomId } = paramsSchema.parse(context.params)
    const payload = await request.json()

    const data = updateHomestayRoomSchema.parse(payload)

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No update fields provided' },
        { status: 400 }
      )
    }

    const existingRoom = await prisma.homestayRoom.findFirst({
      where: { id: roomId, homestayId },
    })

    if (!existingRoom) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    let slug: string | undefined
    const slugShouldUpdate =
      Object.prototype.hasOwnProperty.call(payload, 'slug') ||
      Object.prototype.hasOwnProperty.call(payload, 'name')

    if (slugShouldUpdate) {
      const baseSlugSource =
        data.slug ??
        data.name ??
        existingRoom.slug ??
        `room-${roomId.slice(0, 6)}`
      const normalizedBase = slugify(baseSlugSource) || existingRoom.slug

      const siblingSlugs = await prisma.homestayRoom.findMany({
        where: {
          homestayId,
          id: { not: roomId },
        },
        select: { slug: true },
      })
      const slugSet = new Set(siblingSlugs.map((room) => room.slug))
      slug = ensureUniqueSlug(normalizedBase, slugSet)
    }

    const updatePayload: Prisma.HomestayRoomUpdateInput = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(slug ? { slug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'sizeSqm')
        ? { sizeSqm: toOptionalDecimal(data.sizeSqm) ?? null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'basePrice')
        ? { basePrice: toOptionalDecimal(data.basePrice) ?? null }
        : {}),
      ...(data.currency !== undefined ? { currency: data.currency } : {}),
      ...(data.maxGuests !== undefined ? { maxGuests: data.maxGuests } : {}),
      ...(data.bedTypes !== undefined ? { bedTypes: data.bedTypes ?? [] } : {}),
      ...(data.amenities !== undefined
        ? { amenities: data.amenities ?? [] }
        : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'heroImageUrl')
        ? { heroImageUrl: sanitizeMediaUrl(data.heroImageUrl) ?? null }
        : {}),
    }

    const room = await prisma.homestayRoom.update({
      where: { id: roomId },
      data: updatePayload,
    })

    return NextResponse.json(serializeRoom(room))
  } catch (error) {
    console.error('Failed to update homestay room:', error)
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
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { homestayId: string; roomId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId, roomId } = paramsSchema.parse(context.params)

    const existingRoom = await prisma.homestayRoom.findFirst({
      where: { id: roomId, homestayId },
      select: { id: true },
    })

    if (!existingRoom) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    try {
      await prisma.homestayRoom.delete({
        where: { id: roomId },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        return NextResponse.json(
          {
            error:
              'Cannot delete room because related bookings or availability records exist',
          },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete homestay room:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
