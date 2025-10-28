/**
 * SEO Metadata Generators for Next.js 14
 * Used in page.tsx files for dynamic metadata
 */

import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
}

const SITE_NAME = 'Khu Du Lịch Cồn Phụng';
const SITE_URL = 'https://conphungtourist.com/';
const DEFAULT_IMAGE = '/og-image.jpg';

/**
 * Generate metadata for pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_IMAGE,
    url = SITE_URL,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noIndex = false,
  } = config;

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'vi_VN',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@conphung',
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for Tour pages
 */
export function generateTourMetadata(tour: any): Metadata {
  const keywords = [
    'tour Cồn Phụng',
    'du lịch Bến Tre',
    tour.title,
    ...(tour.categories?.map((cat: any) => cat.name) || []),
    ...(tour.seoKeywords || []),
  ];

  return generateMetadata({
    title: tour.seoTitle || tour.title,
    description: tour.seoDescription || tour.summary || `Khám phá ${tour.title} tại Cồn Phụng`,
    keywords,
    image: tour.heroImageUrl,
    url: `${SITE_URL}/tours/${tour.slug}`,
    type: 'website',
  });
}

/**
 * Generate metadata for Homestay pages
 */
export function generateHomestayMetadata(homestay: any): Metadata {
  const keywords = [
    'homestay Cồn Phụng',
    'lưu trú Bến Tre',
    homestay.title,
    homestay.city,
    ...(homestay.seoKeywords || []),
  ];

  return generateMetadata({
    title: homestay.seoTitle || homestay.title,
    description: homestay.seoDescription || homestay.summary || `Đặt phòng ${homestay.title}`,
    keywords,
    image: homestay.heroImageUrl,
    url: `${SITE_URL}/homestays/${homestay.slug}`,
    type: 'website',
  });
}

/**
 * Generate metadata for Blog/News posts
 */
export function generatePostMetadata(post: any): Metadata {
  const keywords = [
    ...(post.tags?.map((tag: any) => tag.name) || []),
    ...(post.categories?.map((cat: any) => cat.name) || []),
  ];

  return generateMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt || '',
    keywords,
    image: post.featuredImage?.url,
    url: `${SITE_URL}/news/${post.slug}`,
    type: 'article',
    publishedTime: post.createdAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.author?.name,
  });
}

/**
 * Generate metadata for listing pages
 */
export function generateListingMetadata(
  type: 'tours' | 'homestays' | 'news',
  filters?: Record<string, any>
): Metadata {
  const titles = {
    tours: 'Các Tour Du Lịch',
    homestays: 'Homestay & Lưu Trú',
    news: 'Tin Tức & Blog',
  };

  const descriptions = {
    tours: 'Khám phá các tour du lịch sinh thái tại Cồn Phụng, Bến Tre. Đặt tour trực tuyến với giá tốt nhất.',
    homestays: 'Tìm và đặt homestay, nhà nghỉ tại Cồn Phụng. Không gian yên tĩnh, gần gũi thiên nhiên.',
    news: 'Cập nhật tin tức mới nhất về du lịch Cồn Phụng, kinh nghiệm du lịch, và các sự kiện đặc biệt.',
  };

  let title = titles[type];
  let description = descriptions[type];

  // Add filter info to title if present
  if (filters) {
    if (filters.category) {
      title = `${filters.category} - ${title}`;
    }
    if (filters.city) {
      title = `${title} tại ${filters.city}`;
    }
  }

  return generateMetadata({
    title,
    description,
    keywords: [type, 'Cồn Phụng', 'Bến Tre', 'du lịch'],
    url: `${SITE_URL}/${type}`,
  });
}

/**
 * Default homepage metadata
 */
export const homeMetadata: Metadata = generateMetadata({
  title: 'Khu Du Lịch Cồn Phụng - Chính Chủ | Đạo Dừa Bến Tre',
  description:
    'Khu du lịch sinh thái Cồn Phụng chính chủ tại Bến Tre. Khám phá công trình Đạo Dừa độc đáo, tour du lịch, homestay giữa vườn dừa. Đặt tour trực tuyến giá tốt.',
  keywords: [
    'Cồn Phụng',
    'du lịch Bến Tre',
    'Đạo Dừa',
    'tour Cồn Phụng',
    'homestay Bến Tre',
    'du lịch sinh thái',
    'vườn dừa',
  ],
});
