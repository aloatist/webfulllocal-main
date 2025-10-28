import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'
import { serializeRoom } from '@/lib/homestays/serializers'
import {
  createHomestayRoomSchema,
  listHomestayRoomsQuerySchema,
} from '@/lib/homestays/schemas'
import { ensureUniqueSlug, slugify, toOptionalDecimal } from '@/lib/tours/utils'
import { sanitizeMediaUrl } from '@/lib/homestays/utils'

export const dynamic = 'force-dynamic';

const paramsSchema = z.object({
  homestayId: z.string(),
})

export async function GET(
  request: NextRequest,
  context: { params: { homestayId: string } }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { homestayId } = paramsSchema.parse(context.params)

    const parsedQuery = listHomestayRoomsQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    )

    const { page, limit, search, status } = parsedQuery
    const skip = (page - 1) * limit

    const where: Prisma.HomestayRoomWhereInput = { homestayId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          description: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ]
    }

    if (status) {
      where.status = status
    }

    const homestayExists = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: { id: true },
    })

    if (!homestayExists) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    const [total, rooms] = await Promise.all([
      prisma.homestayRoom.count({ where }),
      prisma.homestayRoom.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
    ])

    return NextResponse.json({
      data: rooms.map((room) => serializeRoom(room)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch homestay rooms:', error)
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

export async function POST(
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
    const data = createHomestayRoomSchema.parse(payload)

    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: { id: true, currency: true },
    })

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    const baseSlugSource = data.slug ?? data.name
    const normalizedBase = slugify(baseSlugSource) || 'room'
    const existingSlugs = await prisma.homestayRoom.findMany({
      where: { homestayId },
      select: { slug: true },
    })
    const slugSet = new Set(existingSlugs.map((room) => room.slug))
    const slug = ensureUniqueSlug(normalizedBase, slugSet)

    const room = await prisma.homestayRoom.create({
      data: {
        homestayId,
        name: data.name,
        slug,
        description: data.description,
        sizeSqm:
          data.sizeSqm !== undefined
            ? toOptionalDecimal(data.sizeSqm)
            : undefined,
        basePrice:
          data.basePrice !== undefined
            ? toOptionalDecimal(data.basePrice)
            : undefined,
        currency: data.currency ?? homestay.currency ?? 'VND',
        maxGuests: data.maxGuests,
        bedTypes: data.bedTypes ?? [],
        amenities: data.amenities ?? [],
        ...(data.status ? { status: data.status } : {}),
        heroImageUrl: sanitizeMediaUrl(data.heroImageUrl),
      },
    })

    return NextResponse.json(serializeRoom(room), { status: 201 })
  } catch (error) {
    console.error('Failed to create homestay room:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', details: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
