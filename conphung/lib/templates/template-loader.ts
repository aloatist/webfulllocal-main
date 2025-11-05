import { TemplateType } from './types';

// Load active template from API
export async function getActiveTemplate(): Promise<TemplateType> {
  try {
    const response = await fetch('/api/public/template', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (response.ok) {
      const data = await response.json();
      return (data.template as TemplateType) || TemplateType.ECOLOGICAL;
    }
  } catch (error) {
    console.error('Error loading template:', error);
  }

  return TemplateType.ECOLOGICAL; // Default fallback
}

// Get template for server components
export async function getActiveTemplateServer(): Promise<TemplateType> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const settings = await prisma.websiteTemplateSettings.findFirst();
    
    if (settings) {
      return settings.activeTemplate as TemplateType;
    }
  } catch (error) {
    console.error('Error loading template from database:', error);
  }

  return TemplateType.ECOLOGICAL; // Default
}

