import { z } from 'zod';

import { styleSchema, type Style } from './style-schema';

// Hero Section Schema
export const heroSectionSchema = z.object({
  eyebrow: z.string().optional(), // Badge text: "Du lịch Sinh Thái Chính Chủ"
  mainTitle: z.string(), // Main title displayed: "Thiên Nhiên Miền Tây"
  subtitle: z.string(),
  description: z.string(),
  backgroundImage: z.string(),
  phone: z.string(),
  address: z.string(),
  openingHours: z.string(),
  primaryCta: z.object({
    text: z.string(),
    link: z.string(),
    style: styleSchema.optional(),
  }),
  secondaryCta: z.object({
    text: z.string(),
    link: z.string(),
    style: styleSchema.optional(),
  }),
  // USPs (Unique Selling Points) - Badges displayed below CTAs
  usps: z.array(z.string()).optional(), // e.g., ["🌿 Thân Thiện Môi Trường", "🍃 Trải Nghiệm Xanh", "🌱 Chính Chủ"]
  // Styling for different elements
  styles: z.object({
    eyebrow: styleSchema.optional(),
    mainTitle: styleSchema.optional(),
    subtitle: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Features Schema
export const featureItemSchema = z.object({
  icon: z.string(), // lucide icon name or emoji
  title: z.string(),
  description: z.string(),
  color: z.string(), // gradient colors
  style: styleSchema.optional(),
});

export const featuresSectionSchema = z.object({
  features: z.array(featureItemSchema),
  styles: z.object({
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
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
  styles: z.object({
    eyebrow: styleSchema.optional(),
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Policy Links Schema
export const policyLinkSchema = z.object({
  title: z.string(),
  href: z.string(),
  icon: z.string(),
});

export const policyLinksSectionSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  bottomText: z.string().optional(),
  links: z.array(policyLinkSchema),
  styles: z.object({
    container: styleSchema.optional(),
  }).optional(),
});

// Latest Posts Section Schema
export const latestPostsSectionSchema = z.object({
  heading: z.string(),
  description: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
  postCount: z.number().min(1).max(12),
  styles: z.object({
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Gallery Section Schema
export const gallerySectionSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  ecoFeatures: z.array(z.object({
    title: z.string(),
    subtitle: z.string(),
    icon: z.string().optional(), // 'trees', 'building', 'leaf' for lucide icons
  })).min(3).max(3).optional(),
  bottomText: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })),
  styles: z.object({
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
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
  styles: z.object({
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
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
  styles: z.object({
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// CTA Booking Section Schema
export const ctaBookingSectionSchema = z.object({
  heading: z.string(),
  description: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
  phone: z.string(),
  features: z.array(z.string()),
  styles: z.object({
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    ctaButton: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Promotion Section Schema
export const promotionSectionSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  discount: z.string(),
  isActive: z.boolean(),
  styles: z.object({
    eyebrow: styleSchema.optional(),
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    discount: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
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
  styles: z.object({
    eyebrow: styleSchema.optional(),
    heading: styleSchema.optional(),
    subheading: styleSchema.optional(),
    description: styleSchema.optional(),
    includedItems: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
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

// Tour Highlight Item Schema
export const tourHighlightItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.enum(['Ship', 'Leaf', 'MapPin', 'Star']).optional(),
});

export const tourPricingSectionSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  tours: z.array(tourItemSchema),
  bottomNote: z.string().optional(),
  highlights: z.array(tourHighlightItemSchema).optional(),
  styles: z.object({
    eyebrow: styleSchema.optional(),
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    includedItems: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// About Section Schema (NEW)
export const aboutSectionSchema = z.object({
  title: z.string(),
  content: z.string(), // EditorJS JSON string
  image: z.string().optional(),
  imageId: z.string().optional(),
  isActive: z.boolean().default(true),
  styles: z.object({
    title: styleSchema.optional(),
    content: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Restaurant Section Schema (NEW)
export const restaurantSectionSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string(),
  capacity: z.string().optional(),
  specialties: z.array(z.string()),
  image: z.string().optional(),
  imageId: z.string().optional(),
  isActive: z.boolean().default(true),
  styles: z.object({
    eyebrow: styleSchema.optional(),
    title: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
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
  styles: z.object({
    heading: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Pricing Snapshot Section Schema (Aggregates Ticket + Tour Pricing)
export const pricingSnapshotSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  paymentInfo: z.string().optional(),
  isActive: z.boolean().default(true),
  styles: z.object({
    eyebrow: styleSchema.optional(),
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Homestay Section Schema
export const homestaySectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string(),
  subheading: z.string().optional(),
  description: z.string(),
  amenities: z.array(z.object({
    icon: z.string(),
    label: z.string(),
  })),
  highlights: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  bottomNote: z.string().optional(),
  isActive: z.boolean().default(true),
  // Coco Island Card data
  cocoIslandCard: z.object({
    imageUrl: z.string(),
    originalPrice: z.number(),
    discount: z.number(),
    finalPrice: z.number(),
    currency: z.string().default('₫'),
    includedItems: z.array(z.string()),
    roomAmenities: z.array(z.string()),
  }).optional(),
  styles: z.object({
    eyebrow: styleSchema.optional(),
    heading: styleSchema.optional(),
    subheading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Social Proof / Testimonials Section Schema
export const testimonialItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  rating: z.number().min(1).max(5),
  date: z.string(),
  content: z.string(),
  tourType: z.string().optional(),
  verified: z.boolean().default(false),
});

export const trustStatSchema = z.object({
  value: z.string(),
  label: z.string(),
  icon: z.string(),
  gradient: z.string(),
});

export const socialProofSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string(),
  description: z.string().optional(),
  overallRating: z.number().min(0).max(5).optional(),
  ratingText: z.string().optional(),
  testimonials: z.array(testimonialItemSchema),
  trustStats: z.array(trustStatSchema),
  bottomCTAText: z.string().optional(),
  bottomCTADescription: z.string().optional(),
  isActive: z.boolean().default(true),
  styles: z.object({
    eyebrow: styleSchema.optional(),
    heading: styleSchema.optional(),
    description: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
});

// Footer Section Schema
export const footerLinkGroupSchema = z.object({
  title: z.string(),
  links: z.array(z.object({
    label: z.string(),
    href: z.string(),
  })),
});

export const socialLinkSchema = z.object({
  icon: z.string(), // lucide icon name
  href: z.string(),
  label: z.string(),
  color: z.string().optional(), // hover color class
});

export const contactInfoItemSchema = z.object({
  icon: z.string(), // lucide icon name
  label: z.string(),
  value: z.string(),
  href: z.string().optional(),
});

export const teamMemberSchema = z.object({
  name: z.string(),
  title: z.string(),
  imgSrc: z.string(),
  phone: z.string().optional(),
  numberphone: z.string().optional(),
  email: z.string().optional(),
});

export const footerSectionSchema = z.object({
  // Contact Section (Team Members)
  contactHeading: z.string().optional(),
  contactDescription: z.string().optional(),
  showTeamMembers: z.boolean().default(true),
  teamMembers: z.array(teamMemberSchema).optional(),
  
  // Company Info
  logoUrl: z.string().optional(),
  companyDescription: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  
  // Link Groups
  linkGroups: z.array(footerLinkGroupSchema).optional(),
  
  // Contact Info
  contactInfo: z.array(contactInfoItemSchema).optional(),
  
  // Newsletter
  newsletterTitle: z.string().optional(),
  newsletterDescription: z.string().optional(),
  newsletterEnabled: z.boolean().default(true),
  
  // Legal Info
  companyName: z.string().optional(),
  taxCode: z.string().optional(),
  businessLicense: z.string().optional(),
  foodSafetyCert: z.string().optional(),
  bankAccount: z.string().optional(),
  address: z.string().optional(),
  
  // Copyright
  copyrightText: z.string().optional(),
  
  // Styling
  styles: z.object({
    contactHeading: styleSchema.optional(),
    companyDescription: styleSchema.optional(),
    linkGroupTitle: styleSchema.optional(),
    container: styleSchema.optional(),
  }).optional(),
  
  isActive: z.boolean().default(true),
});

// Main Homepage Config Schema (Extended)
export const homepageConfigSchema = z.object({
  hero: heroSectionSchema,
  about: aboutSectionSchema.optional(),
  features: featuresSectionSchema,
  certificates: certificatesSectionSchema,
  policyLinks: policyLinksSectionSchema,
  promotion: promotionSectionSchema.optional(),
  pricingSnapshot: pricingSnapshotSectionSchema.optional(),
  ticket: ticketSectionSchema.optional(),
  tourPricing: tourPricingSectionSchema.optional(),
  latestPosts: latestPostsSectionSchema.optional(),
  gallery: gallerySectionSchema.optional(),
  map: mapSectionSchema.optional(),
  videoGuide: videoGuideSectionSchema.optional(),
  ctaBooking: ctaBookingSectionSchema.optional(),
  restaurant: restaurantSectionSchema.optional(),
  faq: faqSectionSchema.optional(),
  homestay: homestaySectionSchema.optional(), // NEW
  socialProof: socialProofSectionSchema.optional(), // NEW
  footer: footerSectionSchema.optional(), // NEW
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
export type PricingSnapshotSection = z.infer<typeof pricingSnapshotSectionSchema>;
export type HomestaySection = z.infer<typeof homestaySectionSchema>;
export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type TrustStat = z.infer<typeof trustStatSchema>;
export type SocialProofSection = z.infer<typeof socialProofSectionSchema>;
export type FooterSection = z.infer<typeof footerSectionSchema>;
export type FooterLinkGroup = z.infer<typeof footerLinkGroupSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ContactInfoItem = z.infer<typeof contactInfoItemSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
