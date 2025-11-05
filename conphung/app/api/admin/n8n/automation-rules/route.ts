import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { automationRuleSchema } from '@/lib/n8n/automation-rules';

export const dynamic = 'force-dynamic';

// GET - List all automation rules
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventType = request.nextUrl.searchParams.get('eventType');
    const activeOnly = request.nextUrl.searchParams.get('active') === 'true';

    const where: any = {};
    if (eventType) where.eventType = eventType;
    if (activeOnly) where.isActive = true;

    const rules = await prisma.automationRule.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json({
      rules: rules.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        eventType: r.eventType,
        conditions: r.conditions,
        actions: r.actions,
        isActive: r.isActive,
        priority: r.priority,
        executionCount: r.executionCount,
        lastExecuted: r.lastExecuted?.toISOString(),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        recentLogs: r.logs.slice(0, 5),
      })),
    });
  } catch (error) {
    console.error('Error loading automation rules:', error);
    return NextResponse.json(
      { error: 'Failed to load rules' },
      { status: 500 }
    );
  }
}

// POST - Create new automation rule
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
    const validated = automationRuleSchema.parse(body);

    const rule = await prisma.automationRule.create({
      data: {
        name: validated.name,
        description: validated.description,
        eventType: validated.eventType,
        conditions: validated.conditions,
        actions: validated.actions,
        isActive: validated.isActive ?? true,
        priority: validated.priority || 0,
      },
    });

    return NextResponse.json({
      success: true,
      rule: {
        id: rule.id,
        name: rule.name,
        eventType: rule.eventType,
      },
    });
  } catch (error: any) {
    console.error('Error creating automation rule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create rule' },
      { status: 500 }
    );
  }
}

