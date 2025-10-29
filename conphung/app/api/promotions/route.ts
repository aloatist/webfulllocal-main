import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { DiscountType } from '@prisma/client'

const createPromotionSchema = z.object({
  code: z.string().min(1, 'Mã khuyến mãi không được để trống'),
  name: z.string().min(1, 'Tên khuyến mãi không được để trống'),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().positive('Giá trị giảm phải lớn hơn 0'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const promotions = await prisma.promotion.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: promotions })
  } catch (error) {
    console.error('Failed to fetch promotions:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh sách khuyến mãi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createPromotionSchema.parse(body)

    // Check if code already exists
    const existing = await prisma.promotion.findUnique({
      where: { code: data.code },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Mã khuyến mãi đã tồn tại' },
        { status: 400 }
      )
    }

    // Create promotion
    const promotion = await prisma.promotion.create({
      data: {
        id: nanoid(),
        code: data.code,
        name: data.name,
        discountType: data.discountType,
        discountValue: data.discountValue,
        description: data.description || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive,
        usageLimit: null,
        usageCount: 0,
        maxDiscount: null,
        minimumOrder: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    console.log(`✅ Created promotion: ${promotion.code} (${promotion.id})`)

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Failed to create promotion:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dữ liệu không hợp lệ', 
          details: error.flatten() 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Không thể tạo khuyến mãi' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
