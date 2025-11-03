import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { cocoIslandConfigSchema } from '@/lib/cocoisland/schema';

export const dynamic = 'force-dynamic';

// GET - Load cocoisland CMS settings
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

    // Get CocoIslandSettings (unified JSON)
    // For preview mode: get latest (any status)
    // For normal mode: get PUBLISHED, or fallback to latest DRAFT if no PUBLISHED
    let settings;
    if (preview) {
      settings = await prisma.cocoIslandSettings.findFirst({
        orderBy: { updatedAt: 'desc' },
      });
    } else {
      // Try PUBLISHED first
      settings = await prisma.cocoIslandSettings.findFirst({
        where: { status: 'PUBLISHED' },
        orderBy: { updatedAt: 'desc' },
      });
      // If no PUBLISHED, get latest DRAFT (for admin editing)
      if (!settings) {
        settings = await prisma.cocoIslandSettings.findFirst({
          orderBy: { updatedAt: 'desc' },
        });
      }
    }

    // If no settings exist, return empty config (will load from default later)
    if (!settings || !settings.sections) {
      return NextResponse.json({
        config: null,
        settings: null,
      });
    }

    return NextResponse.json({
      config: settings.sections,
      settings: {
        id: settings.id,
        status: settings.status,
        version: settings.version,
        updatedAt: settings.updatedAt.toISOString(),
        updatedBy: settings.updatedBy,
      },
    });
  } catch (error) {
    console.error('Error loading cocoisland settings:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

// PUT - Save cocoisland CMS settings
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
    const { config, status } = body;

    // Validate config
    const validatedConfig = cocoIslandConfigSchema.parse(config);

    // Get existing settings
    const existing = await prisma.cocoIslandSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    const updateData: any = {
      sections: validatedConfig,
      status: status || 'DRAFT',
      updatedBy: session.user.id,
      version: existing ? existing.version + 1 : 1,
    };

    if (status === 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    // Upsert settings
    if (existing) {
      await prisma.cocoIslandSettings.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      await prisma.cocoIslandSettings.create({
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving cocoisland settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}


