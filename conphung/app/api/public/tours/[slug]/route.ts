import { NextResponse } from 'next/server'
import { getTourBySlug } from '@/lib/tours/public'

export async function GET(
  _request: Request,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing tour slug' },
        { status: 400 }
      )
    }

    const tour = await getTourBySlug(slug)

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json(tour)
  } catch (error) {
    console.error('Failed to fetch tour detail:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tour detail' },
      { status: 500 }
    )
  }
}
