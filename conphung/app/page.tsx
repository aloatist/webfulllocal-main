import { Section, Container } from "@/components/craft"; 
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { ImageWrapper } from '@/components/ui/image-wrapper';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in';
import { HeroSection } from '@/components/home/hero-section';
import { HeroSectionEnhanced } from '@/components/home/hero-section-enhanced';
import { HeroEcological } from '@/components/home/hero-template-ecological';
import { HeroModern } from '@/components/home/hero-template-modern';
import { HeroTraditional } from '@/components/home/hero-template-traditional';
import { HeroGeometric } from '@/components/home/hero-template-geometric';
import { TemplateWrapper } from '@/components/home/template-wrapper';
import { getActiveTemplateServer } from '@/lib/templates/template-loader';
import { TemplateType } from '@/lib/templates/types';
import { ValuePropositionSection } from '@/components/home/value-proposition-section';
import { ValuePropositionModern } from '@/components/home/value-proposition-modern';
import { HeroModernRedesigned } from '@/components/home/hero-modern-redesigned';
import { PricingSnapshotSection } from '@/components/home/pricing-snapshot-section';
import { PricingSnapshotModern } from '@/components/home/pricing-snapshot-modern';
import { SocialProofSection } from '@/components/home/social-proof-section';
import { SocialProofModern } from '@/components/home/social-proof-modern';
import { CertificatesSectionCompact } from '@/components/home/certificates-section-compact';
import { PolicyLinksSectionCompact } from '@/components/home/policy-links-section-compact';
import { LazySectionWrapper } from '@/components/home/lazy-section-wrapper';
import { MobileStickyCTA } from '@/components/home/mobile-sticky-cta';
import { PromotionSection } from '@/components/home/promotion-section';
import { TicketSection } from '@/components/home/ticket-section';
import { TourPricingSection } from '@/components/home/tour-pricing-section';
import { HomestaySection } from '@/components/home/homestay-section';
import { RestaurantSection } from '@/components/home/restaurant-section';
import { GallerySection } from '@/components/home/gallery-section';
import { VideoGuideSection } from '@/components/home/video-guide-section';
import { FeaturesSection } from '@/components/home/features-section';
import { MapSection } from '@/components/home/map-section';
import { CTABookingSection } from '@/components/home/cta-booking-section';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import { FAQ } from '@/components/schema/FAQSchema';
import { AboutSection } from '@/components/home/about-section';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate to get latest data

// Components

// Icons

type LatestPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  Media: {
    url: string;
    alt: string | null;
  } | null;
};

import { getHomepageConfig } from '@/lib/homepage/sections';
import type { HomepageConfig } from '@/lib/homepage/schema';
import { BlocksRenderer } from '@/components/blocks/BlocksRenderer';

// This page is using the craft.tsx component and design system
export default async function Home() {
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

  // Load active template
  const activeTemplate = await getActiveTemplateServer();
  
  // Priority 1: Load homepage config (already includes HomepageSettings.sections priority)
  // getHomepageConfig() now checks HomepageSettings.sections (PUBLISHED) first, then HomepageSection
  const homepageConfig = await getHomepageConfig();

  // Priority 2: Try to load blocks (blocks system) - only use if no published settings
  // In development, also check DRAFT if no PUBLISHED exists
  const publishedSettings = await prisma.homepageSettings.findFirst({
    where: { status: 'PUBLISHED' },
    orderBy: { updatedAt: 'desc' },
  });

  // In development mode, if no PUBLISHED, check for DRAFT (for testing)
  const draftSettings = process.env.NODE_ENV === 'development' && !publishedSettings
    ? await prisma.homepageSettings.findFirst({
        where: { status: 'DRAFT' },
        orderBy: { updatedAt: 'desc' },
      })
    : null;

  const activeSettings = publishedSettings || draftSettings;
  const hasPublishedSettings = activeSettings?.sections && typeof activeSettings.sections === 'object';

  const blocks = await prisma.homepageBlock.findMany({
    where: {
      status: 'ACTIVE',
      themeId: null, // Only global blocks for now
    },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      type: true,
      title: true,
      fields: true,
      sortOrder: true,
      status: true,
      themeId: true,
    },
  });

  // Determine which data source to use
  // Priority: HomepageSettings.sections (PUBLISHED) > HomepageBlock > HomepageSection > DEFAULT_CONFIG
  // Since getHomepageConfig() now handles HomepageSettings.sections, we only check blocks if no published settings
  const useBlocks = !hasPublishedSettings && blocks.length > 0;

  // Debug: Log which data source is being used (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Homepage Data Source]', {
      usePublishedSettings: hasPublishedSettings,
      useBlocks,
      hasPublishedSettings,
      blocksCount: blocks.length,
      hasHomepageConfig: !!homepageConfig,
      settingsStatus: activeSettings?.status || 'none',
      hasPublished: !!publishedSettings,
      hasDraft: !!draftSettings,
    });
  }

  const finalConfig = homepageConfig;

  return (
    <TemplateWrapper template={activeTemplate}>
      <Section >
        <Container >
          {useBlocks ? (
            <BlocksRenderer blocks={blocks} posts={latestPosts} />
          ) : (
            <ExampleJsx 
              posts={latestPosts} 
              template={activeTemplate}
              homepageConfig={finalConfig}
            />
          )}
        </Container>
      </Section>
    </TemplateWrapper>
  );
}

