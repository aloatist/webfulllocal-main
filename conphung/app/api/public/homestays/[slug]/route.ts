import { NextResponse } from 'next/server'
import { HomestayStatus } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  homestayInclude,
  serializeHomestay,
} from '@/lib/homestays/serializers'

const paramsSchema = z.object({
  slug: z.string().min(1),
})

export const dynamic = 'force-static'

export async function GET(
  _request: Request,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = paramsSchema.parse(context.params)

    const homestay = await prisma.homestay.findFirst({
      where: {
        slug,
        status: HomestayStatus.PUBLISHED,
      },
      include: homestayInclude,
    })

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 })
    }

    return NextResponse.json(serializeHomestay(homestay))
  } catch (error) {
    console.error('Failed to fetch homestay by slug:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid slug', details: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
