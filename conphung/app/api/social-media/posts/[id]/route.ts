import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions/check'

interface Context {
  params: {
    id: string
  }
}

// GET /api/social-media/posts/[id]
export async function GET(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canView = await hasPermission('social_media.view')
  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const post = await prisma.socialMediaPost.findUnique({
      where: { id: context.params.id },
      include: {
        account: true,
        Post: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/social-media/posts/[id] - Update post
export async function PATCH(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canPost = await hasPermission('social_media.post')
  if (!canPost) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      status,
      scheduledAt,
      publishedAt,
      platformPostId,
      platformUrl,
      content,
      media,
      error: errorMsg,
      errorDetails,
    } = body

    const post = await prisma.socialMediaPost.findUnique({
      where: { id: context.params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (status !== undefined) updateData.status = status
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null
    if (platformPostId !== undefined) updateData.platformPostId = platformPostId
    if (platformUrl !== undefined) updateData.platformUrl = platformUrl
    if (content !== undefined) updateData.content = content
    if (media !== undefined) updateData.media = media
    if (errorMsg !== undefined) updateData.error = errorMsg
    if (errorDetails !== undefined) updateData.errorDetails = errorDetails

    const updated = await prisma.socialMediaPost.update({
      where: { id: context.params.id },
      data: updateData,
      include: {
        account: true,
        Post: true,
      },
    })

    return NextResponse.json({ post: updated })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/social-media/posts/[id]
export async function DELETE(request: NextRequest, context: Context) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canDelete = await hasPermission('social_media.delete')
  if (!canDelete) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const post = await prisma.socialMediaPost.findUnique({
      where: { id: context.params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await prisma.socialMediaPost.delete({
      where: { id: context.params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
