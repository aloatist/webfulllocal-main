import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { templateConfigSchema } from '@/lib/templates/types';

export const dynamic = 'force-dynamic';

// GET - Get active template settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active template (or create default)
    let settings = await prisma.websiteTemplateSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.websiteTemplateSettings.create({
        data: {
          activeTemplate: 'ECOLOGICAL',
        },
      });
    }

    return NextResponse.json({
      template: settings.activeTemplate,
      customColors: settings.customColors,
      customSettings: settings.customSettings,
      isPreview: settings.isPreview,
      previewTemplate: settings.previewTemplate,
    });
  } catch (error) {
    console.error('Error loading template settings:', error);
    return NextResponse.json(
      { error: 'Failed to load template settings' },
      { status: 500 }
    );
  }
}

// PUT - Update template settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validated = templateConfigSchema.partial().parse(body);

    // Get or create settings
    let settings = await prisma.websiteTemplateSettings.findFirst();

    if (settings) {
      settings = await prisma.websiteTemplateSettings.update({
        where: { id: settings.id },
        data: {
          ...(validated.activeTemplate && { activeTemplate: validated.activeTemplate }),
          ...(validated.customColors !== undefined && { customColors: validated.customColors }),
          ...(validated.customSettings !== undefined && { customSettings: validated.customSettings }),
          updatedBy: session.user.id,
        },
      });
    } else {
      settings = await prisma.websiteTemplateSettings.create({
        data: {
          activeTemplate: validated.activeTemplate || 'ECOLOGICAL',
          customColors: validated.customColors,
          customSettings: validated.customSettings,
          updatedBy: session.user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      template: settings.activeTemplate,
      customColors: settings.customColors,
      customSettings: settings.customSettings,
    });
  } catch (error: any) {
    console.error('Error updating template settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update template' },
      { status: 500 }
    );
  }
}

