import { NextRequest, NextResponse } from 'next/server'
import { Prisma, HomestayRoomStatus, HomestayStatus } from '@prisma/client'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'
import {
  createHomestaySchema,
  listHomestayQuerySchema,
} from '@/lib/homestays/schemas'
import {
  homestayInclude,
  serializeHomestay,
} from '@/lib/homestays/serializers'
import { sanitizeMediaUrl } from '@/lib/homestays/utils'
import { ensureUniqueSlug, slugify, toOptionalDecimal } from '@/lib/tours/utils'

export const dynamic = 'force-dynamic';

async function generateUniqueSlug(baseTitle: string) {
  const normalized = slugify(baseTitle)
  if (!normalized) {
    throw new Error('Unable to generate slug')
  }

  let slug = normalized
  let counter = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.homestay.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing) {
      return slug
    }

    slug = `${normalized}-${counter}`
    counter += 1
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const parsed = listHomestayQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    )

    const { 
      page, 
      limit, 
      search, 
      status, 
      type,
      category,
      city, 
      country,
      minPrice,
      maxPrice,
      minGuests,
      bedrooms,
      bathrooms,
      hasWifi,
      hasKitchen,
      hasPool,
      hasParking,
      isFeatured,
      isVerified,
      isInstantBook,
      minRating,
      sortBy,
      sortOrder
    } = parsed

    const where: Prisma.HomestayWhereInput = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { summary: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { city: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { subtitle: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ]
    }

    if (status) where.status = status
    if (type) where.type = type
    if (category) where.category = category
    if (isFeatured !== undefined) where.isFeatured = isFeatured
    if (isVerified !== undefined) where.isVerified = isVerified
    if (isInstantBook !== undefined) where.isInstantBook = isInstantBook

    if (city) {
      where.city = {
        contains: city,
        mode: Prisma.QueryMode.insensitive,
      }
    }

    if (country) {
      where.country = {
        contains: country,
        mode: Prisma.QueryMode.insensitive,
      }
    }

    if (minPrice || maxPrice) {
      where.basePrice = {}
      if (minPrice) where.basePrice.gte = minPrice
      if (maxPrice) where.basePrice.lte = maxPrice
    }

    if (minGuests) where.maxGuests = { gte: minGuests }
    if (bedrooms) where.bedrooms = { gte: bedrooms }
    if (bathrooms) where.bathrooms = { gte: bathrooms }
    if (hasWifi !== undefined) where.hasWifi = hasWifi
    if (hasKitchen !== undefined) where.hasKitchen = hasKitchen
    if (hasPool !== undefined) where.hasPool = hasPool
    if (hasParking !== undefined) where.hasParking = hasParking

    if (minRating) {
      where.ratingAverage = { gte: minRating }
    }

    const skip = (page - 1) * limit

    const [total, homestays] = await Promise.all([
      prisma.homestay.count({ where }),
      prisma.homestay.findMany({
        where,
        include: homestayInclude,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ])

    return NextResponse.json({
      data: homestays.map((homestay) => serializeHomestay(homestay)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch homestays:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const payload = await request.json()
    const data = createHomestaySchema.parse(payload)

    const slug = data.slug
      ? slugify(data.slug)
      : await generateUniqueSlug(data.title)

    const existingSlug = await prisma.homestay.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug already exists. Please choose another one.' },
        { status: 409 }
      )
    }

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

    const roomSlugSet = new Set<string>()
    const roomCreates =
      data.rooms?.map((room) => {
        const baseSlug = slugify(room.slug ?? room.name)
        const roomSlug = ensureUniqueSlug(baseSlug, roomSlugSet)

        return {
          id: nanoid(),
          name: room.name,
          slug: roomSlug,
          description: room.description,
          sizeSqm:
            room.sizeSqm !== undefined
              ? toOptionalDecimal(room.sizeSqm)
              : undefined,
          basePrice:
            room.basePrice !== undefined
              ? toOptionalDecimal(room.basePrice)
              : undefined,
          currency: room.currency ?? data.currency ?? 'VND',
          maxGuests: room.maxGuests,
          bedTypes: room.bedTypes ?? [],
          amenities: room.amenities ?? [],
          status: room.status ?? HomestayRoomStatus.ACTIVE,
          heroImageUrl: sanitizeMediaUrl(room.heroImageUrl),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }) ?? []

    const homestay = await prisma.homestay.create({
      data: {
        id: nanoid(),
        title: data.title,
        slug,
        summary: data.summary,
        description: data.description,
        status: data.status ?? HomestayStatus.DRAFT,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        latitude:
          data.latitude !== undefined
            ? toOptionalDecimal(data.latitude)
            : undefined,
        longitude:
          data.longitude !== undefined
            ? toOptionalDecimal(data.longitude)
            : undefined,
        basePrice:
          data.basePrice !== undefined
            ? toOptionalDecimal(data.basePrice)
            : undefined,
        currency: data.currency ?? 'VND',
        maxGuests: data.maxGuests,
        minNights: data.minNights,
        maxNights: data.maxNights,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        heroImageUrl: sanitizeMediaUrl(data.heroImageUrl),
        amenities: data.amenities ?? [],
        houseRules: data.houseRules ?? [],
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords ?? [],
        structuredData: data.structuredData ?? undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        HomestayRoom:
          roomCreates.length > 0
            ? {
                create: roomCreates,
              }
            : undefined,
        HomestayMedia: data.media
          ? {
              create: data.media.map((item, index) => ({
                id: nanoid(),
                Media: {
                  connect: { id: item.mediaId },
                },
                type: item.type ?? 'IMAGE',
                position: item.position ?? index,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            }
          : undefined,
      },
      include: homestayInclude,
    })

    return NextResponse.json(serializeHomestay(homestay), { status: 201 })
  } catch (error) {
    console.error('Failed to create homestay:', error)
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
