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
import { PromotionSection } from '@/components/home/promotion-section';
import { RestaurantSection } from '@/components/home/restaurant-section';
import { FeaturesSection } from '@/components/home/features-section';
import { MapSection } from '@/components/home/map-section';
import { GallerySection } from '@/components/home/gallery-section';
import { CTABookingSection } from '@/components/home/cta-booking-section';
import { VideoGuideSection } from '@/components/home/video-guide-section';

export const dynamic = 'force-dynamic';
import { TicketSection } from '@/components/home/ticket-section';
import { TourPricingSection } from '@/components/home/tour-pricing-section';
import { HomestaySection } from '@/components/home/homestay-section';
import { getHomepageConfig } from '@/lib/homepage/sections';
import type { HomepageConfig } from '@/lib/homepage/schema';

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
  const config = await getHomepageConfig();
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
   
   

      <ExampleJsx posts={latestPosts} config={config} />
    
      </Container>
    </Section>
  );
}

// This is just some example JS to demonstrate automatic styling from brijr/craft
const ExampleJsx = ({ posts, config }: { posts: LatestPost[], config: HomepageConfig }) => {
  return (
    <article className="prose-m-none">
      {/* Modern Hero Section */}
      <HeroSection data={config.hero} />

      {/* Modern Promotion Section */}
      <PromotionSection data={config.promotion} />

      {/* Modern Ticket Section */}
      <TicketSection data={config.ticket} />

      {/* Modern Tour Pricing Section */}
      <TourPricingSection data={config.tourPricing} />

      {/* Modern Homestay Section */}
      <HomestaySection />

      <LatestPostsSection posts={posts} config={config.latestPosts} />

      {/* Modern Restaurant Section */}
      <RestaurantSection />


 {/* thông tin về chúng tôi */} 
<FadeIn direction="up" delay={0.2}>
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 shadow-2xl mb-12">
  {/* Decorative Background */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
  
  <div className="relative z-10">
    {/* Header */}
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-5 py-2 rounded-full mb-4">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Giấy Phép & Chứng Nhận</span>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
        THÔNG TIN VỀ CHÚNG TÔI
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
        🏛️ Được cấp phép và công nhận bởi các cơ quan chức năng
      </p>
    </div>

    {/* Trust Badges */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Giấy Phép Lữ Hành</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Quốc tế hợp pháp</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Giấy Kinh Doanh</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Đăng ký hợp lệ</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">An Toàn Thực Phẩm</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Đảm bảo vệ sinh</p>
        </div>
      </div>
    </div>

    {/* Hình ảnh giấy phép */}
    <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StaggerItem>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative">
            <ImageWrapper
              src="/uploads/2024/10/giay-phep-lu-hanh-735x1024.webp"
              alt="Giấy phép lữ hành Cồn Phụng"
              aspectRatio="3/4"
              href="/uploads/2024/10/giay-phep-lu-hanh-735x1024.webp"
            />
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative">
            <ImageWrapper
              src="/uploads/2024/10/giay-phep-kinh-doanh-conphung-724x2048.webp"
              alt="Giấy phép kinh doanh Cồn Phụng"
              aspectRatio="3/4"
              href="/uploads/2024/10/giay-phep-kinh-doanh-conphung-724x2048.webp"
            />
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative">
            <ImageWrapper
              src="/uploads/2024/10/giay-an-toan-thuc-pham-con-phung-743x1024.webp"
              alt="Giấy an toàn thực phẩm Cồn Phụng"
              aspectRatio="3/4"
              href="/uploads/2024/10/giay-an-toan-thuc-pham-con-phung-743x1024.webp"
            />
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>

    {/* Bottom Note */}
    <div className="mt-8 text-center">
      <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          ✅ Được Bộ Công Thương xác nhận - Đơn vị du lịch uy tín
        </p>
      </div>
    </div>
  </div>
</div>
</FadeIn>

      {/* Modern Map Section */}
      <MapSection data={config.map} />

      {/* Modern Gallery Section */}
      <GallerySection data={config.gallery} />

      {/* Modern CTA Booking Section */}
      <CTABookingSection data={config.ctaBooking} />

      {/* Modern Video Guide Section */}
      <VideoGuideSection data={config.videoGuide} />

      {/* Modern Features Section */}
      <FeaturesSection data={config.features} />

{/* chính sách bảo mật*/}
<div
      className="flex flex-wrap justify-center items-center border-b-2 border-dashed py-6 "
      id="row-582826042"
    >

<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {/* Chính sách bảo mật */}
  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 transition transform hover:scale-105 shadow-md">
    <a
      className="flex flex-col items-center justify-center text-center no-underline text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
      href="/chinh-sach-bao-mat"
    >
      <i className="icon-user text-2xl mb-2 dark:text-blue-400"></i>
      <span className="font-semibold">CHÍNH SÁCH BẢO MẬT</span>
    </a>
  </div>

  {/* Phương thức thanh toán */}
  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 transition transform hover:scale-105 shadow-md">
    <a
      className="flex flex-col items-center justify-center text-center no-underline text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
      href="/phuong-thuc-thanh-toan"
    >
      <i className="icon-shopping-cart text-2xl mb-2 dark:text-blue-400"></i>
      <span className="font-semibold">PHƯƠNG THỨC THANH TOÁN</span>
    </a>
  </div>

  {/* Chính sách hủy – hoàn tiền */}
  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 transition transform hover:scale-105 shadow-md">
    <a
      className="flex flex-col items-center justify-center text-center no-underline text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
      href="/chinh-sach-huy-hoan-tien"
    >
      <i className="icon-checkmark text-2xl mb-2 dark:text-blue-400"></i>
      <span className="font-semibold">CHÍNH SÁCH HỦY – HOÀN TIỀN</span>
    </a>
  </div>

  {/* Chính sách – Quy định chung */}
  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 transition transform hover:scale-105 shadow-md">
    <a
      className="flex flex-col items-center justify-center text-center no-underline text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
      href="/chinh-sach-quy-dinh-chung"
    >
      <i className="icon-checkmark text-2xl mb-2 dark:text-blue-400"></i>
      <span className="font-semibold">CHÍNH SÁCH – QUY ĐỊNH CHUNG</span>
    </a>
  </div>
</div>


      
</div>



</article>
  );
};

const LatestPostsSection = ({ posts, config }: { posts: LatestPost[], config: any }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 rounded-3xl bg-gradient-to-br from-emerald-700/10 via-primary/5 to-background px-6 py-10 shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{config?.heading || 'Bài viết mới nhất'}</h2>
        <p className="mt-2 text-muted-foreground">
          {config?.description || 'Những câu chuyện và mẹo hữu ích dành cho hành trình khám phá Cồn Phụng.'}
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
