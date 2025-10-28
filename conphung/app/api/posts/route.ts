import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, PostStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || undefined
    const tagId = searchParams.get('tagId') || undefined

    const filters: Prisma.PostWhereInput[] = [
      {
        OR: [
          { authorId: session.user.id },
          { status: PostStatus.PUBLISHED },
        ],
      },
    ]

    if (search) {
      filters.push({
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      })
    }

    if (categoryId) {
      filters.push({
        Category: {
          some: {
            id: categoryId,
          },
        },
      })
    }

    if (tagId) {
      filters.push({
        Tag: {
          some: {
            id: tagId,
          },
        },
      })
    }

    const where: Prisma.PostWhereInput =
      filters.length === 1 ? filters[0] : { AND: filters }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          Tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          SEO: true,
          Media: {
            select: {
              id: true,
              url: true,
              alt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && 'code' in error) {
      console.error('Error code:', (error as any).code)
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { title, content, excerpt, slug, featured, status, categoryIds, tagIds, seo, featuredImageId } = json

    const post = await prisma.post.create({
      data: {
        id: nanoid(),
        title,
        content,
        excerpt,
        slug,
        featured: featured || false,
        status: status || 'DRAFT',
        authorId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        Category: {
          connect: categoryIds?.map((id: string) => ({ id })) || [],
        },
        Tag: {
          connect: tagIds?.map((id: string) => ({ id })) || [],
        },
        ...(featuredImageId && {
          Media: {
            connect: { id: featuredImageId },
          },
        }),
        ...(seo && {
          SEO: {
            create: {
              id: nanoid(),
              ...seo,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }),
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        Tag: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        SEO: true,
        Media: {
          select: {
            id: true,
            url: true,
            alt: true,
          },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Failed to create post:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && 'code' in error) {
      console.error('Error code:', (error as any).code)
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
