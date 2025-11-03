import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { webhookSchema } from '@/lib/n8n/types';

export const dynamic = 'force-dynamic';

// GET - List all webhooks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const webhooks = await prisma.n8nWebhook.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      webhooks: webhooks.map(w => ({
        id: w.id,
        name: w.name,
        eventType: w.eventType,
        url: w.url,
        method: w.method,
        headers: w.headers,
        authentication: w.authentication,
        isActive: w.isActive,
        description: w.description,
        timeout: w.timeout,
        retryAttempts: w.retryAttempts,
        retryDelay: w.retryDelay,
        transformPayload: w.transformPayload,
        payloadTemplate: w.payloadTemplate,
        conditions: w.conditions,
        triggerCount: w.triggerCount,
        successCount: w.successCount,
        errorCount: w.errorCount,
        lastTriggered: w.lastTriggered?.toISOString(),
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error loading webhooks:', error);
    return NextResponse.json(
      { error: 'Failed to load webhooks' },
      { status: 500 }
    );
  }
}

// POST - Create new webhook
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
    const validated = webhookSchema.parse(body);

    const webhook = await prisma.n8nWebhook.create({
      data: {
        name: validated.name,
        eventType: validated.eventType,
        url: validated.url,
        method: validated.method || 'POST',
        headers: validated.headers || {},
        authentication: validated.authentication || {},
        isActive: validated.isActive ?? true,
        description: validated.description,
        timeout: validated.timeout || 10000,
        retryAttempts: validated.retryAttempts || 3,
        retryDelay: validated.retryDelay || 5000,
        transformPayload: validated.transformPayload || false,
        payloadTemplate: validated.payloadTemplate,
        conditions: validated.conditions || {},
      },
    });

    return NextResponse.json({
      success: true,
      webhook: {
        id: webhook.id,
        name: webhook.name,
        eventType: webhook.eventType,
        url: webhook.url,
        method: webhook.method,
        isActive: webhook.isActive,
      },
    });
  } catch (error: any) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create webhook' },
      { status: 500 }
    );
  }
}

