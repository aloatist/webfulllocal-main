import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Test connection
export async function POST(
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

    const config = connection.config as any;
    const type = config?.type || 'api';
    let testResult = { success: false, message: '' };

    // Test based on type
    if (type === 'api' && config?.endpoint) {
      try {
        const response = await fetch(config.endpoint, {
          method: 'GET',
          headers: config.apiKey
            ? { 'Authorization': `Bearer ${config.apiKey}` }
            : {},
          signal: AbortSignal.timeout(5000),
        });
        testResult = {
          success: response.ok,
          message: response.ok ? 'Connection successful' : `HTTP ${response.status}`,
        };
      } catch (error: any) {
        testResult = {
          success: false,
          message: error.message || 'Connection failed',
        };
      }
    } else if (type === 'webhook' && config?.endpoint) {
      try {
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true }),
          signal: AbortSignal.timeout(5000),
        });
        testResult = {
          success: response.ok,
          message: response.ok ? 'Webhook reachable' : `HTTP ${response.status}`,
        };
      } catch (error: any) {
        testResult = {
          success: false,
          message: error.message || 'Webhook unreachable',
        };
      }
    } else if (type === 'database') {
      // Basic validation (actual DB test would require driver)
      testResult = {
        success: !!(config?.host && config?.database),
        message: config?.host && config?.database
          ? 'Database config valid'
          : 'Missing database credentials',
      };
    } else {
      testResult = {
        success: false,
        message: 'Unknown connection type or missing config',
      };
    }

    // Update connection with test result
    await prisma.integrationChannel.update({
      where: { id: connection.id },
      data: {
        config: {
          ...config,
          testStatus: testResult.success ? 'success' : 'error',
          lastTestMessage: testResult.message,
        },
        lastSyncedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: testResult.success,
      message: testResult.message,
    });
  } catch (error: any) {
    console.error('Error testing connection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to test connection' },
      { status: 500 }
    );
  }
}
