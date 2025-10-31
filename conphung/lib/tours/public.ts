import { prisma } from '@/lib/prisma'
import { Prisma, TourStatus } from '@prisma/client'
import {
  activeBookingStatuses,
  countGuests,
  deriveDepartureStatus,
} from '@/lib/bookings/availability'

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
    where: { status: 'APPROVED' },
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

function serializeTour(
  tour: any,
  occupancy?: Map<string, number>
) {
  return {
    ...tour,
    basePrice: serializeDecimal(tour.basePrice),
    TourDeparture: tour.TourDeparture?.map((dep: any) => ({
      ...dep,
      seatsAvailable: (() => {
        const seatsTotal = dep.seatsTotal ?? 0
        const booked = occupancy?.get(dep.id) ?? 0
        return Math.max(seatsTotal - booked, 0)
      })(),
      status: (() => {
        const seatsTotal = dep.seatsTotal ?? 0
        const booked = occupancy?.get(dep.id) ?? 0
        const seatsRemaining = Math.max(seatsTotal - booked, 0)
        return deriveDepartureStatus(dep.status, seatsRemaining, seatsTotal)
      })(),
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

async function buildDepartureOccupancyMap(
  departureIds: string[]
) {
  if (departureIds.length === 0) {
    return new Map<string, number>()
  }

  const grouped = await prisma.booking.groupBy({
    by: ['departureId'],
    where: {
      departureId: { in: departureIds },
      status: { in: activeBookingStatuses },
    },
    _sum: {
      adults: true,
      children: true,
      infants: true,
    },
  })

  const map = new Map<string, number>()

  grouped.forEach((group) => {
    const booked = countGuests(
      group._sum.adults,
      group._sum.children,
      group._sum.infants
    )
    map.set(group.departureId, booked)
  })

  return map
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

  const departureIds = tours.flatMap((tour) =>
    tour.TourDeparture?.map((dep) => dep.id) ?? []
  )

  const occupancy = await buildDepartureOccupancyMap(departureIds)

  return tours.map((tour) => serializeTour(tour, occupancy))
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

  if (!tour) {
    return null
  }

  const departureIds =
    tour.TourDeparture?.map((departure) => departure.id) ?? []

  const occupancy = await buildDepartureOccupancyMap(departureIds)

  return serializeTour(tour, occupancy)
}

export type PublicTour = Awaited<ReturnType<typeof getPublishedTours>> extends Array<infer T> ? T : never
export type PublicTourDetail = Awaited<ReturnType<typeof getTourBySlug>>
