import { HeroModernRedesigned } from '@/components/home/hero-modern-redesigned';
import { AboutSection } from '@/components/home/about-section';
import { FeaturesSection } from '@/components/home/features-section';
import { PromotionSection } from '@/components/home/promotion-section';
import { PricingSnapshotModern } from '@/components/home/pricing-snapshot-modern';
import { TourPricingSection } from '@/components/home/tour-pricing-section';
import { TicketSection } from '@/components/home/ticket-section';
import { HomestaySection } from '@/components/home/homestay-section';
import { SocialProofModern } from '@/components/home/social-proof-modern';
import { GallerySection } from '@/components/home/gallery-section';
import { VideoGuideSection } from '@/components/home/video-guide-section';
import { FAQ } from '@/components/schema/FAQSchema';
import { RestaurantSection } from '@/components/home/restaurant-section';
import { CertificatesSectionCompact } from '@/components/home/certificates-section-compact';
import { PolicyLinksSectionCompact } from '@/components/home/policy-links-section-compact';
import { MapSection } from '@/components/home/map-section';
import { CTABookingSection } from '@/components/home/cta-booking-section';
import { LazySectionWrapper } from '@/components/home/lazy-section-wrapper';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import { MobileStickyCTA } from '@/components/home/mobile-sticky-cta';
import { LatestPostsSection } from '@/components/blocks/LatestPostsBlock';
import { ModernFooter } from '@/components/footer/modern-footer';
import { getHomepageConfig } from '@/lib/homepage/sections';

interface HomepageBlock {
  id: string;
  type: string;
  title?: string | null;
  fields: any;
  sortOrder: number;
  status: string;
  themeId?: string | null;
}

interface BlocksRendererProps {
  blocks: HomepageBlock[];
  posts?: any[];
}

