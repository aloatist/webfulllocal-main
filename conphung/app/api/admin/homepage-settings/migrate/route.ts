import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { homepageConfigSchema } from '@/lib/homepage/schema';
import { getHomepageConfig } from '@/lib/homepage/sections';

// POST - Migrate data from current homepage (hard-coded components) to database
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get existing config from HomepageSection (if any)
    const existingConfig = await getHomepageConfig();

    // Check if we should use existing or force defaults
    const forceDefaults = request.nextUrl.searchParams.get('forceDefaults') === 'true';
    
    let configToSave;
    if (forceDefaults) {
      // Force use DEFAULT_CONFIG (hard-coded values from sections.ts)
      const { DEFAULT_CONFIG } = await import('@/lib/homepage/sections');
      configToSave = DEFAULT_CONFIG;
    } else {
      // Use existing config from HomepageSection (which should have data from old CMS)
      // Merge with defaults for any missing sections
      const { DEFAULT_CONFIG } = await import('@/lib/homepage/sections');
      configToSave = { ...DEFAULT_CONFIG, ...existingConfig };
    }

    // Validate
    const validatedConfig = homepageConfigSchema.parse(configToSave);

    // Save to HomepageSettings
    const existing = await prisma.homepageSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      await prisma.homepageSettings.update({
        where: { id: existing.id },
        data: {
          sections: validatedConfig,
          updatedBy: session.user.id,
          version: existing.version + 1,
          status: 'DRAFT', // Keep as draft for review
        },
      });
    } else {
      await prisma.homepageSettings.create({
        data: {
          sections: validatedConfig,
          updatedBy: session.user.id,
          version: 1,
          status: 'DRAFT',
        },
      });
    }

    // Also save to HomepageSection for backward compatibility
    const { saveHomepageConfig } = await import('@/lib/homepage/sections');
    await saveHomepageConfig(validatedConfig, {
      updatedById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Homepage data migrated successfully',
      migratedSections: Object.keys(validatedConfig),
      config: validatedConfig,
    });
  } catch (error: any) {
    console.error('Error migrating homepage data:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to migrate homepage data', details: error.message },
      { status: 500 }
    );
  }
}

