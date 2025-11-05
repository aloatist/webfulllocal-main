import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

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
          take: 10,
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

    // If only updating isActive
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      const rule = await prisma.automationRule.update({
        where: { id: params.ruleId },
        data: { isActive: body.isActive },
      });

      return NextResponse.json({ success: true, rule });
    }

    // Full update
    const rule = await prisma.automationRule.update({
      where: { id: params.ruleId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.eventType && { eventType: body.eventType }),
        ...(body.conditions && { conditions: body.conditions }),
        ...(body.actions && { actions: body.actions }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.priority !== undefined && { priority: body.priority }),
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


