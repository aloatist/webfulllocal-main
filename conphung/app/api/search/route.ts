import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'tour' | 'homestay' | 'post' | null
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const city = searchParams.get('city')
    const category = searchParams.get('category')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = query.trim().toLowerCase()

    // Search tours (only if type is null or 'tour')
    const tourWhere: any = {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
      ],
    }
    
    if (minPrice) {
      tourWhere.basePrice = { ...tourWhere.basePrice, gte: Number(minPrice) }
    }
    if (maxPrice) {
      tourWhere.basePrice = { ...tourWhere.basePrice, lte: Number(maxPrice) }
    }
    
    const tours = (!type || type === 'tour') ? await prisma.tour.findMany({
      where: tourWhere,
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        basePrice: true,
        difficulty: true,
      },
    }) : []

    // Search homestays (only if type is null or 'homestay')
    const homestayWhere: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
        { city: { contains: searchTerm, mode: 'insensitive' } },
      ],
    }
    
    if (minPrice) {
      homestayWhere.basePrice = { ...homestayWhere.basePrice, gte: Number(minPrice) }
    }
    if (maxPrice) {
      homestayWhere.basePrice = { ...homestayWhere.basePrice, lte: Number(maxPrice) }
    }
    if (city) {
      homestayWhere.city = { contains: city, mode: 'insensitive' }
    }
    
    const homestays = (!type || type === 'homestay') ? await prisma.homestay.findMany({
      where: homestayWhere,
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        basePrice: true,
        city: true,
        country: true,
        type: true,
      },
    }) : []

    // Search posts (only if type is null or 'post')
    const postWhere: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { excerpt: { contains: searchTerm, mode: 'insensitive' } },
      ],
    }
    
    if (category) {
      postWhere.Category = {
        some: {
          slug: category,
        },
      }
    }
    
    const posts = (!type || type === 'post') ? await prisma.post.findMany({
      where: postWhere,
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
      },
    }) : []

    // Format results
    const results = [
      ...tours.map(tour => ({
        id: tour.id,
        title: tour.title,
        type: 'tour' as const,
        url: `/tours/${tour.slug}`,
        excerpt: tour.summary?.substring(0, 150),
        price: tour.basePrice ? Number(tour.basePrice) : null,
        location: undefined, // Tours don't have city field
        meta: { difficulty: tour.difficulty },
      })),
      ...homestays.map(homestay => ({
        id: homestay.id,
        title: homestay.title,
        type: 'homestay' as const,
        url: `/homestays/${homestay.slug}`,
        excerpt: homestay.summary?.substring(0, 150),
        price: homestay.basePrice ? Number(homestay.basePrice) : null,
        location: [homestay.city, homestay.country].filter(Boolean).join(', ') || undefined,
        meta: { type: homestay.type },
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
