import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - List all connections
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Use IntegrationChannel as connection storage
    const connections = await prisma.integrationChannel.findMany({
      where: {
        provider: {
          not: 'n8n', // Exclude n8n channel (it's for logs)
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      connections: connections.map((c) => ({
        id: c.id,
        name: c.name,
        provider: c.provider,
        type: (c.config as any)?.type || 'api',
        config: c.config,
        isActive: c.status === 'ACTIVE',
        description: (c.config as any)?.description,
        lastTested: c.lastSyncedAt?.toISOString(),
        testStatus: (c.config as any)?.testStatus,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error loading connections:', error);
    return NextResponse.json(
      { error: 'Failed to load connections' },
      { status: 500 }
    );
  }
}

// POST - Create new connection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, provider, type, config, description, isActive } = body;

    if (!name || !provider) {
      return NextResponse.json(
        { error: 'Name and provider are required' },
        { status: 400 }
      );
    }

    // Store in IntegrationChannel
    const connection = await prisma.integrationChannel.create({
      data: {
        name,
        provider,
        status: isActive ? 'ACTIVE' : 'INACTIVE',
        endpoint: config?.endpoint || null,
        config: {
          ...config,
          type,
          description,
        },
      },
    });

    return NextResponse.json({
      success: true,
      connection: {
        id: connection.id,
        name: connection.name,
        provider: connection.provider,
      },
    });
  } catch (error: any) {
    console.error('Error creating connection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create connection' },
      { status: 500 }
    );
  }
}
