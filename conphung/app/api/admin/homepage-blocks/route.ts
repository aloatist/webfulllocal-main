import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

// GET - List all homepage blocks (sorted by sortOrder)
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

    const themeId = request.nextUrl.searchParams.get('themeId') || null;
    const status = request.nextUrl.searchParams.get('status'); // ACTIVE | DISABLED | all

    const where: any = {};
    
    // Filter by theme (if null, shows blocks for all themes)
    if (themeId) {
      where.themeId = themeId;
    } else {
      where.themeId = null; // Only show global blocks
    }
    
    // Filter by status
    if (status && status !== 'all') {
      where.status = status;
    }

    const blocks = await prisma.homepageBlock.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({
      blocks,
      count: blocks.length,
    });
  } catch (error) {
    console.error('Error fetching homepage blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage blocks' },
      { status: 500 }
    );
  }
}

// POST - Create new homepage block
export async function POST(request: NextRequest) {
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
    const { type, title, fields, sortOrder, status, themeId } = body;

    if (!type || !fields) {
      return NextResponse.json(
        { error: 'type and fields are required' },
        { status: 400 }
      );
    }

    // Get max sortOrder to append at end
    const maxSortOrder = await prisma.homepageBlock.aggregate({
      _max: { sortOrder: true },
      where: themeId ? { themeId } : { themeId: null },
    });

    const newSortOrder = sortOrder ?? (maxSortOrder._max.sortOrder ?? -1) + 1;

    const block = await prisma.homepageBlock.create({
      data: {
        type,
        title: title || null,
        fields: fields as any,
        sortOrder: newSortOrder,
        status: status || 'ACTIVE',
        themeId: themeId || null,
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      block,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating homepage block:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Block with this identifier already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create homepage block' },
      { status: 500 }
    );
  }
}

