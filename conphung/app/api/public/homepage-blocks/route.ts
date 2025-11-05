import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Public API to fetch active homepage blocks for frontend
export async function GET(request: NextRequest) {
  try {
    const themeId = request.nextUrl.searchParams.get('themeId') || null;

    const where: any = {
      status: 'ACTIVE', // Only return active blocks
    };
    
    // Filter by theme (if null, shows blocks for all themes)
    if (themeId) {
      where.themeId = themeId;
    } else {
      // Return both global blocks (themeId = null) and blocks for specific theme
      // For now, we'll return only global blocks
      where.themeId = null;
    }

    const blocks = await prisma.homepageBlock.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        type: true,
        title: true,
        fields: true,
        sortOrder: true,
        status: true,
        themeId: true,
      },
    });

    return NextResponse.json({
      blocks,
      count: blocks.length,
    });
  } catch (error) {
    console.error('Error fetching public homepage blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage blocks' },
      { status: 500 }
    );
  }
}

