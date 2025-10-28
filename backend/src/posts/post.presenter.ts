import { PostEntity } from './post.entity';

export const presentPost = (post: PostEntity) => {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    subtitle: post.subtitle ?? null,
    excerpt: post.excerpt ?? null,
    content: post.content,
    status: post.status,
    heroImageId: post.heroImageId ?? null,
    galleryImageIds: post.galleryImageIds ?? [],
    seo: {
      title: post.seoTitle ?? null,
      description: post.seoDescription ?? null,
      keywords: post.seoKeywords ?? [],
      canonicalUrl: post.canonicalUrl ?? null,
    },
    publishedAt: post.publishedAt ?? null,
    metadata: post.metadata ?? null,
    author: post.author
      ? {
          id: post.author.id,
          fullName: post.author.fullName,
          email: post.author.email,
        }
      : null,
    tags:
      post.tags?.map((tag) => ({
        id: tag.id,
        label: tag.label,
        slug: tag.slug,
        type: tag.type,
      })) ?? [],
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};
