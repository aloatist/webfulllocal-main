import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

/**
 * Cached function to get post by slug
 * Returns post with category information
 */
export const getPostBySlug = unstable_cache(
    async (slug: string) => {
        const post = await prisma.post.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                excerpt: true,
                status: true,
                createdAt: true,
                updatedAt: true,
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
                    },
                },
                Media: {
                    select: {
                        url: true,
                        alt: true,
                    },
                },
                User: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return post;
    },
    ['post-by-slug'],
    {
        revalidate: 60, // Cache for 60 seconds
        tags: ['posts'],
    }
);

/**
 * Cached function to get post by category slug and post slug
 * Validates that the post belongs to the specified category
 */
export const getPostByCategoryAndSlug = unstable_cache(
    async (categorySlug: string, postSlug: string) => {
        const post = await prisma.post.findFirst({
            where: {
                slug: postSlug,
                Category: {
                    some: {
                        slug: categorySlug,
                    },
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                excerpt: true,
                status: true,
                createdAt: true,
                updatedAt: true,
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
                    },
                },
                Media: {
                    select: {
                        url: true,
                        alt: true,
                    },
                },
                User: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return post;
    },
    ['post-by-category-slug'],
    {
        revalidate: 60,
        tags: ['posts'],
    }
);
