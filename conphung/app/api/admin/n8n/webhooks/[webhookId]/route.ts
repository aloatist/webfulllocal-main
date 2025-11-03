import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { webhookSchema } from '@/lib/n8n/types';

export const dynamic = 'force-dynamic';

// GET - Get single webhook
export async function GET(
  request: NextRequest,
  { params }: { params: { webhookId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhook = await prisma.n8nWebhook.findUnique({
      where: { id: params.webhookId },
      include: {
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json({ webhook });
  } catch (error) {
    console.error('Error loading webhook:', error);
    return NextResponse.json(
      { error: 'Failed to load webhook' },
      { status: 500 }
    );
  }
}

// PUT - Update webhook
export async function PUT(
  request: NextRequest,
  { params }: { params: { webhookId: string } }
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
    
    // If only updating isActive, do simple update
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      const webhook = await prisma.n8nWebhook.update({
        where: { id: params.webhookId },
        data: { isActive: body.isActive },
      });

      return NextResponse.json({ success: true, webhook });
    }

    // Otherwise validate full schema
    const validated = webhookSchema.partial().parse(body);

    const webhook = await prisma.n8nWebhook.update({
      where: { id: params.webhookId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.eventType && { eventType: validated.eventType }),
        ...(validated.url && { url: validated.url }),
        ...(validated.method && { method: validated.method }),
        ...(validated.headers !== undefined && { headers: validated.headers }),
        ...(validated.authentication !== undefined && { authentication: validated.authentication }),
        ...(validated.isActive !== undefined && { isActive: validated.isActive }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.timeout !== undefined && { timeout: validated.timeout }),
        ...(validated.retryAttempts !== undefined && { retryAttempts: validated.retryAttempts }),
        ...(validated.retryDelay !== undefined && { retryDelay: validated.retryDelay }),
        ...(validated.transformPayload !== undefined && { transformPayload: validated.transformPayload }),
        ...(validated.payloadTemplate !== undefined && { payloadTemplate: validated.payloadTemplate }),
        ...(validated.conditions !== undefined && { conditions: validated.conditions }),
      },
    });

    return NextResponse.json({ success: true, webhook });
  } catch (error: any) {
    console.error('Error updating webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update webhook' },
      { status: 500 }
    );
  }
}

// DELETE - Delete webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: { webhookId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.n8nWebhook.delete({
      where: { id: params.webhookId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}

