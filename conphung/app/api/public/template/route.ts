import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

// GET - Get active template for public pages
export async function GET(request: NextRequest) {
  try {
    const preview = request.nextUrl.searchParams.get('preview') === 'true';
    const previewTemplate = request.nextUrl.searchParams.get('previewTemplate');

    // Get active template
    let settings = await prisma.websiteTemplateSettings.findFirst();

    if (!settings) {
      // Return default
      return NextResponse.json({
        template: 'ECOLOGICAL',
        isPreview: false,
      });
    }

    // If preview mode and preview template specified
    if (preview && previewTemplate && settings.isPreview) {
      return NextResponse.json({
        template: previewTemplate,
        isPreview: true,
      });
    }

    // Return active template
    return NextResponse.json({
      template: settings.activeTemplate,
      isPreview: settings.isPreview,
      previewTemplate: settings.previewTemplate,
    });
  } catch (error) {
    console.error('Error loading public template:', error);
    return NextResponse.json(
      { template: 'ECOLOGICAL', isPreview: false },
      { status: 200 } // Return default even on error
    );
  }
}