// This is just some example JS to demonstrate automatic styling from brijr/craft
const ExampleJsx = ({ 
  posts, 
  template,
  homepageConfig 
}: { 
  posts: LatestPost[]; 
  template: TemplateType;
  homepageConfig?: HomepageConfig;
}) => {
  // FAQ data for homepage
  const faqs = [
    {
      question: 'Giá tour Cồn Phụng bao nhiêu?',
      answer: 'Giá tour dao động từ 500.000đ - 1.500.000đ tùy theo số người và dịch vụ đi kèm. Chúng tôi có nhiều gói tour phù hợp với mọi nhu cầu từ tham quan ngắn ngày đến trải nghiệm đầy đủ.'
    },
    {
      question: 'Tour có bao gồm ăn uống không?',
      answer: 'Có, tour bao gồm bữa trưa với các món đặc sản miền Tây như lẩu mắm, gỏi cuốn, bánh xèo, và nhiều món ngon khác. Tất cả đều tươi ngon và được chế biến vệ sinh.'
    },
    {
      question: 'Có dịch vụ đón tiễn không?',
      answer: 'Có, chúng tôi cung cấp dịch vụ đưa đón tận nơi tại TP.HCM và các tỉnh lân cận. Vui lòng liên hệ trước để được hỗ trợ tốt nhất.'
    },
    {
      question: 'Thời gian hoạt động của khu du lịch?',
      answer: 'Khu du lịch Cồn Phụng mở cửa từ 7:00 - 18:00 hàng ngày, kể cả ngày lễ tết. Thời gian tham quan lý tưởng nhất là từ 8:00 - 16:00.'
    },
    {
      question: 'Có chỗ nghỉ tại Cồn Phụng không?',
      answer: 'Có, chúng tôi có homestay Coco Island với nhiều phòng tiện nghi hiện đại, view sông đẹp, phù hợp cho gia đình và nhóm bạn. Giá từ 500.000đ/phòng/đêm.'
    },
    {
      question: 'Tour có phù hợp với trẻ em không?',
      answer: 'Rất phù hợp! Các hoạt động tại Cồn Phụng an toàn, thú vị cho mọi lứa tuổi. Trẻ em dưới 1m có tour miễn phí, từ 1m - 1m3 được giảm 50%.'
    }
  ];

  return (
    <>
      <article className="prose-m-none">
        {/* Organization Schema for SEO */}
        <OrganizationSchema />
      
      {/* ============================================ */}
      {/* PHASE 1: CAPTURE ATTENTION & BUILD DESIRE   */}
      {/* ============================================ */}
      
      {/* 1. Hero Section - Modern Redesigned */}
      <HeroModernRedesigned 
        data={homepageConfig?.hero}
      />

      {/* 2. About Section - Giới thiệu */}
      {homepageConfig?.about?.isActive && (
        <AboutSection data={homepageConfig.about} />
      )}

      {/* 3. Features Section - Using Features data from config */}
      <FeaturesSection data={homepageConfig?.features} />

      {/* 4. Promotion Section - Limited Time Offers (Creates urgency) */}
      <PromotionSection data={homepageConfig?.promotion} />

      {/* ============================================ */}
      {/* PHASE 2: SHOW OPTIONS & PRICING             */}
      {/* ============================================ */}
      
      {/* 4. Pricing Snapshot - Modern Design */}
      {homepageConfig?.pricingSnapshot?.isActive !== false && (
        <PricingSnapshotModern 
          pricingSnapshotData={homepageConfig?.pricingSnapshot}
          ticketData={homepageConfig?.ticket}
          tourData={homepageConfig?.tourPricing}
          homestayData={homepageConfig?.homestay}
        />
      )}

      {/* 5. Tour Experiences - Detailed tour options */}
      <TourPricingSection data={homepageConfig?.tourPricing} />
      
      {/* 5.5. Ticket Section - Ticket pricing */}
      <TicketSection data={homepageConfig?.ticket} />

      {/* 6. Homestay - Accommodation option */}
      {homepageConfig?.homestay?.isActive ? (
        <HomestaySection data={homepageConfig.homestay} />
      ) : (
        <HomestaySection />
      )}

      {/* ============================================ */}
      {/* PHASE 3: BUILD TRUST & CREDIBILITY          */}
      {/* ============================================ */}
      
      {/* 7. Social Proof - Modern Testimonials */}
      {homepageConfig?.socialProof?.isActive ? (
        <SocialProofModern data={homepageConfig.socialProof} />
      ) : (
        <SocialProofModern />
      )}

      {/* 8. Gallery - Visual proof of experience (Lazy loaded) */}
      <LazySectionWrapper>
        <div className="my-12 md:my-16">
          <GallerySection data={homepageConfig?.gallery} />
        </div>
      </LazySectionWrapper>

      {/* 9. Video Guide - See it in action (Lazy loaded) */}
      <LazySectionWrapper>
        <div className="my-12 md:my-16">
          <VideoGuideSection data={homepageConfig?.videoGuide} />
        </div>
      </LazySectionWrapper>

      {/* ============================================ */}
      {/* PHASE 4: ADDRESS OBJECTIONS                 */}
      {/* ============================================ */}
      
      {/* 10. FAQ - Answer common questions */}
      {homepageConfig?.faq?.isActive && homepageConfig.faq.items && homepageConfig.faq.items.length > 0 ? (
        <div className="my-20 md:my-24">
          <FAQ items={homepageConfig.faq.items} />
        </div>
      ) : (
        <div className="my-20 md:my-24">
          <FAQ items={faqs} />
        </div>
      )}

      {/* 11. Restaurant Section - Show food quality */}
      {homepageConfig?.restaurant?.isActive ? (
        <RestaurantSection data={homepageConfig.restaurant} />
      ) : (
        <RestaurantSection />
      )}


      {/* ============================================ */}
      {/* PHASE 5: ESTABLISH AUTHORITY                */}
      {/* ============================================ */}
      
      {/* 12. Certificates & Licenses - Compact trust badges */}
      <CertificatesSectionCompact data={homepageConfig?.certificates} />

      {/* 13. Latest Posts - Educational content (Lazy loaded) */}
      <LazySectionWrapper>
        <div className="my-12 md:my-16">
          <LatestPostsSection 
            posts={posts} 
            config={homepageConfig?.latestPosts}
          />
        </div>
      </LazySectionWrapper>

      {/* ============================================ */}
      {/* PHASE 6: FINAL CONVERSION PUSH              */}
      {/* ============================================ */}
      
      {/* 14. Map Section - Show location & accessibility */}
      <MapSection data={homepageConfig?.map} />

      {/* 15. CTA Booking - Final call-to-action */}
      <CTABookingSection data={homepageConfig?.ctaBooking} />

      {/* ============================================ */}
      {/* OPTIONAL: FOOTER CONTENT (Moved to sections) */}
      {/* ============================================ */}
      
      {/* Policy Links - Compact footer links */}
      <PolicyLinksSectionCompact data={homepageConfig?.policyLinks} />

      </article>

      {/* Mobile Sticky CTA - Shows on scroll (Mobile only) */}
      <MobileStickyCTA />
    </>
  );
};

const LatestPostsSection = ({ 
  posts, 
  config 
}: { 
  posts: LatestPost[]; 
  config?: { heading?: string; description?: string; ctaText?: string; ctaLink?: string; postCount?: number };
}) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 rounded-3xl bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 px-6 md:px-8 py-12 md:py-16 shadow-xl border border-emerald-100 dark:border-gray-700">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-5 py-2 rounded-full mb-6">
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">📰 Tin Tức & Blog</span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent">
          {config?.heading || 'Bài Viết Mới Nhất'}
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {config?.description || 'Những câu chuyện và mẹo hữu ích dành cho hành trình khám phá Cồn Phụng.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              {post.Media?.url ? (
                <>
                  <Image
                    src={post.Media.url}
                    alt={post.Media.alt ?? post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Không có ảnh
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col space-y-3 p-5">
              <div className="text-xs uppercase tracking-wide text-primary/80">
                {format(new Date(post.createdAt), 'dd/MM/yyyy')}
              </div>
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
              <div className="pt-1">
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Đọc bài viết
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={config?.ctaLink || '/posts'}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 px-8 py-3 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          {config?.ctaText || 'Xem Tất Cả Bài Viết'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
};
