import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import {
  DiscountType,
  Promotion,
  Prisma,
} from '@prisma/client'
import { nanoid } from 'nanoid'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 100

function serializePromotion(promotion: Promotion) {
  return {
    id: promotion.id,
    code: promotion.code,
    name: promotion.name,
    description: promotion.description,
    discountType: promotion.discountType,
    discountValue: promotion.discountValue.toString(),
    maxDiscount: promotion.maxDiscount?.toString() ?? null,
    startDate: promotion.startDate?.toISOString() ?? null,
    endDate: promotion.endDate?.toISOString() ?? null,
    usageLimit: promotion.usageLimit,
    usageCount: promotion.usageCount,
    isActive: promotion.isActive,
    minimumOrder: promotion.minimumOrder?.toString() ?? null,
    createdAt: promotion.createdAt.toISOString(),
    updatedAt: promotion.updatedAt.toISOString(),
  }
}

const createPromotionSchema = z
  .object({
    code: z.string().min(1).max(120).trim(),
    name: z.string().min(1).max(255).trim(),
    description: z.string().max(2000).optional(),
    discountType: z.nativeEnum(DiscountType),
    discountValue: z.union([z.string(), z.number()]),
    maxDiscount: z.union([z.string(), z.number(), z.null()]).optional(),
    minimumOrder: z.union([z.string(), z.number(), z.null()]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    usageLimit: z.union([z.string(), z.number(), z.null()]).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    ({ startDate, endDate }) => {
      if (!startDate || !endDate) {
        return true
      }
      return new Date(startDate) <= new Date(endDate)
    },
    {
      message: 'Start date must be before end date',
      path: ['endDate'],
    }
  )

function toDecimal(value?: string | number | null) {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const numeric =
    typeof value === 'number' ? value : Number.parseFloat(value)
  if (!Number.isFinite(numeric)) {
    throw new Error('Invalid numeric value')
  }
  return new Prisma.Decimal(numeric)
}

function toNullableInt(value?: string | number | null) {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const numeric =
    typeof value === 'number'
      ? value
      : Number.parseInt(String(value), 10)
  if (!Number.isFinite(numeric)) {
    throw new Error('Invalid numeric value')
  }
  return numeric
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(
      Number.parseInt(searchParams.get('page') ?? '1', 10),
      1
    )
    const rawLimit = Number.parseInt(
      searchParams.get('limit') ?? `${DEFAULT_LIMIT}`,
      10
    )
    const limit = Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
    const search = searchParams.get('search')?.trim()
    const activeParam = searchParams.get('isActive')

    const where: Prisma.PromotionWhereInput = {}

    if (search && search.length > 0) {
      where.OR = [
        { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          description: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ]
    }

    if (activeParam === 'true') {
      where.isActive = true
    } else if (activeParam === 'false') {
      where.isActive = false
    }

    const [total, promotions] = await Promise.all([
      prisma.promotion.count({ where }),
      prisma.promotion.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    return NextResponse.json({
      data: promotions.map(serializePromotion),
      meta: {
        total,
        page,
        limit,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (!session?.user?.id || !role || !['ADMIN', 'EDITOR'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const payload = createPromotionSchema.parse(json)

    const discountValue = toDecimal(payload.discountValue)
    if (!discountValue) {
      return NextResponse.json(
        { error: 'Discount value is required' },
        { status: 400 }
      )
    }

    const startDate = payload.startDate
      ? new Date(payload.startDate)
      : undefined
    const endDate = payload.endDate ? new Date(payload.endDate) : undefined

    if (
      startDate &&
      Number.isNaN(startDate.getTime())
    ) {
      return NextResponse.json(
        { error: 'Invalid start date' },
        { status: 400 }
      )
    }

    if (
      endDate &&
      Number.isNaN(endDate.getTime())
    ) {
      return NextResponse.json(
        { error: 'Invalid end date' },
        { status: 400 }
      )
    }

    const promotion = await prisma.promotion.create({
      data: {
        id: nanoid(),
        code: payload.code,
        name: payload.name,
        description: payload.description,
        discountType: payload.discountType,
        discountValue,
        maxDiscount: toDecimal(payload.maxDiscount),
        minimumOrder: toDecimal(payload.minimumOrder),
        startDate,
        endDate,
        usageLimit: toNullableInt(payload.usageLimit),
        isActive: payload.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(serializePromotion(promotion), {
      status: 201,
    })
  } catch (error) {
    console.error('Failed to create promotion:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid payload',
          details: error.flatten(),
        },
        { status: 400 }
      )
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Promotion code already exists' },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Invalid numeric value') {
      return NextResponse.json(
        { error: 'Invalid numeric value provided' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create promotion.' },
      { status: 500 }
    )
  }
}
