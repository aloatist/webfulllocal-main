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

    const where: Prisma.TagWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {}

    const [total, tags] = await Promise.all([
      prisma.tag.count({ where }),
      prisma.tag.findMany({
        where,
        include: {
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
      tags,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch tags:', error)
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
    const { name, slug, description } = json

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if tag already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this name or slug already exists' },
        { status: 409 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        id: nanoid(),
        name,
        slug,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            Post: true,
          },
        },
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Failed to create tag:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    
    // Handle Prisma unique constraint errors
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as any
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Tag with this name or slug already exists' },
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
