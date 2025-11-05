import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - List all automation rules
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const rules = await prisma.automationRule.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      rules: rules.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        eventType: r.eventType,
        conditions: r.conditions,
        actions: r.actions,
        isActive: r.isActive,
        priority: r.priority,
        triggerCount: r.executionCount,
        lastExecuted: r.lastExecuted?.toISOString(),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
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
    const { name, description, eventType, conditions, actions, isActive, priority } = body;

    if (!name || !eventType || !conditions || !actions) {
      return NextResponse.json(
        { error: 'Name, eventType, conditions, and actions are required' },
        { status: 400 }
      );
    }

    const rule = await prisma.automationRule.create({
      data: {
        name,
        description: description || null,
        eventType,
        conditions,
        actions,
        isActive: isActive ?? true,
        priority: priority || 0,
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


