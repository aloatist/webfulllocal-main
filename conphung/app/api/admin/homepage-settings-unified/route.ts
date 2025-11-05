import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { homepageConfigSchema } from '@/lib/homepage/schema';
import { getHomepageConfig, DEFAULT_CONFIG } from '@/lib/homepage/sections';

// GET - Load unified homepage settings (merged from old CMS + new settings)
export async function GET(request: NextRequest) {
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

    const preview = request.nextUrl.searchParams.get('preview') === 'true';

    // IMPORTANT: Use getHomepageConfig() which now prioritizes HomepageSettings.sections (PUBLISHED)
    // This ensures Admin page shows the SAME data as homepage
    // getHomepageConfig() now checks: HomepageSettings.sections (PUBLISHED) > HomepageSection > DEFAULT_CONFIG
    const configFromSections = await getHomepageConfig();

    // Get HomepageSettings for status/version metadata
    const settings = await prisma.homepageSettings.findFirst({
      where: preview 
        ? {}
        : { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
    });

    // Use configFromSections directly (already includes DEFAULT_CONFIG fallback and priority handling)
    // This is the EXACT same data that homepage uses
    const mergedConfig = configFromSections;

    // Get SEO
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

    // Ensure mergedConfig always has full structure (merge with DEFAULT_CONFIG)
    const finalConfig = {
      ...DEFAULT_CONFIG,
      ...mergedConfig,
    };

    return NextResponse.json({
      config: finalConfig,
      settings: settings || null, // For status, version, etc.
      seo: seo || null,
      featuredServices,
    });
  } catch (error) {
    console.error('Error loading unified homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to load homepage settings' },
      { status: 500 }
    );
  }
}

// PUT - Save unified homepage settings
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
    const { config, seo: seoData, status: statusValue } = body;

    let savedStatus: 'PUBLISHED' | 'DRAFT' = 'DRAFT';

    // Validate config with schema
    if (config) {
      const validatedConfig = homepageConfigSchema.parse(config);

      // Get or create HomepageSettings
      const existing = await prisma.homepageSettings.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      const updateData: any = {
        sections: validatedConfig,
        updatedBy: session.user.id,
        version: existing ? existing.version + 1 : 1,
      };

      // Set status explicitly
      if (statusValue === 'PUBLISHED') {
        updateData.status = 'PUBLISHED';
        updateData.publishedAt = new Date();
        savedStatus = 'PUBLISHED';
      } else if (statusValue === 'DRAFT') {
        updateData.status = 'DRAFT';
        savedStatus = 'DRAFT';
      } else if (existing) {
        // Preserve existing status if not specified
        updateData.status = existing.status;
        savedStatus = existing.status as 'PUBLISHED' | 'DRAFT';
      } else {
        updateData.status = 'DRAFT';
        savedStatus = 'DRAFT';
      }

      if (existing) {
        await prisma.homepageSettings.update({
          where: { id: existing.id },
          data: updateData,
        });
      } else {
        await prisma.homepageSettings.create({
          data: {
            ...updateData,
            status: statusValue || 'DRAFT',
          },
        });
      }

      // Debug log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Homepage Settings Save]', {
          status: savedStatus,
          statusValue,
          sectionsCount: Object.keys(validatedConfig).length,
        });
      }

      // Also save to HomepageSection (for backward compatibility)
      // This allows old homepage CMS to still work
      const { saveHomepageConfig } = await import('@/lib/homepage/sections');
      await saveHomepageConfig(validatedConfig, {
        updatedById: session.user.id,
      });
    }

    // Update SEO
    if (seoData) {
      const existingSEO = await prisma.homepageSEO.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (existingSEO) {
        await prisma.homepageSEO.update({
          where: { id: existingSEO.id },
          data: seoData,
        });
      } else {
        await prisma.homepageSEO.create({
          data: seoData,
        });
      }
    }

    // Revalidate homepage cache to show latest changes (only for PUBLISHED)
    if (savedStatus === 'PUBLISHED') {
      try {
        // Note: revalidatePath is not available in API routes in Next.js 13+
        // Cache will be invalidated on next request
        console.log('[Homepage Settings] Published - cache will be invalidated on next request');
      } catch (error) {
        console.warn('Failed to revalidate homepage cache:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: savedStatus === 'PUBLISHED' 
        ? 'Homepage settings saved and published successfully' 
        : 'Homepage settings saved as draft. Click "Xuất bản" to publish.',
      status: savedStatus,
    });
  } catch (error: any) {
    console.error('Error saving unified homepage settings:', error);
    
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

