/**
 * Dynamic Sitemap Generator
 * Tạo sitemap động từ database
 */

import { prisma } from '@/lib/prisma';

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://conphungtourist.com/';

/**
 * Generate sitemap for tours
 */
export async function getToursSitemap(): Promise<SitemapEntry[]> {
  const tours = await prisma.tour.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  return tours.map((tour) => ({
    url: `${BASE_URL}/tours/${tour.slug}`,
    lastModified: tour.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}

/**
 * Generate sitemap for homestays
 */
export async function getHomestaysSitemap(): Promise<SitemapEntry[]> {
  const homestays = await prisma.homestay.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  return homestays.map((homestay) => ({
    url: `${BASE_URL}/homestays/${homestay.slug}`,
    lastModified: homestay.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}

/**
 * Generate sitemap for blog posts
 */
export async function getPostsSitemap(): Promise<SitemapEntry[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  return posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
}

/**
 * Generate sitemap for static pages
 */
export function getStaticPagesSitemap(): SitemapEntry[] {
  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/tours', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/homestays', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/posts', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/lien-he', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/chinh-sach-bao-mat', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/chinh-sach-huy-hoan-tien', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/chinh-sach-quy-dinh-chung', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/phuong-thuc-thanh-toan', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  return staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

/**
 * Generate complete sitemap
 */
export async function generateSitemap(): Promise<SitemapEntry[]> {
  const [tours, homestays, posts, staticPages] = await Promise.all([
    getToursSitemap(),
    getHomestaysSitemap(),
    getPostsSitemap(),
    Promise.resolve(getStaticPagesSitemap()),
  ]);

  return [...staticPages, ...tours, ...homestays, ...posts];
}

/**
 * Generate sitemap XML
 */
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>` : ''}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
    ${entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `# *
User-agent: *
Allow: /

# Disallow admin pages
User-agent: *
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;
}
