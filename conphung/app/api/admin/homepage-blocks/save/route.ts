import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

// POST - Save blocks as draft
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
    const { blocks, status } = body;

    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json(
        { error: 'blocks array is required' },
        { status: 400 }
      );
    }

    // Update sort order for all blocks
    await Promise.all(
      blocks.map((block: { id: string; sortOrder: number }) =>
        prisma.homepageBlock.update({
          where: { id: block.id },
          data: {
            sortOrder: block.sortOrder,
            updatedBy: session.user.id,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: 'Đã lưu thành công',
    });
  } catch (error) {
    console.error('Error saving blocks:', error);
    return NextResponse.json(
      { error: 'Failed to save blocks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


