import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { automationRuleSchema } from '@/lib/n8n/automation-rules';
import { evaluateConditions, executeAction } from '@/lib/n8n/automation-rules';

export const dynamic = 'force-dynamic';

// GET - Get single rule
export async function GET(
  request: NextRequest,
  { params }: { params: { ruleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rule = await prisma.automationRule.findUnique({
      where: { id: params.ruleId },
      include: {
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 50,
        },
      },
    });

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    return NextResponse.json({ rule });
  } catch (error) {
    console.error('Error loading rule:', error);
    return NextResponse.json(
      { error: 'Failed to load rule' },
      { status: 500 }
    );
  }
}

// PUT - Update rule
export async function PUT(
  request: NextRequest,
  { params }: { params: { ruleId: string } }
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
    const validated = automationRuleSchema.partial().parse(body);

    const rule = await prisma.automationRule.update({
      where: { id: params.ruleId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.eventType && { eventType: validated.eventType }),
        ...(validated.conditions && { conditions: validated.conditions }),
        ...(validated.actions && { actions: validated.actions }),
        ...(validated.isActive !== undefined && { isActive: validated.isActive }),
        ...(validated.priority !== undefined && { priority: validated.priority }),
      },
    });

    return NextResponse.json({ success: true, rule });
  } catch (error: any) {
    console.error('Error updating rule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update rule' },
      { status: 500 }
    );
  }
}

// DELETE - Delete rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { ruleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.automationRule.delete({
      where: { id: params.ruleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rule:', error);
    return NextResponse.json(
      { error: 'Failed to delete rule' },
      { status: 500 }
    );
  }
}

// POST - Test/Execute rule
export async function POST(
  request: NextRequest,
  { params }: { params: { ruleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rule = await prisma.automationRule.findUnique({
      where: { id: params.ruleId },
    });

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    const body = await request.json();
    const testData = body.data || {};

    // Evaluate conditions
    const conditionsMet = evaluateConditions(testData, rule.conditions as any[]);
    
    const startTime = Date.now();
    let actionsExecuted: any[] = [];
    let errorMessage: string | null = null;

    if (conditionsMet) {
      // Execute actions
      for (const action of (rule.actions as any[])) {
        try {
          const result = await executeAction(action, testData);
          actionsExecuted.push({ action: action.type, result });
        } catch (error: any) {
          errorMessage = error.message;
          break;
        }
      }
    }

    const duration = Date.now() - startTime;

    // Log execution
    await prisma.automationRuleLog.create({
      data: {
        ruleId: rule.id,
        ruleName: rule.name,
        eventType: rule.eventType,
        status: conditionsMet && !errorMessage ? 'success' : conditionsMet ? 'failed' : 'skipped',
        conditionsMet,
        actionsExecuted: actionsExecuted.length > 0 ? actionsExecuted : null,
        errorMessage,
        duration,
      },
    });

    // Update rule stats
    await prisma.automationRule.update({
      where: { id: rule.id },
      data: {
        executionCount: { increment: 1 },
        lastExecuted: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      conditionsMet,
      actionsExecuted: actionsExecuted.length,
      errorMessage,
      duration,
    });
  } catch (error: any) {
    console.error('Error testing rule:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to test rule' },
      { status: 500 }
    );
  }
}

