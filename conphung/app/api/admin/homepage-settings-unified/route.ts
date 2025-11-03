import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { homepageConfigSchema } from '@/lib/homepage/schema';
import { getHomepageConfig } from '@/lib/homepage/sections';

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

    // Get new HomepageSettings (unified JSON)
    const settings = await prisma.homepageSettings.findFirst({
      where: preview 
        ? {}
        : { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
    });

    // Get old HomepageConfig from HomepageSection
    const oldConfig = await getHomepageConfig();

    // Merge: Use new unified settings if exists, else fallback to old config
    let mergedConfig = oldConfig;
    if (settings?.sections) {
      try {
        mergedConfig = settings.sections as any;
      } catch (error) {
        console.error('Error parsing unified sections:', error);
        // Fallback to old config
      }
    }

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

    return NextResponse.json({
      config: mergedConfig,
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

      if (statusValue === 'PUBLISHED') {
        updateData.status = 'PUBLISHED';
        updateData.publishedAt = new Date();
      } else if (statusValue === 'DRAFT') {
        updateData.status = 'DRAFT';
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

    return NextResponse.json({
      success: true,
      message: 'Homepage settings saved successfully',
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

