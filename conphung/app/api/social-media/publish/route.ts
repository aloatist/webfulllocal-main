import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { hasPermission } from '@/lib/permissions/check'
import { sendN8nEvent } from '@/lib/integrations/n8n-client'

// POST /api/social-media/publish - Trigger publishing to social media
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
      accountIds, // Array of account IDs to post to
      customContent, // Optional: Custom content per platform
      scheduledAt,
    } = body

    // Validation
    if (!postId || !accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, accountIds (array)' },
        { status: 400 }
      )
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        Media: true,
        Category: true,
        Tag: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get accounts
    const accounts = await prisma.socialMediaAccount.findMany({
      where: {
        id: { in: accountIds },
        isActive: true,
      },
    })

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: 'No active accounts found' },
        { status: 404 }
      )
    }

    const socialMediaPosts = []

    // Create social media post records for each account
    for (const account of accounts) {
      // Get template for platform
      const template = await prisma.socialMediaTemplate.findFirst({
        where: {
          platform: account.platform,
          isDefault: true,
        },
      })

      // Build content from template or custom
      let content = customContent?.[account.platform]

      if (!content && template) {
        // Replace placeholders
        content = template.content
          .replace(/\{\{title\}\}/g, post.title)
          .replace(/\{\{excerpt\}\}/g, post.excerpt || '')
          .replace(/\{\{url\}\}/g, `${process.env.NEXT_PUBLIC_SITE_URL || 'https://conphungtourist.com'}/posts/${post.slug}`)
      }

      if (!content) {
        content = `${post.title}\n\n${post.excerpt || ''}\n\n${process.env.NEXT_PUBLIC_SITE_URL || 'https://conphungtourist.com'}/posts/${post.slug}`
      }

      // Prepare media
      const media = post.Media ? {
        url: post.Media.url,
        alt: post.Media.alt,
        mimeType: post.Media.mimeType,
      } : null

      // Create social media post record
      const socialMediaPost = await prisma.socialMediaPost.create({
        data: {
          id: nanoid(),
          postId: post.id,
          userId: session.user.id,
          accountId: account.id,
          platform: account.platform,
          status: scheduledAt ? 'SCHEDULED' : 'PENDING',
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          content: {
            text: content,
            hashtags: post.Tag.map(t => t.name),
            categories: post.Category.map(c => c.name),
          },
          media: media ? [media] : undefined,
          retryCount: 0,
          maxRetries: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      socialMediaPosts.push(socialMediaPost)

      // If not scheduled, trigger n8n immediately
      if (!scheduledAt) {
        const n8nResult = await sendN8nEvent('social_media.publish', {
          socialMediaPostId: socialMediaPost.id,
          postId: post.id,
          accountId: account.id,
          platform: account.platform,
          content: socialMediaPost.content,
          media: socialMediaPost.media,
        })

        if (!n8nResult.ok) {
          // Mark as failed
          await prisma.socialMediaPost.update({
            where: { id: socialMediaPost.id },
            data: {
              status: 'FAILED',
              error: `n8n webhook failed: ${n8nResult.reason}`,
              updatedAt: new Date(),
            },
          })
        } else {
          // Mark as processing
          await prisma.socialMediaPost.update({
            where: { id: socialMediaPost.id },
            data: {
              status: 'PROCESSING',
              updatedAt: new Date(),
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      posts: socialMediaPosts,
      message: scheduledAt
        ? `Scheduled ${socialMediaPosts.length} posts for ${new Date(scheduledAt).toLocaleString()}`
        : `Publishing to ${socialMediaPosts.length} platforms...`,
    })
  } catch (error) {
    console.error('Error publishing to social media:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
