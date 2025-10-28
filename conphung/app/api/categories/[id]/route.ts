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
    const category = await prisma.category.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        seo: true,
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

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Failed to fetch category:', error)
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
    const { name, slug, description, parentId, seo } = json

    // Check for circular dependency when updating parent
    if (parentId) {
      const wouldCreateCircular = await checkCircularDependency(
        context.params.id,
        parentId
      )
      if (wouldCreateCircular) {
        return NextResponse.json(
          { error: 'Cannot create circular category dependency' },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id: context.params.id },
      data: {
        name,
        slug,
        description,
        parent: parentId === null
          ? { disconnect: true }
          : parentId
          ? { connect: { id: parentId } }
          : undefined,
        seo: seo ? {
          upsert: {
            create: seo,
            update: seo,
          },
        } : undefined,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        seo: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Failed to update category:', error)
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
    // Check if category has children
    const category = await prisma.category.findUnique({
      where: { id: context.params.id },
      include: {
        _count: {
          select: {
            children: true,
            posts: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories' },
        { status: 400 }
      )
    }

    if (category._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated posts' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: context.params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to check for circular dependencies
async function checkCircularDependency(
  categoryId: string,
  newParentId: string
): Promise<boolean> {
  let currentId = newParentId
  const seen = new Set([categoryId])

  while (currentId) {
    if (seen.has(currentId)) {
      return true
    }
    seen.add(currentId)

    const parent = await prisma.category.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    })

    if (!parent || !parent.parentId) {
      break
    }

    currentId = parent.parentId
  }

  return false
}
