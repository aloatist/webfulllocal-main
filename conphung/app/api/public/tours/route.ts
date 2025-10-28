import { NextRequest, NextResponse } from 'next/server'
import { getPublishedTours } from '@/lib/tours/public'
import { z } from 'zod'

export const dynamic = 'force-dynamic';

const querySchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number.parseInt(value, 10))
    .optional(),
  search: z.string().optional(),
  difficulty: z.string().optional(),
  featuredOnly: z
    .string()
    .transform((value) => value === 'true')
    .optional(),
})

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries())
    const parsed = querySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const tours = await getPublishedTours(parsed.data)

    return NextResponse.json({ data: tours })
  } catch (error) {
    console.error('Failed to fetch public tours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    )
  }
}
