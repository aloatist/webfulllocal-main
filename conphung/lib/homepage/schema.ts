import { z } from 'zod';

// Hero Section Schema
export const heroSectionSchema = z.object({
  mainTitle: z.string(),
  subtitle: z.string(),
  description: z.string(),
  backgroundImage: z.string(),
  phone: z.string(),
  address: z.string(),
  openingHours: z.string(),
  primaryCta: z.object({
    text: z.string(),
    link: z.string(),
  }),
  secondaryCta: z.object({
    text: z.string(),
    link: z.string(),
  }),
});

// Features Schema
export const featureItemSchema = z.object({
  icon: z.string(), // lucide icon name or emoji
  title: z.string(),
  description: z.string(),
  color: z.string(), // gradient colors
});

export const featuresSectionSchema = z.object({
  features: z.array(featureItemSchema),
});

// Certificate/License Schema
export const certificateItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  icon: z.string(), // for badge
});

export const certificatesSectionSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  certificates: z.array(certificateItemSchema),
  bottomNote: z.string(),
});

// Policy Links Schema
export const policyLinkSchema = z.object({
  title: z.string(),
  href: z.string(),
  icon: z.string(),
});

export const policyLinksSectionSchema = z.object({
  links: z.array(policyLinkSchema),
});

// Latest Posts Section Schema
export const latestPostsSectionSchema = z.object({
  heading: z.string(),
  description: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
  postCount: z.number().min(1).max(12),
});

// Gallery Section Schema
export const gallerySectionSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })),
});

// Map Section Schema
export const mapSectionSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  embedUrl: z.string(),
  address: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

// Video Guide Section Schema
export const videoGuideSectionSchema = z.object({
  heading: z.string(),
  description: z.string(),
  videos: z.array(z.object({
    title: z.string(),
    url: z.string(),
    thumbnail: z.string().optional(),
    duration: z.string().optional(),
  })),
});

// CTA Booking Section Schema
export const ctaBookingSectionSchema = z.object({
  heading: z.string(),
  description: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
  phone: z.string(),
  features: z.array(z.string()),
});

// Promotion Section Schema
export const promotionSectionSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  discount: z.string(),
  isActive: z.boolean(),
});

// Ticket Section Schema
export const ticketPriceSchema = z.object({
  adult: z.number(),
  child: z.number(),
  currency: z.string().default('₫'),
});

export const ticketSectionSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  subheading: z.string(),
  description: z.string(),
  prices: ticketPriceSchema,
  includedItems: z.array(z.string()),
  pickupLocation: z.string(),
  warningNote: z.string(),
  imageUrl: z.string().optional(),
});

// Tour Pricing Schema
export const tourItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  originalPrice: z.number(),
  discount: z.number(),
  finalPrice: z.number(),
  currency: z.string().default('₫'),
  imageUrl: z.string(),
  includedItems: z.array(z.string()),
  duration: z.string(),
  isActive: z.boolean(),
  order: z.number(),
});

export const tourPricingSectionSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  tours: z.array(tourItemSchema),
});

// About Section Schema (NEW)
export const aboutSectionSchema = z.object({
  title: z.string(),
  content: z.string(), // EditorJS JSON string
  image: z.string().optional(),
  imageId: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Restaurant Section Schema (NEW)
export const restaurantSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  capacity: z.string().optional(),
  specialties: z.array(z.string()),
  image: z.string().optional(),
  imageId: z.string().optional(),
  isActive: z.boolean().default(true),
});

// FAQ Section Schema (NEW)
export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const faqSectionSchema = z.object({
  heading: z.string().optional(),
  items: z.array(faqItemSchema),
  isActive: z.boolean().default(true),
});

// Main Homepage Config Schema (Extended)
export const homepageConfigSchema = z.object({
  hero: heroSectionSchema,
  about: aboutSectionSchema.optional(), // NEW
  features: featuresSectionSchema,
  certificates: certificatesSectionSchema,
  policyLinks: policyLinksSectionSchema,
  promotion: promotionSectionSchema.optional(),
  ticket: ticketSectionSchema.optional(),
  tourPricing: tourPricingSectionSchema.optional(),
  latestPosts: latestPostsSectionSchema.optional(),
  gallery: gallerySectionSchema.optional(),
  map: mapSectionSchema.optional(),
  videoGuide: videoGuideSectionSchema.optional(),
  ctaBooking: ctaBookingSectionSchema.optional(),
  restaurant: restaurantSectionSchema.optional(), // NEW
  faq: faqSectionSchema.optional(), // NEW
});

// Type exports
export type HomepageConfig = z.infer<typeof homepageConfigSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type FeatureItem = z.infer<typeof featureItemSchema>;
export type FeaturesSection = z.infer<typeof featuresSectionSchema>;
export type CertificateItem = z.infer<typeof certificateItemSchema>;
export type CertificatesSection = z.infer<typeof certificatesSectionSchema>;
export type PolicyLink = z.infer<typeof policyLinkSchema>;
export type PolicyLinksSection = z.infer<typeof policyLinksSectionSchema>;
export type PromotionSection = z.infer<typeof promotionSectionSchema>;
export type TicketPrice = z.infer<typeof ticketPriceSchema>;
export type TicketSection = z.infer<typeof ticketSectionSchema>;
export type TourItem = z.infer<typeof tourItemSchema>;
export type TourPricingSection = z.infer<typeof tourPricingSectionSchema>;
export type LatestPostsSection = z.infer<typeof latestPostsSectionSchema>;
export type GallerySection = z.infer<typeof gallerySectionSchema>;
export type MapSection = z.infer<typeof mapSectionSchema>;
export type VideoGuideSection = z.infer<typeof videoGuideSectionSchema>;
export type CTABookingSection = z.infer<typeof ctaBookingSectionSchema>;
export type AboutSection = z.infer<typeof aboutSectionSchema>;
export type RestaurantSection = z.infer<typeof restaurantSectionSchema>;
export type FAQItem = z.infer<typeof faqItemSchema>;
export type FAQSection = z.infer<typeof faqSectionSchema>;
