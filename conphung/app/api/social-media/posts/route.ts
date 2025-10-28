import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { hasPermission } from '@/lib/permissions/check'

// GET /api/social-media/posts - List all social media posts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canView = await hasPermission('social_media.view')
  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (postId) where.postId = postId
    if (platform) where.platform = platform
    if (status) where.status = status

    const [posts, total] = await Promise.all([
      prisma.socialMediaPost.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          account: {
            select: {
              id: true,
              platform: true,
              accountName: true,
            },
          },
          Post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          User: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.socialMediaPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching social media posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/social-media/posts - Create new social media post
export async function POST(request: NextRequest) {
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
      postId,
      accountId,
      platform,
      content,
      media,
      scheduledAt,
    } = body

    // Validation
    if (!postId || !accountId || !platform || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, accountId, platform, content' },
        { status: 400 }
      )
    }

    // Verify account exists
    const account = await prisma.socialMediaAccount.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Social media account not found' },
        { status: 404 }
      )
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const socialMediaPost = await prisma.socialMediaPost.create({
      data: {
        id: nanoid(),
        postId,
        userId: session.user.id,
        accountId,
        platform,
        status: scheduledAt ? 'SCHEDULED' : 'PENDING',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        content,
        media: media || null,
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        account: {
          select: {
            id: true,
            platform: true,
            accountName: true,
          },
        },
        Post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({ post: socialMediaPost }, { status: 201 })
  } catch (error) {
    console.error('Error creating social media post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
