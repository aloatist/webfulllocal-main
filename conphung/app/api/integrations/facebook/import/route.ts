import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import {
  extractHashtags,
  textToMarkdown,
  generateSlug,
  generateExcerpt,
  validateFacebookPost,
  generateSEOMetadata,
  extractFacebookPostId,
} from '@/lib/integrations/facebook-utils';
import { slugify } from '@/lib/tours/utils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { ensureIntegrationChannel, logChannelSyncEvent } from '@/lib/integrations/logger';
import { SyncDirection, SyncStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * Check if request is authorized (API key or session)
 */
function isAuthorized(request: Request): boolean {
  // Check for API key in header
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  const expectedApiKey = process.env.NEXTJS_API_KEY || process.env.N8N_WEBHOOK_SECRET;
  
  if (apiKey && expectedApiKey && apiKey === expectedApiKey) {
    return true;
  }
  
  // For development, allow session-based auth
  return false; // Will check session in the handler
}

/**
 * Download image from URL and upload to Cloudinary
 */
async function uploadImageFromUrl(imageUrl: string, userId: string): Promise<{ id: string; url: string } | null> {
  try {
    // Download image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Get content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    
    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: 'facebook-imports',
      filename: `fb-${Date.now()}.${extension}`,
    });
    
    // Save to database
    const media = await prisma.media.create({
      data: {
        id: nanoid(),
        filename: `facebook-${Date.now()}.${extension}`,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        mimeType: contentType,
        size: buffer.length,
        width: uploadResult.width || null,
        height: uploadResult.height || null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    return { id: media.id, url: media.url };
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
}

/**
 * Get or create tags from hashtags
 */
async function getOrCreateTags(hashtags: string[]): Promise<string[]> {
  const tagIds: string[] = [];
  
  for (const tagName of hashtags) {
    try {
      // Try to find existing tag
      let tag = await prisma.tag.findFirst({
        where: {
          OR: [
            { name: { equals: tagName, mode: 'insensitive' } },
            { slug: { equals: slugify(tagName), mode: 'insensitive' } },
          ],
        },
      });
      
      // Create if not exists
      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            id: nanoid(),
            name: tagName,
            slug: slugify(tagName) || tagName.toLowerCase().replace(/\s+/g, '-'),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
      
      tagIds.push(tag.id);
    } catch (error) {
      console.error(`Failed to get/create tag "${tagName}":`, error);
      // Continue with other tags
    }
  }
  
  return tagIds;
}

/**
 * Import Facebook post to Next.js
 * POST /api/integrations/facebook/import
 */
export async function POST(request: NextRequest) {
  // Check authorization
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  const expectedApiKey = process.env.NEXTJS_API_KEY || process.env.N8N_WEBHOOK_SECRET;
  
  let userId: string | null = null;
  
  if (apiKey && expectedApiKey && apiKey === expectedApiKey) {
    // API key auth - use a system user or default user
    const systemUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
    });
    userId = systemUser?.id || null;
  } else {
    // Session-based auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    userId = session.user.id;
  }
  
  if (!userId) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const {
      facebookPost,
      status = 'DRAFT',
      skipDuplicateCheck = false,
    } = body;
    
    // Validate Facebook post
    const validation = validateFacebookPost(facebookPost);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Check for duplicates
    if (!skipDuplicateCheck) {
      const duplicateCheck = await fetch(
        `${request.nextUrl.origin}/api/integrations/facebook/check-duplicate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            facebookPostId: facebookPost.id,
            permalink: facebookPost.permalink_url,
          }),
        }
      );
      
      if (duplicateCheck.ok) {
        const duplicateResult = await duplicateCheck.json();
        if (duplicateResult.duplicate) {
          return NextResponse.json(
            { 
              error: 'Post already exists',
              duplicate: true,
              existingPost: duplicateResult.post,
            },
            { status: 409 }
          );
        }
      }
    }
    
    // Extract content
    const originalText = facebookPost.message || facebookPost.story || '';
    const markdownContent = textToMarkdown(originalText);
    const hashtags = extractHashtags(originalText);
    
    // Generate title (first line or first 100 chars)
    const title = originalText
      .split('\n')[0]
      .substring(0, 100)
      .trim() || 'Facebook Post';
    
    // Generate slug
    const baseSlug = generateSlug(title);
    const existingPost = await prisma.post.findUnique({
      where: { slug: baseSlug },
      select: { id: true },
    });
    
    let finalSlug = baseSlug;
    if (existingPost) {
      let counter = 1;
      while (await prisma.post.findUnique({ where: { slug: `${baseSlug}-${counter}` } })) {
        counter++;
      }
      finalSlug = `${baseSlug}-${counter}`;
    }
    
    // Process images
    const imageUrls: string[] = [];
    if (facebookPost.full_picture) {
      imageUrls.push(facebookPost.full_picture);
    }
    if (facebookPost.attachments?.data) {
      for (const attachment of facebookPost.attachments.data) {
        if (attachment.media?.image?.src) {
          imageUrls.push(attachment.media.image.src);
        }
        if (attachment.subattachments?.data) {
          for (const sub of attachment.subattachments.data) {
            if (sub.media?.image?.src) {
              imageUrls.push(sub.media.image.src);
            }
          }
        }
      }
    }
    
    // Upload images (limit to first 10 to avoid timeout)
    const uploadedImages = [];
    for (const imageUrl of imageUrls.slice(0, 10)) {
      const uploaded = await uploadImageFromUrl(imageUrl, userId);
      if (uploaded) {
        uploadedImages.push(uploaded);
      }
    }
    
    // Get or create tags
    const tagIds = await getOrCreateTags(hashtags);
    
    // Generate excerpt and SEO
    const excerpt = generateExcerpt(markdownContent);
    const seoMetadata = generateSEOMetadata(facebookPost, markdownContent);
    
    // Create post
    const post = await prisma.post.create({
      data: {
        id: nanoid(),
        title,
        slug: finalSlug,
        content: markdownContent,
        excerpt,
        featured: false,
        status: status as any,
        authorId: userId,
        createdAt: new Date(facebookPost.created_time || Date.now()),
        updatedAt: new Date(),
        featuredImageId: uploadedImages[0]?.id || null,
        Tag: {
          connect: tagIds.map(id => ({ id })),
        },
        SEO: {
          create: {
            id: nanoid(),
            title: seoMetadata.title,
            description: seoMetadata.description,
            keywords: seoMetadata.keywords || undefined,
            ogTitle: seoMetadata.ogTitle,
            ogDescription: seoMetadata.ogDescription,
            ogImage: seoMetadata.ogImage || undefined,
            structuredData: {
              facebookPostId: extractFacebookPostId(facebookPost.id),
              facebookPermalink: facebookPost.permalink_url,
              importedAt: new Date().toISOString(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
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
    });
    
    // Log sync event
    try {
      const channel = await ensureIntegrationChannel({
        name: 'facebook-import',
        provider: 'facebook',
        endpoint: 'import',
        config: {},
      });
      
      await logChannelSyncEvent({
        channelId: channel.id,
        direction: SyncDirection.INBOUND,
        operation: 'facebook.import',
        status: SyncStatus.SUCCESS,
        message: `Imported Facebook post: ${post.id}`,
        payload: {
          facebookPostId: facebookPost.id,
          postId: post.id,
          title: post.title,
        },
        markSynced: true,
      });
    } catch (logError) {
      console.error('Failed to log sync event:', logError);
      // Don't fail the request if logging fails
    }
    
    return NextResponse.json({
      success: true,
      post,
      uploadedImages: uploadedImages.length,
      tagsCreated: tagIds.length,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Failed to import Facebook post:', error);
    
    // Log error
    try {
      const channel = await ensureIntegrationChannel({
        name: 'facebook-import',
        provider: 'facebook',
        endpoint: 'import',
        config: {},
      });
      
      await logChannelSyncEvent({
        channelId: channel.id,
        direction: SyncDirection.INBOUND,
        operation: 'facebook.import',
        status: SyncStatus.FAILED,
        message: `Failed to import Facebook post: ${error instanceof Error ? error.message : String(error)}`,
        payload: {
          error: error instanceof Error ? error.message : String(error),
        },
        markSynced: false,
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


