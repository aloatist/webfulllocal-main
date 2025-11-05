import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Test webhook
export async function POST(
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
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Create test payload
    const testPayload = {
      event: webhook.eventType,
      timestamp: new Date().toISOString(),
      test: true,
      data: {
        test: 'This is a test webhook',
      },
    };

    // Send webhook
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication if configured
    if (webhook.authentication) {
      const auth = webhook.authentication as any;
      if (auth.type === 'bearer' && auth.token) {
        headers['Authorization'] = `Bearer ${auth.token}`;
      } else if (auth.type === 'api_key' && auth.apiKey && auth.apiKeyHeader) {
        headers[auth.apiKeyHeader] = auth.apiKey;
      } else if (auth.type === 'basic' && auth.username && auth.password) {
        const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
        headers['Authorization'] = `Basic ${credentials}`;
      }
    }

    // Add custom headers
    if (webhook.headers) {
      Object.assign(headers, webhook.headers);
    }

    const startTime = Date.now();
    const response = await fetch(webhook.url, {
      method: webhook.method,
      headers,
      body: webhook.method !== 'GET' ? JSON.stringify(testPayload) : undefined,
    });

    const duration = Date.now() - startTime;
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      const text = await response.text();
      responseData = { text };
    }

    // Log test result
    await prisma.n8nWebhookLog.create({
      data: {
        webhookId: webhook.id,
        webhookName: webhook.name,
        eventType: webhook.eventType,
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        requestPayload: testPayload,
        responseData,
        errorMessage: response.ok ? null : `HTTP ${response.status}`,
        duration,
        retryAttempt: 0,
      },
    });

    // Update webhook stats
    await prisma.n8nWebhook.update({
      where: { id: webhook.id },
      data: {
        triggerCount: { increment: 1 },
        successCount: response.ok ? { increment: 1 } : undefined,
        errorCount: response.ok ? undefined : { increment: 1 },
        lastTriggered: new Date(),
      },
    });

    return NextResponse.json({
      success: response.ok,
      statusCode: response.status,
      duration,
      response: responseData,
    });
  } catch (error: any) {
    console.error('Error testing webhook:', error);
    
    // Log error
    const webhook = await prisma.n8nWebhook.findUnique({
      where: { id: params.webhookId },
    });

    if (webhook) {
      await prisma.n8nWebhookLog.create({
        data: {
          webhookId: webhook.id,
          webhookName: webhook.name,
          eventType: webhook.eventType,
          status: 'error',
          requestPayload: { test: true },
          errorMessage: error.message,
          duration: 0,
          retryAttempt: 0,
        },
      });

      await prisma.n8nWebhook.update({
        where: { id: webhook.id },
        data: {
          triggerCount: { increment: 1 },
          errorCount: { increment: 1 },
        },
      });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to test webhook' },
      { status: 500 }
    );
  }
}

