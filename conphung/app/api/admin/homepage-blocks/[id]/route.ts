import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get single block by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const block = await prisma.homepageBlock.findUnique({
      where: { id: params.id },
    });

    if (!block) {
      return NextResponse.json(
        { error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ block });
  } catch (error) {
    console.error('Error fetching homepage block:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage block' },
      { status: 500 }
    );
  }
}

// PATCH - Update block fields, status, or other properties
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
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
    const { fields, title, status, themeId } = body;

    const updateData: any = {
      updatedBy: session.user.id,
    };

    if (fields !== undefined) {
      updateData.fields = fields;
    }
    if (title !== undefined) {
      updateData.title = title;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (themeId !== undefined) {
      updateData.themeId = themeId;
    }

    const block = await prisma.homepageBlock.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      block,
    });
  } catch (error: any) {
    console.error('Error updating homepage block:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update homepage block' },
      { status: 500 }
    );
  }
}

// DELETE - Delete block
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
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

    await prisma.homepageBlock.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Block deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting homepage block:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete homepage block' },
      { status: 500 }
    );
  }
}

