import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { HeroSection, AboutSection, FeaturedServicesSection, CTASection } from '@/lib/homepage/renderer';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';

export const dynamic = 'force-dynamic';
export const revalidate = 120; // ISR: Revalidate every 120 seconds

export default async function Home() {
  // Fetch homepage settings (published only)
  const homepageResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/public/homepage-settings`,
    {
      next: { revalidate: 120 }, // ISR
    }
  );

  let homepageData = {
    settings: null,
    featuredServices: [],
  };

  if (homepageResponse.ok) {
    homepageData = await homepageResponse.json();
  }

  // Fetch latest posts (fallback)
  const latestPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
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
  });

  return (
    <>
      {/* SEO Schema */}
      <OrganizationSchema />
      
      {/* Dynamic Sections */}
      <HeroSection data={homepageData.settings} />
      <AboutSection data={homepageData.settings} />
      <FeaturedServicesSection services={homepageData.featuredServices} />
      <CTASection data={homepageData.settings} />

      {/* Latest Posts Section (keep existing) */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Bài viết mới nhất
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <article key={post.id} className="bg-card rounded-lg overflow-hidden shadow-md">
                {post.Media?.url && (
                  <div className="relative aspect-video">
                    <Image
                      src={post.Media.url}
                      alt={post.Media.alt || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-primary hover:underline"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

