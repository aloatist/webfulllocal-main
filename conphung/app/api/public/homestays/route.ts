import { NextResponse } from 'next/server'
import { Prisma, HomestayStatus } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  homestayInclude,
  serializeHomestay,
} from '@/lib/homestays/serializers'

const publicListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(24).default(12),
  search: z.string().optional(),
  type: z.enum(['PRIVATE_ROOM', 'ENTIRE_PLACE', 'SHARED_ROOM']).optional(),
  category: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'CONDO', 'TOWNHOUSE', 'STUDIO', 'LOFT', 'BUNGALOW', 'CABIN', 'TREEHOUSE', 'BOAT', 'CAMPER', 'TENT', 'OTHER']).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minGuests: z.coerce.number().int().min(1).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  hasWifi: z.coerce.boolean().optional(),
  hasKitchen: z.coerce.boolean().optional(),
  hasPool: z.coerce.boolean().optional(),
  hasParking: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  sortBy: z.enum(['createdAt', 'basePrice', 'ratingAverage', 'bookingCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Enable caching with revalidation every hour for better performance
export const revalidate = 3600; // 1 hour
export const dynamic = 'force-static'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = publicListSchema.parse(
      Object.fromEntries(searchParams.entries())
    )
    const { 
      page, 
      limit, 
      search, 
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
      minRating,
      sortBy,
      sortOrder
    } = parsed

    const where: Prisma.HomestayWhereInput = {
      status: HomestayStatus.PUBLISHED,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { summary: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { city: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { subtitle: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ]
    }

    if (type) where.type = type
    if (category) where.category = category
    if (isFeatured !== undefined) where.isFeatured = isFeatured

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
    console.error('Failed to fetch public homestays:', error)
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
