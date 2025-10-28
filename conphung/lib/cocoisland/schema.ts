import { z } from 'zod';

export const cocoIslandConfigSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    backgroundImage: z.string(),
    ctaText: z.string(),
    ctaLink: z.string(),
  }),
  about: z.object({
    title: z.string(),
    content: z.string(),
    images: z.array(z.string()),
  }),
  rooms: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  services: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    image: z.string(),
  })),
  contact: z.object({
    title: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    mapUrl: z.string(),
  }),
});

export type CocoIslandConfig = z.infer<typeof cocoIslandConfigSchema>;
