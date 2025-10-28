import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'

interface Context {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            createdAt: true,
          },
          where: {
            status: 'PUBLISHED',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Failed to fetch tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { name, slug, description } = json

    // Check if updated slug/name would conflict with existing tag
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [{ name }, { slug }],
        NOT: { id: context.params.id },
      },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this name or slug already exists' },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.update({
      where: { id: context.params.id },
      data: {
        name,
        slug,
        description,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Failed to update tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.role || !['ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Check if tag has associated posts
    const tag = await prisma.tag.findUnique({
      where: { id: context.params.id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    if (tag._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tag with associated posts' },
        { status: 400 }
      )
    }

    await prisma.tag.delete({
      where: { id: context.params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
