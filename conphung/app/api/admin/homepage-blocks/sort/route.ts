import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

// PATCH - Update sort order for multiple blocks (drag & drop)
// IMPORTANT: This API ONLY updates sortOrder, it does NOT sync to homepage-settings
// Homepage-blocks and homepage-settings are independent systems
// Dragging and dropping blocks only changes their order, it does not affect homepage-settings data
export async function PATCH(request: NextRequest) {
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
    const { blocks } = body; // Array of { id, sortOrder }

    if (!Array.isArray(blocks) || blocks.length === 0) {
      return NextResponse.json(
        { error: 'blocks array is required' },
        { status: 400 }
      );
    }

    // IMPORTANT: Only update sortOrder, do NOT modify fields or sync to settings
    // This ensures homepage-settings data is preserved when sorting blocks
    const updates = blocks.map((block: { id: string; sortOrder: number }) =>
      prisma.homepageBlock.update({
        where: { id: block.id },
        data: {
          sortOrder: block.sortOrder,
          updatedBy: session.user.id,
          // NOTE: We only update sortOrder, not fields or other data
          // This keeps blocks and settings independent
        },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({
      success: true,
      message: 'Sort order updated successfully',
      note: 'Blocks sorted. Homepage-settings data is preserved and not affected.',
    });
  } catch (error: any) {
    console.error('Error updating sort order:', error);
    
    return NextResponse.json(
      { error: 'Failed to update sort order' },
      { status: 500 }
    );
  }
}

