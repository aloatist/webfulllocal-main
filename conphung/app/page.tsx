import { Section, Container } from "@/components/craft";
import TypingEffect from '@/components/TypingEffect';
import Vethamquanconphung from '@/components/Vethamquanconphung';
import Tourconphungthoison from '@/components/Tourconphungthoison';
import CarouselSlider from '@/components/CarouselSlider';
import HomestayCocoIsland from '@/components/HomestayCocoIsland'; 
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { ImageWrapper } from '@/components/ui/image-wrapper';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in';
import { HeroSection } from '@/components/home/hero-section';
import { HeroSectionEnhanced } from '@/components/home/hero-section-enhanced';
import { ValuePropositionSection } from '@/components/home/value-proposition-section';
import { PricingSnapshotSection } from '@/components/home/pricing-snapshot-section';
import { SocialProofSection } from '@/components/home/social-proof-section';
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

export const dynamic = 'force-dynamic';

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

  return (
    <Section >
      <Container >
   
   

      <ExampleJsx posts={latestPosts} />
    
      </Container>
    </Section>
  );
}

// This is just some example JS to demonstrate automatic styling from brijr/craft
const ExampleJsx = ({ posts }: { posts: LatestPost[] }) => {
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
      
      {/* 1. Hero Section - First Impression (Enhanced) */}
      <HeroSectionEnhanced />

      {/* 2. Value Proposition - Why Choose Us (NEW - Above the fold benefits) */}
      <ValuePropositionSection />

      {/* 3. Promotion Section - Limited Time Offers (Creates urgency) */}
      <PromotionSection />

      {/* ============================================ */}
      {/* PHASE 2: SHOW OPTIONS & PRICING             */}
      {/* ============================================ */}
      
      {/* 4. Pricing Snapshot - Quick Overview (NEW - Consolidated pricing) */}
      <PricingSnapshotSection />

      {/* 5. Tour Experiences - Detailed tour options */}
      <TourPricingSection />

      {/* 6. Homestay - Accommodation option */}
      <HomestaySection />

      {/* ============================================ */}
      {/* PHASE 3: BUILD TRUST & CREDIBILITY          */}
      {/* ============================================ */}
      
      {/* 7. Social Proof - Customer Reviews (NEW - Establishes trust) */}
      <SocialProofSection />

      {/* 8. Gallery - Visual proof of experience (Lazy loaded) */}
      <LazySectionWrapper>
        <GallerySection />
      </LazySectionWrapper>

      {/* 9. Video Guide - See it in action (Lazy loaded) */}
      <LazySectionWrapper>
        <VideoGuideSection />
      </LazySectionWrapper>

      {/* ============================================ */}
      {/* PHASE 4: ADDRESS OBJECTIONS                 */}
      {/* ============================================ */}
      
      {/* 10. FAQ - Answer common questions */}
      <div className="my-16">
        <FAQ items={faqs} />
      </div>

      {/* 11. Restaurant Section - Show food quality */}
      <RestaurantSection />


      {/* ============================================ */}
      {/* PHASE 5: ESTABLISH AUTHORITY                */}
      {/* ============================================ */}
      
      {/* 12. Certificates & Licenses - Compact trust badges */}
      <CertificatesSectionCompact />

      {/* 13. Latest Posts - Educational content (Lazy loaded) */}
      <LazySectionWrapper>
        <LatestPostsSection posts={posts} />
      </LazySectionWrapper>

      {/* ============================================ */}
      {/* PHASE 6: FINAL CONVERSION PUSH              */}
      {/* ============================================ */}
      
      {/* 14. Map Section - Show location & accessibility */}
      <MapSection />

      {/* 15. CTA Booking - Final call-to-action */}
      <CTABookingSection />

      {/* ============================================ */}
      {/* OPTIONAL: FOOTER CONTENT (Moved to sections) */}
      {/* ============================================ */}
      
      {/* Policy Links - Compact footer links */}
      <PolicyLinksSectionCompact />

      </article>

      {/* Mobile Sticky CTA - Shows on scroll (Mobile only) */}
      <MobileStickyCTA />
    </>
  );
};

const LatestPostsSection = ({ posts }: { posts: LatestPost[] }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 rounded-3xl bg-gradient-to-br from-emerald-700/10 via-primary/5 to-background px-6 py-10 shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Bài viết mới nhất</h2>
        <p className="mt-2 text-muted-foreground">
          Những câu chuyện và mẹo hữu ích dành cho hành trình khám phá Cồn Phụng.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow transition hover:shadow-lg"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              {post.Media?.url ? (
                <Image
                  src={post.Media.url}
                  alt={post.Media.alt ?? post.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
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
          href="/posts"
          className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Xem tất cả bài viết
        </Link>
      </div>
    </section>
  );
};
