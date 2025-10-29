import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TourDifficulty,
  TourStatus,
  Prisma,
} from '@prisma/client'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { createTourSchema } from '@/lib/tours/schemas'
import { slugify, toDecimal, toOptionalDecimal } from '@/lib/tours/utils'
import { requireEditor } from '@/lib/tours/permissions'

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.nativeEnum(TourStatus).optional(),
  difficulty: z.nativeEnum(TourDifficulty).optional(),
  isFeatured: z
    .union([z.string(), z.boolean()])
    .transform((value) => {
      if (typeof value === 'boolean') return value
      if (value === undefined) return undefined
      return value === 'true'
    })
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

const tourInclude = {
  ItineraryDay: {
    orderBy: { dayNumber: 'asc' as const },
  },
  TourDeparture: {
    orderBy: { startDate: 'asc' as const },
  },
  TourAddon: {
    orderBy: { price: 'asc' as const },
  },
  Category: true,
  Promotion: true,
  TourMedia: {
    orderBy: { position: 'asc' as const },
    include: {
      Media: true,
    },
  },
  TourReview: {
    orderBy: { createdAt: 'desc' as const },
  },
} satisfies Prisma.TourInclude

async function generateUniqueSlug(base: string) {
  const normalized = slugify(base)
  if (!normalized) {
    throw new Error('Unable to generate slug')
  }

  let slug = normalized
  let increment = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.tour.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing) {
      return slug
    }

    slug = `${normalized}-${increment}`
    increment += 1
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const parsed = listQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    )

    const { page, limit, search, status, difficulty, isFeatured, startDate, endDate } =
      parsed

    const where: Prisma.TourWhereInput = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { summary: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          highlights: {
            hasSome: search.split(' ').filter(Boolean),
          },
        },
      ]
    }

    if (status) {
      where.status = status
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (typeof isFeatured === 'boolean') {
        where.isFeatured = isFeatured
    }

    if (startDate || endDate) {
      where.TourDeparture = {
        some: {
          ...(startDate
            ? {
                startDate: {
                  gte: startDate,
                },
              }
            : {}),
          ...(endDate
            ? {
                startDate: {
                  lte: endDate,
                },
              }
            : {}),
        },
      }
    }

    const skip = (page - 1) * limit

    const [total, tours] = await Promise.all([
      prisma.tour.count({ where }),
      prisma.tour.findMany({
        where,
        include: tourInclude,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ])

    // Transform Prisma field names to match frontend expectations
    const transformedTours = tours.map(tour => ({
      ...tour,
      itineraryDays: tour.ItineraryDay,
      departures: tour.TourDeparture,
      addons: tour.TourAddon,
      categories: tour.Category,
      promotions: tour.Promotion,
      mediaItems: tour.TourMedia?.map(item => ({
        ...item,
        media: item.Media,
        Media: undefined,
      })),
      reviews: tour.TourReview,
      // Remove capitalized fields
      ItineraryDay: undefined,
      TourDeparture: undefined,
      TourAddon: undefined,
      Category: undefined,
      Promotion: undefined,
      TourMedia: undefined,
      TourReview: undefined,
    }))

    return NextResponse.json({
      data: transformedTours,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch tours:', error)
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
    const data = createTourSchema.parse(payload)

    const slug = data.slug
      ? slugify(data.slug)
      : await generateUniqueSlug(data.title)

    const existingSlug = await prisma.tour.findUnique({
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

    const tour = await prisma.tour.create({
      data: {
        id: nanoid(),
        title: data.title,
        slug,
        summary: data.summary,
        heroImageUrl: data.heroImageUrl,
        durationDays: data.durationDays,
        durationNights: data.durationNights,
        difficulty: data.difficulty ?? TourDifficulty.EASY,
        basePrice: toOptionalDecimal(data.basePrice),
        currency: data.currency ?? 'VND',
        maxGuests: data.maxGuests,
        meetingPoint: data.meetingPoint,
        departureCity: data.departureCity,
        arrivalCity: data.arrivalCity,
        status: data.status ?? TourStatus.DRAFT,
        isFeatured: data.isFeatured ?? false,
        highlights: data.highlights ?? [],
        inclusions: data.inclusions ?? [],
        exclusions: data.exclusions ?? [],
        seoTitle: data.seo?.title,
        seoDescription: data.seo?.description,
        seoKeywords: data.seo?.keywords ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ItineraryDay: data.itineraryDays
          ? {
              create: data.itineraryDays.map((day) => ({
                id: nanoid(),
                dayNumber: day.dayNumber,
                title: day.title,
                description: day.description,
                meals: day.meals ?? [],
                activities: day.activities ?? [],
                stayInfo: day.stayInfo,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            }
          : undefined,
        TourDeparture: data.departures
          ? {
              create: data.departures.map((departure) => ({
                id: nanoid(),
                startDate: departure.startDate,
                endDate: departure.endDate,
                seatsTotal: departure.seatsTotal,
                seatsAvailable:
                  departure.seatsAvailable ?? departure.seatsTotal,
                priceAdult: toOptionalDecimal(departure.priceAdult),
                priceChild: toOptionalDecimal(departure.priceChild),
                priceInfant: toOptionalDecimal(departure.priceInfant),
                status: departure.status,
                notes: departure.notes,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            }
          : undefined,
        TourAddon: data.addons
          ? {
              create: data.addons.map((addon) => ({
                id: nanoid(),
                name: addon.name,
                description: addon.description,
                price: toDecimal(addon.price),
                perPerson: addon.perPerson ?? true,
                isActive: addon.isActive ?? true,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            }
          : undefined,
        Category: data.categoryIds
          ? {
              connect: data.categoryIds.map((id) => ({ id })),
            }
          : undefined,
        Promotion: data.promotionIds
          ? {
              connect: data.promotionIds.map((id) => ({ id })),
            }
          : undefined,
        TourMedia: data.media
          ? {
              create: data.media.map((item, index) => ({
                id: nanoid(),
                mediaId: item.mediaId,
                type: item.type ?? 'IMAGE',
                position: item.position ?? index,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            }
          : undefined,
      },
      include: tourInclude,
    })

    // Transform Prisma field names to match frontend expectations
    const transformedTour = {
      ...tour,
      itineraryDays: tour.ItineraryDay,
      departures: tour.TourDeparture,
      addons: tour.TourAddon,
      categories: tour.Category,
      promotions: tour.Promotion,
      mediaItems: tour.TourMedia?.map(item => ({
        ...item,
        media: item.Media,
        Media: undefined,
      })),
      reviews: tour.TourReview,
      // Remove capitalized fields
      ItineraryDay: undefined,
      TourDeparture: undefined,
      TourAddon: undefined,
      Category: undefined,
      Promotion: undefined,
      TourMedia: undefined,
      TourReview: undefined,
    }

    return NextResponse.json(transformedTour, { status: 201 })
  } catch (error) {
    console.error('Failed to create tour:', error)
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
