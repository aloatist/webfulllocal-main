import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { nanoid } from 'nanoid'

interface Context {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: context.params.id,
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

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { title, content, excerpt, slug, featured, status, categoryIds, tagIds, seo, featuredImageId } = json

    // Verify post exists and user has permission to edit
    const existingPost = await prisma.post.findUnique({
      where: { id: context.params.id },
      select: { authorId: true },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existingPost.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const post = await prisma.post.update({
      where: { id: context.params.id },
      data: {
        title,
        content,
        excerpt,
        slug,
        featured,
        status,
        updatedAt: new Date(),
        Category: categoryIds ? {
          set: categoryIds.map((id: string) => ({ id })),
        } : undefined,
        Tag: tagIds ? {
          set: tagIds.map((id: string) => ({ id })),
        } : undefined,
        featuredImageId: featuredImageId !== undefined ? (featuredImageId || null) : undefined,
        SEO: seo ? {
          upsert: {
            create: {
              id: nanoid(),
              title: seo.title,
              description: seo.description,
              keywords: seo.keywords,
              ogTitle: seo.ogTitle,
              ogDescription: seo.ogDescription,
              ogImage: seo.ogImage,
              twitterCard: seo.twitterCard,
              twitterTitle: seo.twitterTitle,
              twitterDescription: seo.twitterDescription,
              twitterImage: seo.twitterImage,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            update: {
              title: seo.title,
              description: seo.description,
              keywords: seo.keywords,
              ogTitle: seo.ogTitle,
              ogDescription: seo.ogDescription,
              ogImage: seo.ogImage,
              twitterCard: seo.twitterCard,
              twitterTitle: seo.twitterTitle,
              twitterDescription: seo.twitterDescription,
              twitterImage: seo.twitterImage,
              updatedAt: new Date(),
            },
          },
        } : undefined,
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

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to update post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Verify post exists and user has permission to delete
    const post = await prisma.post.findUnique({
      where: { id: context.params.id },
      select: { authorId: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.post.delete({
      where: { id: context.params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}