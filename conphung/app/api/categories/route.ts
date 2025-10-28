import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { nanoid } from 'nanoid'
import { authOptions } from '@/lib/auth/auth-options'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const parent = searchParams.get('parent') || undefined

    const where: Prisma.CategoryWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(parent && {
        parentId: parent,
      }),
    }

    const [total, categories] = await Promise.all([
      prisma.category.count({ where }),
      prisma.category.findMany({
        where,
        include: {
          Category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          other_Category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          SEO: true,
          _count: {
            select: {
              Post: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    return NextResponse.json({
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { name, slug, description, parentId, seo } = json

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: {
        id: nanoid(),
        name,
        slug,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(parentId && {
          Category: {
            connect: { id: parentId },
          },
        }),
        ...(seo && {
          SEO: {
            create: seo,
          },
        }),
      },
      include: {
        Category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        other_Category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        SEO: true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Failed to create category:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    
    // Handle Prisma unique constraint errors
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as any
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Category with this name or slug already exists' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
