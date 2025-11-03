import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { draftMode } from 'next/headers';

// GET - Public API for homepage settings (ISR with revalidate)
export async function GET(request: NextRequest) {
  try {
    const { isEnabled } = await draftMode();
    
    // Get published settings (or draft if preview mode)
    const settings = await prisma.homepageSettings.findFirst({
      where: isEnabled 
        ? {} // Preview mode: get any status
        : { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
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
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        image: true,
      },
    });

    return NextResponse.json({
      settings: settings || null,
      seo: seo || null,
      featuredServices: featuredServices || [],
    });
  } catch (error) {
    console.error('Error loading public homepage settings:', error);
    
    // Return fallback data instead of error
    return NextResponse.json({
      settings: null,
      seo: null,
      featuredServices: [],
    });
  }
}

