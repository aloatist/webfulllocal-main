import { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { getPublishedTours } from "@/lib/tours/public";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.site_domain,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/tours`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.site_domain}/homestays`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.site_domain}/chinh-sach-bao-mat`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/phuong-thuc-thanh-toan`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/chinh-sach-huy-hoan-tien`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/chinh-sach-quy-dinh-chung`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/du-lich/dao-dua-nguyen-thanh-nam`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/chung-tay-danh-gia`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/ban-do-hanh-chinh-tinh-vinh-long`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamic tours
  const tours = await getPublishedTours({ limit: 1000 });
  const tourPages: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: `${siteConfig.site_domain}/tours/${tour.slug}`,
    lastModified: tour.updatedAt,
    changeFrequency: "weekly" as const,
    priority: tour.isFeatured ? 0.9 : 0.7,
  }));

  // Dynamic homestays
  const homestays = await prisma.homestay.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      updatedAt: true,
      isFeatured: true,
    },
  });
  const homestayPages: MetadataRoute.Sitemap = homestays.map((homestay) => ({
    url: `${siteConfig.site_domain}/homestays/${homestay.slug}`,
    lastModified: homestay.updatedAt,
    changeFrequency: "weekly" as const,
    priority: homestay.isFeatured ? 0.9 : 0.7,
  }));

  // Dynamic posts
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      updatedAt: true,
      featured: true,
      Category: {
        select: {
          slug: true,
        },
      },
    },
  });
  const postPages: MetadataRoute.Sitemap = posts
    .filter((post) => post.Category.length > 0) // Only include posts with categories
    .map((post) => ({
      url: `${siteConfig.site_domain}/${post.Category[0].slug}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.7 : 0.6,
    }));

  return [...staticPages, ...tourPages, ...homestayPages, ...postPages];
}
