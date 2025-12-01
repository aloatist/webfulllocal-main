/**
 * Dynamic Catch-All Route Handler
 * 
 * This route handles:
 * 1. Legacy redirects: /posts/[slug] -> /[category]/[slug]
 * 2. New post URLs: /[category]/[slug]
 * 3. Theme pages fallback
 */

import { loadThemePage } from '@/lib/theme/loader';
import { convertPageComponent } from '@/lib/theme/pages-router-adapter';
import { notFound, redirect } from 'next/navigation';
import { getPostBySlug, getPostByCategoryAndSlug } from '@/lib/posts/get-post';
import { PostDetail } from '@/components/posts/post-detail';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import type { Metadata } from 'next';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface PageProps {
  params: {
    segments?: string[];
  };
  searchParams?: {
    preview?: string;
  };
}

/**
 * Generate metadata for posts
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const segments = params.segments || [];

  // Case 1: Legacy /posts/[slug]
  if (segments.length === 2 && segments[0] === 'posts') {
    const post = await getPostBySlug(segments[1]);
    if (post && post.Category.length > 0) {
      return {
        title: post.title,
        description: post.excerpt ?? undefined,
        alternates: {
          canonical: `/${post.Category[0].slug}/${post.slug}`,
        },
      };
    }
  }

  // Case 2: New /[category]/[slug]
  if (segments.length === 2) {
    const post = await getPostByCategoryAndSlug(segments[0], segments[1]);
    if (post && post.status === 'PUBLISHED') {
      return {
        title: post.title,
        description: post.excerpt ?? undefined,
        alternates: {
          canonical: `/${segments[0]}/${segments[1]}`,
        },
        robots: 'index, follow',
      };
    }
  }

  // Default metadata for theme pages
  return {
    robots: 'index, follow',
  };
}

export default async function DynamicThemePage({ params, searchParams }: PageProps) {
  const segments = params.segments || [];
  const pagePath = segments.length > 0 ? `/${segments.join('/')}` : '/';

  // IMPORTANT: Skip Next.js internal paths
  if (
    pagePath.startsWith('/_next/') ||
    pagePath.startsWith('/api/') ||
    pagePath.startsWith('/admin/') ||
    pagePath.startsWith('/static/') ||
    pagePath.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)
  ) {
    notFound();
  }

  // ===== CASE 1: Legacy Redirect /posts/[slug] -> /[category]/[slug] =====
  if (segments.length === 2 && segments[0] === 'posts') {
    const postSlug = segments[1];
    const post = await getPostBySlug(postSlug);

    if (post && post.Category.length > 0) {
      const categorySlug = post.Category[0].slug;
      // 301 Permanent Redirect to new URL structure
      redirect(`/${categorySlug}/${postSlug}`);
    }

    // If no post found, fall through to theme page or 404
    // If a legacy post URL was requested but no post found, it's a 404.
    notFound();
  }

  // ===== CASE 2: New URL Structure /[category]/[slug] =====
  if (segments.length === 2) {
    const [categorySlug, postSlug] = segments;
    const post = await getPostByCategoryAndSlug(categorySlug, postSlug);

    if (!post) {
      // If a 2-segment path is requested and no post is found, it's a 404.
      notFound();
    }

    // Check if user has permission to preview
    const session = await getServerSession(authOptions);
    const previewActive = searchParams?.preview === 'true';
    const previewAllowed = Boolean(previewActive && session);

    // Only show published posts or allow preview for authenticated users
    if (post.status === 'PUBLISHED' || previewAllowed) {
      // Fetch related posts
      const categoryIds = post.Category.map((c) => c.id);
      const tagIds = post.Tag.map((t) => t.id);

      const relatedPosts = await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          id: { not: post.id },
          OR: [
            { Category: { some: { id: { in: categoryIds } } } },
            { Tag: { some: { id: { in: tagIds } } } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          createdAt: true,
          Media: {
            select: {
              url: true,
              alt: true,
            },
          },
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
      });

      const showPreviewBanner = previewAllowed && post.status !== 'PUBLISHED';

      return (
        <PostDetail
          post={post}
          relatedPosts={relatedPosts}
          categorySlug={categorySlug}
          showPreviewBanner={showPreviewBanner}
        />
      );
    }
    // If post is found but not published and preview is not allowed, it's a 404.
    notFound();
  }

  // ===== CASE 3: Theme Pages Fallback =====
  // Only try theme loader if it's not a 2-segment path (to avoid conflicts with posts)
  if (segments.length !== 2) {
    try {
      // Load page from active theme
      const pageData = await loadThemePage(pagePath);

      if (!pageData) {
        notFound();
      }

      // Convert Pages Router component to App Router compatible
      const { Component: PageComponent, getProps } = convertPageComponent(pageData);

      if (!PageComponent) {
        notFound();
      }

      // Get props if adapter provides them
      let pageProps = { params };

      if (getProps) {
        try {
          const props = await getProps({ params });
          pageProps = { ...pageProps, ...props };
        } catch (error) {
          console.error('Error getting page props:', error);
        }
      }

      // Render page with props
      return <PageComponent {...pageProps} />;
    } catch (error) {
      console.error('Error rendering theme page:', error);
      notFound();
    }
  }

  // If we reach here, nothing matched - return 404
  notFound();
}

// Support getStaticPaths for dynamic routes
export async function generateStaticParams() {
  // This can be populated from theme pages if needed
  // For now, we'll use dynamic rendering
  return [];
}
