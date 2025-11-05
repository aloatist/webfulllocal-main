import { z } from 'zod';

// Typography Schema
export const typographySchema = z.object({
  fontSize: z.enum(['sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl']).optional(),
  fontWeight: z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).optional(),
  lineHeight: z.enum(['tight', 'snug', 'normal', 'relaxed', 'loose']).optional(),
  letterSpacing: z.enum(['tighter', 'tight', 'normal', 'wide', 'wider']).optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
}).optional();

// Color Schema
export const colorSchema = z.object({
  textColor: z.string().optional(), // Tailwind color class or hex
  bgColor: z.string().optional(),
  gradient: z.string().optional(), // Tailwind gradient classes
  borderColor: z.string().optional(),
}).optional();

// Effects Schema
export const effectsSchema = z.object({
  shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).optional(),
  blur: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']).optional(),
  opacity: z.number().min(0).max(100).optional(), // 0-100
  animation: z.enum(['none', 'fade', 'slide', 'bounce', 'pulse', 'spin']).optional(),
  hoverEffect: z.enum(['none', 'scale', 'lift', 'glow', 'shimmer']).optional(),
}).optional();

// Spacing Schema
export const spacingSchema = z.object({
  padding: z.string().optional(), // Tailwind padding classes
  margin: z.string().optional(), // Tailwind margin classes
  gap: z.string().optional(), // Tailwind gap classes
}).optional();

// Combined Style Schema
export const styleSchema = z.object({
  typography: typographySchema,
  colors: colorSchema,
  effects: effectsSchema,
  spacing: spacingSchema,
}).optional();

export type Typography = z.infer<typeof typographySchema>;
export type Color = z.infer<typeof colorSchema>;
export type Effects = z.infer<typeof effectsSchema>;
export type Spacing = z.infer<typeof spacingSchema>;
export type Style = z.infer<typeof styleSchema>;


