import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const homepageSettingsSchema = z.object({
  // Hero Section
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroBackgroundImage: z.string().optional(),
  heroBackgroundImageId: z.string().optional(),
  
  // About Section
  aboutTitle: z.string().optional(),
  aboutContent: z.string().optional(), // EditorJS JSON string
  aboutImage: z.string().optional(),
  aboutImageId: z.string().optional(),
  
  // CTA Section
  ctaTitle: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  
  // Status
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  ogImageId: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robotsMeta: z.string().optional(),
  structuredData: z.any().optional(),
});

// GET - Load homepage settings (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const preview = request.nextUrl.searchParams.get('preview') === 'true';
    
    // Get settings (allow draft in preview mode)
    const settings = await prisma.homepageSettings.findFirst({
      where: preview 
        ? {} // Preview mode: get any status
        : { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
      include: {
        // We'll link SEO later if needed, for now fetch separately
      },
    });

    // Get SEO settings
    const seo = await prisma.homepageSEO.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    // Get featured services
    const featuredServices = await prisma.service.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      orderBy: [
        { featuredOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return NextResponse.json({
      settings: settings || null,
      seo: seo || null,
      featuredServices,
    });
  } catch (error) {
    console.error('Error loading homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to load homepage settings' },
      { status: 500 }
    );
  }
}

// PUT - Update homepage settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings: settingsData, seo: seoData } = body;

    // Validate settings
    if (settingsData) {
      const validatedSettings = homepageSettingsSchema.parse(settingsData);
      
      // Upsert settings (only one record exists)
      const existing = await prisma.homepageSettings.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      const settingsUpdate = {
        ...validatedSettings,
        updatedBy: session.user.id,
        version: existing ? existing.version + 1 : 1,
      };

      if (validatedSettings.status === 'PUBLISHED') {
        settingsUpdate.publishedAt = new Date();
      }

      if (existing) {
        await prisma.homepageSettings.update({
          where: { id: existing.id },
          data: settingsUpdate,
        });
      } else {
        await prisma.homepageSettings.create({
          data: {
            ...settingsUpdate,
            status: validatedSettings.status || 'DRAFT',
          },
        });
      }
    }

    // Validate and update SEO
    if (seoData) {
      const validatedSEO = seoSchema.parse(seoData);
      
      const existingSEO = await prisma.homepageSEO.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (existingSEO) {
        await prisma.homepageSEO.update({
          where: { id: existingSEO.id },
          data: validatedSEO,
        });
      } else {
        await prisma.homepageSEO.create({
          data: validatedSEO,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Homepage settings updated successfully',
    });
  } catch (error: any) {
    console.error('Error saving homepage settings:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save homepage settings' },
      { status: 500 }
    );
  }
}

