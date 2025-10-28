import { prisma } from '@/lib/prisma'
import { Prisma, TourStatus } from '@prisma/client'

const publicTourInclude = {
  TourMedia: {
    orderBy: { position: 'asc' as const },
    include: {
      Media: true,
    },
  },
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
  TourReview: {
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' as const },
    take: 10,
  },
} satisfies Prisma.TourInclude

function serializeDecimal(value: any) {
  if (value && typeof value === 'object' && 'toString' in value) {
    return value.toString()
  }
  return value
}

function serializeTour(tour: any) {
  return {
    ...tour,
    basePrice: serializeDecimal(tour.basePrice),
    TourDeparture: tour.TourDeparture?.map((dep: any) => ({
      ...dep,
      priceAdult: serializeDecimal(dep.priceAdult),
      priceChild: serializeDecimal(dep.priceChild),
      priceInfant: serializeDecimal(dep.priceInfant),
    })),
    TourAddon: tour.TourAddon?.map((addon: any) => ({
      ...addon,
      price: serializeDecimal(addon.price),
    })),
  }
}

export async function getPublishedTours(options?: {
  limit?: number
  search?: string
  difficulty?: string
  featuredOnly?: boolean
}) {
  const { limit = 12, search, difficulty, featuredOnly } = options ?? {}

  const where: Prisma.TourWhereInput = {
    status: TourStatus.PUBLISHED,
  }

  if (featuredOnly) {
    where.isFeatured = true
  }

  if (difficulty) {
    where.difficulty = difficulty as Prisma.TourWhereInput['difficulty']
  }

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

  const tours = await prisma.tour.findMany({
    where,
    include: publicTourInclude,
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  })

  return tours.map(serializeTour)
}

export async function getTourBySlug(slug: string) {
  const tour = await prisma.tour.findFirst({
    where: {
      slug,
      status: TourStatus.PUBLISHED,
    },
    include: {
      ...publicTourInclude,
      Promotion: {
        where: {
          isActive: true,
          AND: [
            {
              OR: [
                { startDate: null },
                { startDate: { lte: new Date() } },
              ],
            },
            {
              OR: [
                { endDate: null },
                { endDate: { gte: new Date() } },
              ],
            },
          ],
        },
        take: 5,
      },
    },
  })
  
  return tour ? serializeTour(tour) : null
}

export type PublicTour = Awaited<ReturnType<typeof getPublishedTours>> extends Array<infer T> ? T : never
export type PublicTourDetail = Awaited<ReturnType<typeof getTourBySlug>>
