import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import {
  extractVideoId,
  fetchYouTubeMetadata,
  createEditorJSContent,
  generateSlugFromTitle,
  extractTagsFromTitle,
  generateTagSlug,
  isValidYouTubeUrl,
} from '@/lib/posts/youtube-import';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Buffer } from 'buffer';

export const dynamic = 'force-dynamic';

interface ImportResult {
  success: boolean;
  videoUrl: string;
  videoId?: string;
  postId?: string;
  slug?: string;
  error?: string;
}

/**
 * POST /api/admin/posts/import-youtube
 * Import YouTube videos as posts
 */
export async function POST(request: NextRequest) {
  console.log('[YouTube Import] Starting request');
  
  let session;
  try {
    session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('[YouTube Import] Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[YouTube Import] User authenticated:', session.user.id);
  } catch (authError) {
    console.error('[YouTube Import] Auth error:', authError);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await request.json();
      console.log('[YouTube Import] Request body parsed successfully');
    } catch (parseError) {
      console.error('[YouTube Import] Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: parseError instanceof Error ? parseError.message : 'Unknown error' },
        { status: 400 }
      );
    }

    const { urls, categoryId, featuredImageUrl, seo } = body;

    if (!Array.isArray(urls) || urls.length === 0) {
      console.error('[YouTube Import] Invalid URLs array');
      return NextResponse.json(
        { error: 'URLs array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== 'string') {
      console.error('[YouTube Import] Category ID is required');
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    console.log(`[YouTube Import] Starting import of ${urls.length} YouTube URLs with category: ${categoryId}`);

    // Validate all URLs first
    const invalidUrls = urls.filter((url) => !isValidYouTubeUrl(url));
    if (invalidUrls.length > 0) {
      console.error('[YouTube Import] Invalid URLs found:', invalidUrls);
      return NextResponse.json(
        { error: `Invalid YouTube URLs: ${invalidUrls.join(', ')}` },
        { status: 400 }
      );
    }

    // Get the selected category
    console.log('[YouTube Import] Getting category...');
    let videoCategory;
    try {
      videoCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!videoCategory) {
        console.error('[YouTube Import] Category not found:', categoryId);
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      console.log('[YouTube Import] Category found:', { id: videoCategory.id, name: videoCategory.name, slug: videoCategory.slug });
    } catch (categoryError) {
      console.error('[YouTube Import] Error getting category:', categoryError);
      return NextResponse.json(
        { 
          error: 'Failed to get category',
          details: categoryError instanceof Error ? categoryError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    const results: ImportResult[] = [];

    // Process each URL
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`[YouTube Import] Processing URL ${i + 1}/${urls.length}: ${url}`);
      
      try {
        const videoId = extractVideoId(url);
        if (!videoId) {
          console.error(`[YouTube Import] Invalid video ID for URL: ${url}`);
          results.push({
            success: false,
            videoUrl: url,
            error: 'Invalid YouTube URL format',
          });
          continue;
        }

        console.log(`[YouTube Import] Video ID extracted: ${videoId}`);

        // Check if post with this slug already exists
        console.log(`[YouTube Import] Fetching metadata for video ${videoId}...`);
        const metadata = await fetchYouTubeMetadata(url);
        if (!metadata) {
          console.error(`[YouTube Import] Failed to fetch metadata for video ${videoId}`);
          results.push({
            success: false,
            videoUrl: url,
            videoId,
            error: 'Failed to fetch video metadata from YouTube',
          });
          continue;
        }

        console.log(`[YouTube Import] Metadata fetched: ${metadata.title}`);

        // Generate unique slug
        let slug = generateSlugFromTitle(metadata.title);
        
        // If slug is empty, use video ID as fallback
        if (!slug || slug.trim().length === 0) {
          slug = `video-${videoId}`;
        }
        
        let slugCounter = 1;
        let existingPost = await prisma.post.findUnique({
          where: { slug },
        });

        // If slug exists, append number suffix
        while (existingPost) {
          const newSlug = `${slug}-${slugCounter}`;
          existingPost = await prisma.post.findUnique({
            where: { slug: newSlug },
          });
          if (!existingPost) {
            slug = newSlug;
            break;
          }
          slugCounter++;
        }

        // Create EditorJS content
        let content: string;
        try {
          content = createEditorJSContent(url, metadata.description);
        } catch (contentError) {
          results.push({
            success: false,
            videoUrl: url,
            videoId,
            error: `Failed to create content: ${contentError instanceof Error ? contentError.message : 'Unknown error'}`,
          });
          continue;
        }

        // Extract tags from title
        const tagNames = extractTagsFromTitle(metadata.title);
        const tags: { id: string; name: string }[] = [];

        // Get or create tags
        for (const tagName of tagNames) {
          if (!tagName || tagName.trim().length === 0) continue;
          
          const tagSlug = generateTagSlug(tagName);
          if (!tagSlug || tagSlug.length === 0) continue;

          try {
            let tag = await prisma.tag.findFirst({
              where: { 
                OR: [
                  { slug: tagSlug },
                  { name: tagName }
                ]
              },
            });

            if (!tag) {
              tag = await prisma.tag.create({
                data: {
                  id: nanoid(),
                  name: tagName,
                  slug: tagSlug,
                },
              });
            }
            tags.push({ id: tag.id, name: tag.name });
          } catch (tagError) {
            // If tag creation fails (e.g., duplicate), try to find existing
            console.error(`Error creating tag ${tagName}:`, tagError);
            const existingTag = await prisma.tag.findFirst({
              where: { 
                OR: [
                  { slug: tagSlug },
                  { name: tagName }
                ]
              },
            });
            if (existingTag) {
              tags.push({ id: existingTag.id, name: existingTag.name });
            }
          }
        }

        // Handle featured image
        let featuredImageId: string | undefined;
        const imageUrl = featuredImageUrl || metadata.thumbnail_url;
        
        if (imageUrl) {
          let imageProcessed = false;
          try {
            console.log(`[YouTube Import] Processing featured image: ${imageUrl}`);

            const imageResponse = await fetch(imageUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ConPhungTourist/1.0)',
                Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
              },
            });

            if (imageResponse.ok) {
              const arrayBuffer = await imageResponse.arrayBuffer();
              if (arrayBuffer.byteLength > 0) {
                const buffer = Buffer.from(arrayBuffer);

                const uploadResult = await uploadToCloudinary(buffer, {
                  folder: 'posts',
                  filename: `youtube-${videoId}-${Date.now()}`,
                });

                const media = await prisma.media.create({
                  data: {
                    id: nanoid(),
                    filename: uploadResult.original_filename || `youtube-${videoId}.jpg`,
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                    mimeType: imageResponse.headers.get('content-type') || 'image/jpeg',
                    size: buffer.length,
                    alt: metadata.title,
                    userId: session.user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                });

                featuredImageId = media.id;
                imageProcessed = true;
                console.log(`[YouTube Import] Featured image created: ${media.id}`);
              } else {
                console.warn('[YouTube Import] Downloaded image has zero length, skipping Cloudinary upload');
              }
            } else {
              console.warn(`[YouTube Import] Unable to download image. Status: ${imageResponse.status} ${imageResponse.statusText}`);
            }
          } catch (imageError) {
            console.error('[YouTube Import] Error processing featured image:', imageError);
          }

          if (!imageProcessed) {
            try {
              const fallbackMedia = await prisma.media.create({
                data: {
                  id: nanoid(),
                  filename: `youtube-${videoId}-external.jpg`,
                  url: imageUrl,
                  publicId: `external-youtube-${videoId}-${Date.now()}`,
                  mimeType: 'image/jpeg',
                  size: 0,
                  alt: metadata.title,
                  userId: session.user.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              });
              featuredImageId = fallbackMedia.id;
              imageProcessed = true;
              console.log('[YouTube Import] Fallback external image recorded:', fallbackMedia.id);
            } catch (fallbackError) {
              console.error('[YouTube Import] Failed to create fallback media entry:', fallbackError);
            }
          }

          // Connection to the postData will happen after postData is created
        }

        // Prepare SEO data
        const seoData: any = {};
        if (seo?.title || metadata.title) {
          seoData.title = seo?.title || metadata.title;
        }
        if (seo?.description || metadata.description) {
          seoData.description = seo?.description || metadata.description;
        }
        if (seo?.keywords) {
          seoData.keywords = seo.keywords;
        }

        // Create post
        console.log(`[YouTube Import] Creating post with slug: ${slug}`);
        const postId = nanoid();
        console.log(`[YouTube Import] Generated post ID: ${postId}`);
        
        const postData: any = {
          id: postId,
          title: metadata.title,
          slug,
          content,
          excerpt: metadata.description?.substring(0, 200) || metadata.title,
          status: 'DRAFT',
          authorId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          Category: {
            connect: { id: videoCategory.id },
          },
        };

        // Connect featured image if available via scalar field
        if (featuredImageId) {
          postData.featuredImageId = featuredImageId;
          console.log('[YouTube Import] Setting featuredImageId on post:', featuredImageId);
        }

        // Only connect tags if we have any
        if (tags.length > 0) {
          postData.Tag = {
            connect: tags.map((tag) => ({ id: tag.id })),
          };
          console.log(`[YouTube Import] Connecting ${tags.length} tags`);
        }

        // Create SEO if we have any SEO data
        if (Object.keys(seoData).length > 0) {
          postData.SEO = {
            create: {
              id: nanoid(),
              ...seoData,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };
          console.log(`[YouTube Import] Creating SEO record`);
        }

        try {
          const post = await prisma.post.create({
            data: postData,
          });

          console.log(`[YouTube Import] Post created successfully: ${post.id}`);

          results.push({
            success: true,
            videoUrl: url,
            videoId,
            postId: post.id,
            slug: post.slug,
          });
        } catch (postError) {
          console.error(`[YouTube Import] Error creating post:`, postError);
          throw new Error(`Failed to create post: ${postError instanceof Error ? postError.message : 'Unknown error'}`);
        }
      } catch (error) {
        console.error(`Error processing video ${url}:`, error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          videoUrl: url,
        });
        results.push({
          success: false,
          videoUrl: url,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      message: `Imported ${successCount} videos, ${failureCount} failed`,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failed: failureCount,
      },
    });
  } catch (error) {
    console.error('[YouTube Import] Fatal error:', error);
    console.error('[YouTube Import] Error type:', error?.constructor?.name);
    console.error('[YouTube Import] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[YouTube Import] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Log more details if available
    if (error && typeof error === 'object') {
      console.error('[YouTube Import] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error?.constructor?.name || 'Unknown',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
