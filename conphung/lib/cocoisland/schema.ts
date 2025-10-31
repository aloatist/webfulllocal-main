import { z } from 'zod';

// Hero Section Schema
export const heroSectionSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  backgroundImage: z.string().optional(),
  heroImage: z.string().optional(),
  video: z.object({
    url: z.string(),
    poster: z.string().optional(),
    overlayTitle: z.string().optional(),
    overlaySubtitle: z.string().optional(),
  }).optional(),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
  secondaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
  stats: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
});

// Stay Perks Schema
export const stayPerksSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string(),
  description: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
  items: z.array(z.string()),
});

// Experience Schema
export const experienceSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
});

export const experiencesSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  experiences: z.array(experienceSchema),
});

// Restaurant Section Schema
export const restaurantSectionSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()).optional(),
  image: z.string(),
});

// Discovery Section Schema
export const discoverySectionSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  image: z.string(),
});

// Testimonial Schema
export const testimonialSchema = z.object({
  author: z.string(),
  role: z.string().optional(),
  quote: z.string(),
  avatar: z.string().optional(),
});

export const testimonialsSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  testimonials: z.array(testimonialSchema),
});

// Service Schema
export const serviceSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  image: z.string().optional(),
});

export const servicesSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  services: z.array(serviceSchema),
});

// Contact Section Schema
export const contactSectionSchema = z.object({
  eyebrow: z.string().optional(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  mapUrl: z.string().optional(),
  hotlineLabel: z.string().optional(),
  description: z.string().optional(),
  formHeading: z.string().optional(),
  formDescription: z.string().optional(),
});

// Newsletter Section Schema
export const newsletterSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Room Showcase Section Schema
export const roomShowcaseSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
});

// Main Config Schema
export const cocoIslandConfigSchema = z.object({
  hero: heroSectionSchema,
  stayPerks: stayPerksSchema,
  roomShowcase: roomShowcaseSectionSchema.optional(),
  experiences: experiencesSectionSchema.optional(),
  restaurant: restaurantSectionSchema.optional(),
  discovery: discoverySectionSchema.optional(),
  testimonials: testimonialsSectionSchema.optional(),
  services: servicesSectionSchema.optional(),
  contact: contactSectionSchema,
  newsletter: newsletterSectionSchema.optional(),
});

export type CocoIslandConfig = z.infer<typeof cocoIslandConfigSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type StayPerks = z.infer<typeof stayPerksSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type RestaurantSection = z.infer<typeof restaurantSectionSchema>;
export type DiscoverySection = z.infer<typeof discoverySectionSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ContactSection = z.infer<typeof contactSectionSchema>;
export type NewsletterSection = z.infer<typeof newsletterSectionSchema>;
export type RoomShowcaseSection = z.infer<typeof roomShowcaseSectionSchema>;
