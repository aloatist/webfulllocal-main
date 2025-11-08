import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractFacebookPostId } from '@/lib/integrations/facebook-utils';

export const dynamic = 'force-dynamic';

/**
 * Check if a Facebook post already exists in the database
 * POST /api/integrations/facebook/check-duplicate
 */
export async function POST(request: NextRequest) {
  try {
    const { facebookPostId, permalink } = await request.json();

    if (!facebookPostId && !permalink) {
      return NextResponse.json(
        { error: 'facebookPostId or permalink is required' },
        { status: 400 }
      );
    }

    // Extract Facebook post ID
    const postId = facebookPostId || extractFacebookPostId(permalink || '');

    // Check if post exists by searching in SEO structuredData or by content similarity
    // For now, we'll search by checking if the permalink is mentioned in any post
    // In the future, we can add a dedicated facebookPostId field to Post model
    
    // Option 1: Check if Facebook post ID is stored in SEO structuredData
    // Note: Prisma JSON queries are limited, so we'll search in content/excerpt for now
    // In production, consider adding a dedicated facebookPostId field to Post model

    // Option 2: If permalink is provided, check if it's in the content
    if (permalink) {
      const postsWithPermalink = await prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: permalink } },
            { excerpt: { contains: permalink } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
        take: 1,
      });

      if (postsWithPermalink.length > 0) {
        return NextResponse.json({
          duplicate: true,
          post: postsWithPermalink[0],
        });
      }
    }

    // Option 3: Check SocialMediaPost table (reverse lookup)
    const socialMediaPosts = await prisma.socialMediaPost.findMany({
      where: {
        platform: 'FACEBOOK',
        platformPostId: postId,
      },
      include: {
        Post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      take: 1,
    });

    if (socialMediaPosts.length > 0 && socialMediaPosts[0].Post) {
      return NextResponse.json({
        duplicate: true,
        post: socialMediaPosts[0].Post,
      });
    }

    return NextResponse.json({
      duplicate: false,
    });
  } catch (error) {
    console.error('Failed to check duplicate:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Get duplicate status
 * GET /api/integrations/facebook/check-duplicate?facebookPostId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const facebookPostId = searchParams.get('facebookPostId');
    const permalink = searchParams.get('permalink');

    if (!facebookPostId && !permalink) {
      return NextResponse.json(
        { error: 'facebookPostId or permalink query parameter is required' },
        { status: 400 }
      );
    }

    const postId = facebookPostId || extractFacebookPostId(permalink || '');

    // Check duplicates (same logic as POST)

    if (permalink) {
      const postsWithPermalink = await prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: permalink } },
            { excerpt: { contains: permalink } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
        take: 1,
      });

      if (postsWithPermalink.length > 0) {
        return NextResponse.json({
          duplicate: true,
          post: postsWithPermalink[0],
        });
      }
    }

    return NextResponse.json({
      duplicate: false,
    });
  } catch (error) {
    console.error('Failed to check duplicate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
