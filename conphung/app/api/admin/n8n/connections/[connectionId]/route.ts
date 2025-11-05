import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Get single connection
export async function GET(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await prisma.integrationChannel.findUnique({
      where: { id: params.connectionId },
    });

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    return NextResponse.json({
      connection: {
        id: connection.id,
        name: connection.name,
        provider: connection.provider,
        type: (connection.config as any)?.type || 'api',
        config: connection.config,
        isActive: connection.status === 'ACTIVE',
        description: (connection.config as any)?.description,
      },
    });
  } catch (error) {
    console.error('Error loading connection:', error);
    return NextResponse.json(
      { error: 'Failed to load connection' },
      { status: 500 }
    );
  }
}

// PUT - Update connection
export async function PUT(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // If only updating isActive
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      const connection = await prisma.integrationChannel.update({
        where: { id: params.connectionId },
        data: {
          status: body.isActive ? 'ACTIVE' : 'INACTIVE',
        },
      });

      return NextResponse.json({ success: true, connection });
    }

    // Full update
    const existing = await prisma.integrationChannel.findUnique({
      where: { id: params.connectionId },
    });

    const connection = await prisma.integrationChannel.update({
      where: { id: params.connectionId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.provider && { provider: body.provider }),
        ...(body.isActive !== undefined && {
          status: body.isActive ? 'ACTIVE' : 'INACTIVE',
        }),
        ...(body.config && {
          config: {
            ...(existing?.config as any || {}),
            ...body.config,
          },
          endpoint: body.config?.endpoint || existing?.endpoint,
        }),
      },
    });

    return NextResponse.json({ success: true, connection });
  } catch (error: any) {
    console.error('Error updating connection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update connection' },
      { status: 500 }
    );
  }
}

// DELETE - Delete connection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.integrationChannel.delete({
      where: { id: params.connectionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete connection' },
      { status: 500 }
    );
  }
}
