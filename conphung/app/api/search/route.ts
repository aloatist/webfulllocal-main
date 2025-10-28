import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = query.trim().toLowerCase()

    // Search tours
    const tours = await prisma.tour.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { summary: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        basePrice: true,
      },
    })

    // Search homestays
    const homestays = await prisma.homestay.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { summary: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        basePrice: true,
      },
    })

    // Search posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { excerpt: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
      },
    })

    // Format results
    const results = [
      ...tours.map(tour => ({
        id: tour.id,
        title: tour.title,
        type: 'tour' as const,
        url: `/tours/${tour.slug}`,
        excerpt: tour.summary?.substring(0, 150),
        price: tour.basePrice ? Number(tour.basePrice) : null,
      })),
      ...homestays.map(homestay => ({
        id: homestay.id,
        title: homestay.title,
        type: 'homestay' as const,
        url: `/homestays/${homestay.slug}`,
        excerpt: homestay.summary?.substring(0, 150),
        price: homestay.basePrice ? Number(homestay.basePrice) : null,
      })),
      ...posts.map(post => ({
        id: post.id,
        title: post.title,
        type: 'post' as const,
        url: `/posts/${post.slug}`,
        excerpt: post.excerpt,
      })),
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    )
  }
}