export async function BlocksRenderer({ blocks, posts = [] }: BlocksRendererProps) {
  // Get footer data for footer block
  const homepageConfig = await getHomepageConfig();
  // Helper to convert block fields to section data format
  const convertBlockToSection = (block: HomepageBlock): any => {
    switch (block.type) {
      case 'hero':
        return {
          eyebrow: block.fields.eyebrow,
          mainTitle: block.fields.title,
          subtitle: block.fields.subtitle,
          description: block.fields.description,
          backgroundImage: block.fields.backgroundImage,
          phone: block.fields.phone,
          address: block.fields.address,
          openingHours: block.fields.openingHours,
          primaryCta: {
            text: block.fields.primaryCtaText,
            link: block.fields.primaryCtaLink,
          },
          secondaryCta: {
            text: block.fields.secondaryCtaText,
            link: block.fields.secondaryCtaLink,
          },
        };
      case 'about':
        return {
          title: block.fields.title,
          content: block.fields.content,
          image: block.fields.image,
          isActive: true,
        };
      case 'feature':
        return {
          eyebrow: block.fields.eyebrow,
          heading: block.fields.heading,
          description: block.fields.description,
          features: block.fields.features || [],
        };
      case 'promotion':
        return {
          eyebrow: block.fields.eyebrow,
          heading: block.fields.heading,
          description: block.fields.description,
          imageUrl: block.fields.imageUrl,
          discount: block.fields.discount,
          isActive: true,
        };
      case 'pricingSnapshot':
        return {
          eyebrow: block.fields.eyebrow,
          heading: block.fields.heading,
          description: block.fields.description,
          isActive: true,
        };
      case 'tourList':
      case 'tourPricing':
        return {
          eyebrow: block.fields.eyebrow,
          heading: block.fields.heading,
          description: block.fields.description,
          tours: block.fields.tours || [],
        };
      case 'ticket':
        return {
          eyebrow: block.fields.eyebrow,
          heading: block.fields.heading,
          subheading: block.fields.subheading,
          description: block.fields.description,
          prices: block.fields.prices || {},
          includedItems: block.fields.includedItems || [],
          isActive: true,
        };
      case 'homestay':
        return {
          eyebrow: block.fields.eyebrow,
          heading: block.fields.heading,
          subheading: block.fields.subheading,
          description: block.fields.description,
          amenities: block.fields.amenities || [],
          highlights: block.fields.highlights || [],
          bottomNote: block.fields.bottomNote,
          isActive: true,
        };
      case 'testimonial':
      case 'socialProof':
        return {
          eyebrow: block.fields.eyebrow,
          heading: block.fields.heading,
          description: block.fields.description,
          overallRating: block.fields.overallRating,
          ratingText: block.fields.ratingText,
          testimonials: block.fields.testimonials || [],
          trustStats: block.fields.trustStats || [],
          bottomCTAText: block.fields.bottomCTAText,
          bottomCTADescription: block.fields.bottomCTADescription,
          isActive: true,
        };
      case 'gallery':
        return {
          heading: block.fields.heading,
          description: block.fields.description,
          images: block.fields.images || [],
        };
      case 'videoGuide':
        return {
          heading: block.fields.heading,
          description: block.fields.description,
          videos: block.fields.videos || [],
        };
      case 'faq':
        return {
          heading: block.fields.heading,
          items: block.fields.items || [],
          isActive: true,
        };
      case 'restaurant':
        return {
          title: block.fields.title,
          description: block.fields.description,
          capacity: block.fields.capacity,
          specialties: block.fields.specialties || [],
          image: block.fields.image,
          isActive: true,
        };
      case 'certificates':
        return {
          eyebrow: block.fields.eyebrow,
          heading: block.fields.heading,
          description: block.fields.description,
          certificates: block.fields.certificates || [],
          bottomNote: block.fields.bottomNote,
        };
      case 'latestPosts':
        return {
          heading: block.fields.heading,
          description: block.fields.description,
          ctaText: block.fields.ctaText,
          ctaLink: block.fields.ctaLink,
          postCount: block.fields.postCount || 3,
        };
      case 'map':
        return {
          heading: block.fields.heading,
          description: block.fields.description,
          embedUrl: block.fields.embedUrl,
          address: block.fields.address,
          coordinates: block.fields.coordinates || {},
        };
      case 'cta':
      case 'ctaBooking':
        return {
          heading: block.fields.heading,
          description: block.fields.description,
          ctaText: block.fields.ctaText,
          ctaLink: block.fields.ctaLink,
          phone: block.fields.phone,
          features: block.fields.features || [],
        };
      case 'policyLinks':
        return {
          links: block.fields.links || [],
        };
      case 'footer':
        return {
          ...block.fields,
          isActive: true,
        };
      default:
        return block.fields;
    }
  };

  // Get config for sections that need multiple data sources
  const getHomepageConfigForBlocks = async (): Promise<Partial<HomepageConfig>> => {
    // This will be called server-side, but since we're in client component,
    // we'll need to pass it as props or fetch it
    return {};
  };

  return (
    <>
      <article className="prose-m-none">
        <OrganizationSchema />
        
        {blocks.map((block) => {
          const sectionData = convertBlockToSection(block);
          
          switch (block.type) {
            case 'hero':
              return <HeroModernRedesigned key={block.id} data={sectionData} />;
            case 'about':
              return sectionData.isActive ? (
                <AboutSection key={block.id} data={sectionData} />
              ) : null;
            case 'feature':
              return <FeaturesSection key={block.id} data={sectionData} />;
            case 'promotion':
              return sectionData.isActive ? (
                <PromotionSection key={block.id} data={sectionData} />
              ) : null;
            case 'pricingSnapshot':
              return sectionData.isActive !== false ? (
                <PricingSnapshotModern
                  key={block.id}
                  pricingSnapshotData={sectionData}
                  ticketData={blocks.find(b => b.type === 'ticket')?.fields}
                  tourData={blocks.find(b => b.type === 'tourList')?.fields}
                />
              ) : null;
            case 'tourList':
            case 'tourPricing':
              return <TourPricingSection key={block.id} data={sectionData} />;
            case 'ticket':
              return <TicketSection key={block.id} data={sectionData} />;
            case 'homestay':
              return sectionData.isActive ? (
                <HomestaySection key={block.id} data={sectionData} />
              ) : (
                <HomestaySection key={block.id} />
              );
            case 'testimonial':
            case 'socialProof':
              return sectionData.isActive ? (
                <SocialProofModern key={block.id} data={sectionData} />
              ) : (
                <SocialProofModern key={block.id} />
              );
            case 'gallery':
              return (
                <LazySectionWrapper key={block.id}>
                  <div className="my-12 md:my-16">
                    <GallerySection data={sectionData} />
                  </div>
                </LazySectionWrapper>
              );
            case 'videoGuide':
              return (
                <LazySectionWrapper key={block.id}>
                  <div className="my-12 md:my-16">
                    <VideoGuideSection data={sectionData} />
                  </div>
                </LazySectionWrapper>
              );
            case 'faq':
              return sectionData.isActive && sectionData.items?.length > 0 ? (
                <div key={block.id} className="my-20 md:my-24">
                  <FAQ items={sectionData.items} />
                </div>
              ) : null;
            case 'restaurant':
              return sectionData.isActive ? (
                <RestaurantSection key={block.id} data={sectionData} />
              ) : (
                <RestaurantSection key={block.id} />
              );
            case 'certificates':
              return <CertificatesSectionCompact key={block.id} data={sectionData} />;
            case 'latestPosts':
              return (
                <LazySectionWrapper key={block.id}>
                  <div className="my-12 md:my-16">
                    <LatestPostsSection posts={posts} config={sectionData} />
                  </div>
                </LazySectionWrapper>
              );
            case 'map':
              return <MapSection key={block.id} data={sectionData} />;
            case 'cta':
            case 'ctaBooking':
              return <CTABookingSection key={block.id} data={sectionData} />;
            case 'policyLinks':
              return <PolicyLinksSectionCompact key={block.id} data={sectionData} />;
            case 'footer':
              return sectionData.isActive ? (
                <ModernFooter key={block.id} data={homepageConfig?.footer || sectionData} />
              ) : null;
            default:
              console.warn(`Unknown block type: ${block.type}`);
              return null;
          }
        })}
      </article>

      <MobileStickyCTA />
    </>
  );
}

// Server Component wrapper - BlocksRenderer should be server component
export default BlocksRenderer;

