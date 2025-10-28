import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/tours/permissions'

const paramsSchema = z.object({
  homestayId: z.string(),
})

const createPricingRuleSchema = z.object({
  name: z.string().min(1).max(180),
  type: z.enum(['SEASONAL', 'WEEKEND', 'HOLIDAY', 'LONG_STAY', 'LAST_MINUTE', 'EARLY_BIRD', 'GROUP_DISCOUNT', 'LENGTH_OF_STAY', 'DYNAMIC']).default('SEASONAL'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).default('ACTIVE'),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  minimumNights: z.number().int().min(1).optional(),
  maximumNights: z.number().int().min(1).optional(),
  minimumGuests: z.number().int().min(1).optional(),
  maximumGuests: z.number().int().min(1).optional(),
  priceAdjustmentType: z.string().default('percentage'),
  priceAdjustmentValue: z.number(),
  newBasePrice: z.number().optional(),
  cleaningFeeAdjustment: z.number().optional(),
  securityDepositAdjustment: z.number().optional(),
  priority: z.number().int().default(0),
  isRecursive: z.boolean().default(false),
  recursionPattern: z.string().optional(),
  conditions: z.record(z.any()).optional(),
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

    const pricingRules = await prisma.homestayPricingRule.findMany({
      where: { homestayId },
      orderBy: { priority: 'desc' },
    })

    return NextResponse.json({ data: pricingRules })
  } catch (error) {
    console.error('Failed to fetch pricing rules:', error)
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
    const body = await request.json()
    const data = createPricingRuleSchema.parse(body)

    // Verify homestay exists
    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
    })

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    const pricingRule = await prisma.homestayPricingRule.create({
      data: {
        ...data,
        homestayId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    })

    return NextResponse.json(pricingRule, { status: 201 })
  } catch (error) {
    console.error('Failed to create pricing rule:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
