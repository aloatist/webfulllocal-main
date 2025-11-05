import { z } from 'zod';

// Template Types
export enum TemplateType {
  ECOLOGICAL = 'ECOLOGICAL',      // Sinh Thái
  MODERN = 'MODERN',              // Hiện Đại
  TRADITIONAL = 'TRADITIONAL',    // Truyền Thống
  GEOMETRIC = 'GEOMETRIC',        // Góc Cạnh
}

// Template Configuration Schema
export const templateConfigSchema = z.object({
  id: z.string().optional(),
  activeTemplate: z.nativeEnum(TemplateType),
  customColors: z.record(z.any()).optional(),
  customSettings: z.record(z.any()).optional(),
});

export type TemplateConfig = z.infer<typeof templateConfigSchema>;

// Template Metadata
export interface TemplateMetadata {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  style: {
    borderRadius: 'rounded' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-full';
    shadows: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    spacing: 'compact' | 'normal' | 'spacious';
  };
}

// Template Definitions
export const templates: Record<TemplateType, TemplateMetadata> = {
  ECOLOGICAL: {
    id: TemplateType.ECOLOGICAL,
    name: 'Sinh Thái',
    description: 'Phong cách tự nhiên, gần gũi với thiên nhiên, màu xanh lá cây chủ đạo',
    icon: '🌿',
    colors: {
      primary: '#10b981',      // Emerald-500
      secondary: '#059669',    // Emerald-600
      accent: '#34d399',       // Emerald-400
      background: '#f0fdf4',   // Green-50
      text: '#065f46',         // Emerald-800
    },
    style: {
      borderRadius: 'rounded-2xl',
      shadows: 'lg',
      spacing: 'spacious',
    },
  },
  MODERN: {
    id: TemplateType.MODERN,
    name: 'Hiện Đại',
    description: 'Phong cách tối giản, clean, màu xanh dương và xám chủ đạo',
    icon: '✨',
    colors: {
      primary: '#3b82f6',      // Blue-500
      secondary: '#2563eb',    // Blue-600
      accent: '#60a5fa',       // Blue-400
      background: '#f8fafc',   // Slate-50
      text: '#1e293b',         // Slate-800
    },
    style: {
      borderRadius: 'rounded-xl',
      shadows: 'xl',
      spacing: 'normal',
    },
  },
  TRADITIONAL: {
    id: TemplateType.TRADITIONAL,
    name: 'Truyền Thống',
    description: 'Phong cách ấm cúng, truyền thống, màu vàng cam chủ đạo',
    icon: '🏮',
    colors: {
      primary: '#f59e0b',      // Amber-500
      secondary: '#d97706',   // Amber-600
      accent: '#fbbf24',       // Amber-400
      background: '#fffbeb',   // Amber-50
      text: '#78350f',         // Amber-900
    },
    style: {
      borderRadius: 'rounded-lg',
      shadows: 'md',
      spacing: 'normal',
    },
  },
  GEOMETRIC: {
    id: TemplateType.GEOMETRIC,
    name: 'Góc Cạnh',
    description: 'Phong cách góc cạnh, hình học, màu tím và đỏ coral chủ đạo',
    icon: '🔷',
    colors: {
      primary: '#8b5cf6',      // Violet-500
      secondary: '#7c3aed',    // Violet-600
      accent: '#a78bfa',       // Violet-400
      background: '#faf5ff',   // Violet-50
      text: '#581c87',         // Violet-900
    },
    style: {
      borderRadius: 'rounded-lg', // Sharp corners, less rounded
      shadows: 'xl',
      spacing: 'normal',
    },
  },
};

// Get active template
export function getTemplateMetadata(type: TemplateType): TemplateMetadata {
  return templates[type];
}

// Get all templates
export function getAllTemplates(): TemplateMetadata[] {
  return Object.values(templates);
}

// Template Labels (Vietnamese)
export const templateLabels: Record<TemplateType, string> = {
  ECOLOGICAL: '🌿 Sinh Thái',
  MODERN: '✨ Hiện Đại',
  TRADITIONAL: '🏮 Truyền Thống',
  GEOMETRIC: '🔷 Góc Cạnh',
};

