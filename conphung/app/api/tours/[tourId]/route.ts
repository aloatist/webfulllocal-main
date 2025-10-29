import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { updateTourSchema } from '@/lib/tours/schemas'
import type { UpdateTourInput } from '@/lib/tours/schemas'
import { requireEditor } from '@/lib/tours/permissions'
import { slugify, toDecimal, toOptionalDecimal } from '@/lib/tours/utils'
import { DepartureStatus, Prisma } from '@prisma/client'
import { nanoid } from 'nanoid'

type DepartureInput = NonNullable<UpdateTourInput['departures']>[number]
type AddonInput = NonNullable<UpdateTourInput['addons']>[number]
type MediaInput = NonNullable<UpdateTourInput['media']>[number]
type ItineraryDayInput = NonNullable<UpdateTourInput['itineraryDays']>[number]

const paramsSchema = z.object({
  tourId: z.string(),
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

export async function GET(
  _request: NextRequest,
  context: { params: Record<string, string> }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { tourId } = paramsSchema.parse(context.params)

    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: tourInclude,
    })

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

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

    return NextResponse.json(transformedTour)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid tour id', details: error.flatten() },
        { status: 400 }
      )
    }

    console.error('Failed to fetch tour:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Record<string, string> }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { tourId } = paramsSchema.parse(context.params)
    const payload = await request.json()
    const data: UpdateTourInput = updateTourSchema.parse(payload)

    const tourExists = await prisma.tour.findUnique({
      where: { id: tourId },
      select: { slug: true },
    })

    if (!tourExists) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    let slug: string | undefined
    let baseSlug: string | undefined
    
    if (data.slug && data.slug.trim()) {
      baseSlug = slugify(data.slug.trim())
    } else if (data.title && data.title.trim()) {
      baseSlug = slugify(data.title.trim())
    }

    if (baseSlug && baseSlug !== tourExists.slug) {
      // Check if slug already exists
      const duplicateSlug = await prisma.tour.findFirst({
        where: { 
          slug: baseSlug,
          id: { not: tourId }
        },
        select: { id: true },
      })

      if (duplicateSlug) {
        // Return error - don't auto-change slug to preserve SEO
        return NextResponse.json(
          { 
            error: 'Slug đã tồn tại. Vui lòng chọn slug khác để giữ đường dẫn SEO.',
            currentSlug: tourExists.slug,
            attemptedSlug: baseSlug,
          },
          { status: 409 }
        )
      }
      
      slug = baseSlug
    }
    // If slug is the same or not provided, slug stays undefined (no update)

    if (data.media) {
      const mediaIds = Array.from(
        new Set(
          data.media.map((mediaItem: MediaInput) => mediaItem.mediaId)
        )
      )
      if (mediaIds.length > 0) {
        const existingMedia = await prisma.media.findMany({
          where: { id: { in: mediaIds } },
          select: { id: true },
        })
        const missingMedia = mediaIds.filter((mediaId: string) =>
          !existingMedia.some((mediaItem) => mediaItem.id === mediaId)
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

    if (data.categoryIds) {
      const categoryIds = data.categoryIds
      if (categoryIds.length > 0) {
        const existingCategories = await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true },
        })
        const missingCategories = categoryIds.filter((categoryId: string) =>
          !existingCategories.some((category) => category.id === categoryId)
        )
        if (missingCategories.length > 0) {
          return NextResponse.json(
            {
              error: 'Some categories could not be found',
              missingCategories,
            },
            { status: 400 }
          )
        }
      }
    }

    if (data.promotionIds) {
      const promotionIds = data.promotionIds
      if (promotionIds.length > 0) {
        const existingPromotions = await prisma.promotion.findMany({
          where: { id: { in: promotionIds } },
          select: { id: true },
        })
        const missingPromotions = promotionIds.filter((promotionId: string) =>
          !existingPromotions.some(
            (promotion) => promotion.id === promotionId
          )
        )
        if (missingPromotions.length > 0) {
          return NextResponse.json(
            {
              error: 'Some promotions could not be found',
              missingPromotions,
            },
            { status: 400 }
          )
        }
      }
    }

    let departuresToDelete: string[] = []
    const departureUpserts: Prisma.TourDepartureUpsertWithWhereUniqueWithoutTourInput[] = []
    const departureCreates: Prisma.TourDepartureCreateWithoutTourInput[] = []
    let addonsToDelete: string[] = []
    const addonUpserts: Prisma.TourAddonUpsertWithWhereUniqueWithoutTourInput[] = []
    const addonCreates: Prisma.TourAddonCreateWithoutTourInput[] = []

    if (data.departures) {
      const departures = data.departures as DepartureInput[]
      const existingDepartureIds = await prisma.tourDeparture.findMany({
        where: { tourId },
        select: { id: true },
      })

      const incomingDepartureIds = new Set(
        departures
          .map((departure) => departure.id)
          .filter((identifier): identifier is string => Boolean(identifier))
      )

      departuresToDelete = existingDepartureIds
        .map((departure) => departure.id)
        .filter((departureId) => !incomingDepartureIds.has(departureId))

      if (departuresToDelete.length > 0) {
        const referencedBookings = await prisma.booking.findMany({
          where: { departureId: { in: departuresToDelete } },
          select: { id: true, reference: true, departureId: true },
        })

        if (referencedBookings.length > 0) {
          return NextResponse.json(
            {
              error:
                'Cannot remove departures that already have bookings. Please update or cancel related bookings first.',
              conflictingDepartureIds: Array.from(
                new Set(referencedBookings.map((booking) => booking.departureId))
              ),
              bookingReferences: referencedBookings
                .map((booking) => booking.reference)
                .filter((reference): reference is string => Boolean(reference)),
            },
            { status: 409 }
          )
        }
      }

      const mapDeparture = (
        departure: DepartureInput
      ): Prisma.TourDepartureCreateWithoutTourInput => ({
        id: departure.id ?? nanoid(),
        startDate: departure.startDate,
        endDate: departure.endDate ?? null,
        seatsTotal: departure.seatsTotal,
        seatsAvailable:
          departure.seatsAvailable ?? departure.seatsTotal,
        priceAdult: toOptionalDecimal(departure.priceAdult),
        priceChild: toOptionalDecimal(departure.priceChild),
        priceInfant: toOptionalDecimal(departure.priceInfant),
        status: departure.status ?? DepartureStatus.SCHEDULED,
        notes: departure.notes ?? null,
        updatedAt: new Date(),
      })

      for (const departure of departures) {
        const mapped = mapDeparture(departure)
        if (departure.id) {
          departureUpserts.push({
            where: { id: departure.id },
            update: mapped,
            create: mapped,
          })
        } else {
          departureCreates.push(mapped)
        }
      }
    }

    if (data.addons) {
      const addons = data.addons as AddonInput[]
      const existingAddonIds = await prisma.tourAddon.findMany({
        where: { tourId },
        select: { id: true },
      })

      const incomingAddonIds = new Set(
        addons
          .map((addon) => addon.id)
          .filter((identifier): identifier is string => Boolean(identifier))
      )

      addonsToDelete = existingAddonIds
        .map((addon) => addon.id)
        .filter((addonId) => !incomingAddonIds.has(addonId))

      if (addonsToDelete.length > 0) {
        const referencedBookingAddons = await prisma.bookingAddon.findMany({
          where: { addonId: { in: addonsToDelete } },
          select: {
            addonId: true,
            Booking: {
              select: { reference: true },
            },
          },
        })

        if (referencedBookingAddons.length > 0) {
          return NextResponse.json(
            {
              error:
                'Cannot remove add-ons that are already attached to bookings. Please update or cancel related bookings first.',
              conflictingAddonIds: Array.from(
                new Set(referencedBookingAddons.map((item) => item.addonId))
              ),
              bookingReferences: referencedBookingAddons
                .map((item) => item.Booking?.reference)
                .filter((reference): reference is string => Boolean(reference)),
            },
            { status: 409 }
          )
        }
      }

      const mapAddon = (
        addon: AddonInput
      ): Prisma.TourAddonCreateWithoutTourInput => ({
        id: addon.id ?? nanoid(),
        name: addon.name,
        description: addon.description ?? null,
        price: toDecimal(addon.price),
        perPerson: addon.perPerson ?? true,
        isActive: addon.isActive ?? true,
        updatedAt: new Date(),
      })

      for (const addon of addons) {
        const mapped = mapAddon(addon)
        if (addon.id) {
          addonUpserts.push({
            where: { id: addon.id },
            update: mapped,
            create: mapped,
          })
        } else {
          addonCreates.push(mapped)
        }
      }
    }

    const departuresNestedUpdate = data.departures
      ? (() => {
          const operations: Prisma.TourDepartureUpdateManyWithoutTourNestedInput = {}
          if (departuresToDelete.length > 0) {
            operations.deleteMany = { id: { in: departuresToDelete } }
          }
          if (departureUpserts.length > 0) {
            operations.upsert = departureUpserts
          }
          if (departureCreates.length > 0) {
            operations.create = departureCreates
          }
          return Object.keys(operations).length > 0 ? operations : null
        })()
      : null

    const addonsNestedUpdate = data.addons
      ? (() => {
          const operations: Prisma.TourAddonUpdateManyWithoutTourNestedInput = {}
          if (addonsToDelete.length > 0) {
            operations.deleteMany = { id: { in: addonsToDelete } }
          }
          if (addonUpserts.length > 0) {
            operations.upsert = addonUpserts
          }
          if (addonCreates.length > 0) {
            operations.create = addonCreates
          }
          return Object.keys(operations).length > 0 ? operations : null
        })()
      : null

    const itineraryCreateInput = data.itineraryDays
      ? (data.itineraryDays as ItineraryDayInput[]).map((day) => ({
          id: nanoid(),
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          meals: day.meals ?? [],
          activities: day.activities ?? [],
          stayInfo: day.stayInfo,
          updatedAt: new Date(),
        }))
      : undefined

    const mediaCreateInput = data.media
      ? (data.media as MediaInput[]).map((mediaItem, index) => ({
          id: nanoid(),
          Media: {
            connect: { id: mediaItem.mediaId },
          },
          type: mediaItem.type ?? 'IMAGE',
          position: mediaItem.position ?? index,
          updatedAt: new Date(),
        }))
      : undefined

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(slug ? { slug } : {}),
        ...(data.summary !== undefined ? { summary: data.summary } : {}),
        ...(data.heroImageUrl !== undefined
          ? { heroImageUrl: data.heroImageUrl }
          : {}),
        ...(data.durationDays !== undefined
          ? { durationDays: data.durationDays }
          : {}),
        ...(data.durationNights !== undefined
          ? { durationNights: data.durationNights }
          : {}),
        ...(data.difficulty !== undefined
          ? { difficulty: data.difficulty }
          : {}),
        ...(data.basePrice !== undefined
          ? { basePrice: toOptionalDecimal(data.basePrice) }
          : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.maxGuests !== undefined ? { maxGuests: data.maxGuests } : {}),
        ...(data.meetingPoint !== undefined
          ? { meetingPoint: data.meetingPoint }
          : {}),
        ...(data.departureCity !== undefined
          ? { departureCity: data.departureCity }
          : {}),
        ...(data.arrivalCity !== undefined
          ? { arrivalCity: data.arrivalCity }
          : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.isFeatured !== undefined
          ? { isFeatured: data.isFeatured }
          : {}),
        ...(data.highlights !== undefined
          ? { highlights: data.highlights }
          : {}),
        ...(data.inclusions !== undefined
          ? { inclusions: data.inclusions }
          : {}),
        ...(data.exclusions !== undefined
          ? { exclusions: data.exclusions }
          : {}),
        ...(data.seo?.title !== undefined
          ? { seoTitle: data.seo.title }
          : {}),
        ...(data.seo?.description !== undefined
          ? { seoDescription: data.seo.description }
          : {}),
        ...(data.seo?.keywords !== undefined
          ? { seoKeywords: data.seo.keywords }
          : {}),
        ...(itineraryCreateInput
          ? {
              ItineraryDay: {
                deleteMany: { tourId },
                create: itineraryCreateInput,
              },
            }
          : {}),
        ...(departuresNestedUpdate
          ? {
              TourDeparture: departuresNestedUpdate,
            }
          : {}),
        ...(addonsNestedUpdate
          ? {
              TourAddon: addonsNestedUpdate,
            }
          : {}),
        ...(data.categoryIds
          ? {
              Category: {
                set: data.categoryIds.map((categoryId) => ({ id: categoryId })),
              },
            }
          : {}),
        ...(data.promotionIds
          ? {
              Promotion: {
                set: data.promotionIds.map((promotionId) => ({ id: promotionId })),
              },
            }
          : {}),
        ...(mediaCreateInput
          ? {
              TourMedia: {
                deleteMany: { tourId },
                create: mediaCreateInput,
              },
            }
          : {}),
      },
      include: tourInclude,
    })

    // Transform Prisma field names to match frontend expectations
    const transformedTour = {
      ...updatedTour,
      itineraryDays: updatedTour.ItineraryDay,
      departures: updatedTour.TourDeparture,
      addons: updatedTour.TourAddon,
      categories: updatedTour.Category,
      promotions: updatedTour.Promotion,
      mediaItems: updatedTour.TourMedia?.map(item => ({
        ...item,
        media: item.Media,
        Media: undefined,
      })),
      reviews: updatedTour.TourReview,
      // Remove capitalized fields
      ItineraryDay: undefined,
      TourDeparture: undefined,
      TourAddon: undefined,
      Category: undefined,
      Promotion: undefined,
      TourMedia: undefined,
      TourReview: undefined,
    }

    return NextResponse.json(transformedTour)
  } catch (error) {
    console.error('Failed to update tour:', error)

    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0]?.message
      return NextResponse.json(
        {
          error: firstIssue ?? 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
          issues: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Record<string, string> }
) {
  const auth = await requireEditor()
  if (auth.status !== 200) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { tourId } = paramsSchema.parse(context.params)
    
    // Check for force delete flag
    const url = new URL(request.url)
    const forceDelete = url.searchParams.get('force') === 'true'

    // Check for related records before deleting
    const [bookingsCount, departuresCount, reviewsCount] = await Promise.all([
      prisma.booking.count({ where: { tourId } }),
      prisma.tourDeparture.count({ where: { tourId } }),
      prisma.tourReview.count({ where: { tourId } }),
    ])

    const totalRelated = bookingsCount + departuresCount + reviewsCount

    if (totalRelated > 0 && !forceDelete) {
      return NextResponse.json(
        {
          error: 'Cannot delete tour that has related records.',
          details: {
            bookings: bookingsCount,
            departures: departuresCount,
            reviews: reviewsCount,
            total: totalRelated,
          },
          suggestion:
            'Please delete all related bookings, departures, and reviews first, or archive the tour instead.',
        },
        { status: 409 }
      )
    }

    // Force delete: Delete all related records first
    if (forceDelete && totalRelated > 0) {
      console.log(`🗑️ Force deleting tour ${tourId} with ${totalRelated} related records`)
      
      // Get all booking IDs for this tour
      const bookingIds = await prisma.booking.findMany({
        where: { tourId },
        select: { id: true },
      })
      const bookingIdList = bookingIds.map(b => b.id)
      
      await prisma.$transaction([
        // Delete booking addons first (child of booking)
        prisma.bookingAddon.deleteMany({ 
          where: { bookingId: { in: bookingIdList } } 
        }),
        // Delete payments (child of booking)
        prisma.payment.deleteMany({ 
          where: { bookingId: { in: bookingIdList } } 
        }),
        // Delete bookings
        prisma.booking.deleteMany({ where: { tourId } }),
        // Delete departures
        prisma.tourDeparture.deleteMany({ where: { tourId } }),
        // Delete reviews
        prisma.tourReview.deleteMany({ where: { tourId } }),
        // Delete tour addons
        prisma.tourAddon.deleteMany({ where: { tourId } }),
        // Delete tour media
        prisma.tourMedia.deleteMany({ where: { tourId } }),
        // Delete itinerary days
        prisma.itineraryDay.deleteMany({ where: { tourId } }),
        // Finally delete tour
        prisma.tour.delete({ where: { id: tourId } }),
      ])
      
      console.log(`✅ Force deleted tour ${tourId} and ${totalRelated} related records`)
      return NextResponse.json({ 
        success: true, 
        message: `Deleted tour and ${totalRelated} related records`,
        deleted: {
          bookings: bookingsCount,
          departures: departuresCount,
          reviews: reviewsCount,
        }
      })
    }

    await prisma.tour.delete({
      where: { id: tourId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid tour id', details: error.flatten() },
        { status: 400 }
      )
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return NextResponse.json(
        {
          error:
            'Cannot delete tour that is referenced by other records (bookings, departures, etc).',
        },
        { status: 409 }
      )
    }

    console.error('Failed to delete tour:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
