import { z } from 'zod';

// Hero Section
export const heroSectionSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }),
  secondaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }),
  stats: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })),
  heroImage: z.string(),
  video: z.object({
    url: z.string(),
    poster: z.string(),
  }),
});

// Stay Perks Section
export const stayPerksSchema = z.object({
  heading: z.string(),
  items: z.array(z.string()),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
});

// Room Showcase Section
export const roomShowcaseSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
});

// Experience Item
export const experienceSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Experiences Section
export const experiencesSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  experiences: z.array(experienceSchema),
});

// Restaurant Section
export const restaurantSectionSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

// Discovery Section
export const discoverySectionSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  image: z.string(),
});

// Testimonial
export const testimonialSchema = z.object({
  author: z.string(),
  role: z.string(),
  quote: z.string(),
});

// Testimonials Section
export const testimonialsSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  testimonials: z.array(testimonialSchema),
});

// Service
export const serviceSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Services Section
export const servicesSectionSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  services: z.array(serviceSchema),
});

// Contact Section
export const contactSectionSchema = z.object({
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  mapUrl: z.string(),
  hotlineLabel: z.string(),
});

// Newsletter Section
export const newsletterSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Complete Coco Island Config
export const cocoIslandConfigSchema = z.object({
  hero: heroSectionSchema,
  stayPerks: stayPerksSchema,
  roomShowcase: roomShowcaseSchema.optional(),
  experiences: experiencesSectionSchema,
  restaurant: restaurantSectionSchema,
  discovery: discoverySectionSchema,
  testimonials: testimonialsSectionSchema,
  services: servicesSectionSchema,
  contact: contactSectionSchema,
  newsletter: newsletterSectionSchema,
});

// Type exports
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type StayPerksSection = z.infer<typeof stayPerksSchema>;
export type RoomShowcaseSection = z.infer<typeof roomShowcaseSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type ExperiencesSection = z.infer<typeof experiencesSectionSchema>;
export type RestaurantSection = z.infer<typeof restaurantSectionSchema>;
export type DiscoverySection = z.infer<typeof discoverySectionSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type TestimonialsSection = z.infer<typeof testimonialsSectionSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ServicesSection = z.infer<typeof servicesSectionSchema>;
export type ContactSection = z.infer<typeof contactSectionSchema>;
export type NewsletterSection = z.infer<typeof newsletterSectionSchema>;
export type CocoIslandConfig = z.infer<typeof cocoIslandConfigSchema>;
