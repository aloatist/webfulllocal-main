import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

// POST /api/social-media/webhooks - Receive callbacks from n8n
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      socialMediaPostId,
      status, // 'success' or 'error'
      platformPostId,
      platformUrl,
      error: errorMsg,
      errorDetails,
    } = body

    // Validation
    if (!socialMediaPostId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: socialMediaPostId, status' },
        { status: 400 }
      )
    }

    // Find the social media post
    const post = await prisma.socialMediaPost.findUnique({
      where: { id: socialMediaPostId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Social media post not found' },
        { status: 404 }
      )
    }

    // Update based on status
    if (status === 'success') {
      await prisma.socialMediaPost.update({
        where: { id: socialMediaPostId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          platformPostId: platformPostId || null,
          platformUrl: platformUrl || null,
          error: null,
          errorDetails: undefined,
          updatedAt: new Date(),
        },
      })

      // Log success
      await prisma.socialMediaSync.create({
        data: {
          id: nanoid(),
          operation: 'post_published',
          platform: post.platform,
          status: 'success',
          payload: {
            socialMediaPostId,
            postId: post.postId,
            accountId: post.accountId,
          },
          response: {
            platformPostId,
            platformUrl,
          },
          createdAt: new Date(),
        },
      })
    } else {
      // Increment retry count
      const newRetryCount = post.retryCount + 1
      const shouldRetry = newRetryCount < post.maxRetries

      await prisma.socialMediaPost.update({
        where: { id: socialMediaPostId },
        data: {
          status: shouldRetry ? 'PENDING' : 'FAILED',
          error: errorMsg || 'Unknown error',
          errorDetails: errorDetails || null,
          retryCount: newRetryCount,
          updatedAt: new Date(),
        },
      })

      // Log failure
      await prisma.socialMediaSync.create({
        data: {
          id: nanoid(),
          operation: 'post_failed',
          platform: post.platform,
          status: 'failed',
          payload: {
            socialMediaPostId,
            postId: post.postId,
            accountId: post.accountId,
            retryCount: newRetryCount,
          },
          response: undefined,
          error: errorMsg || 'Unknown error',
          createdAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
