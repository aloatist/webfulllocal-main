import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Use/increment usage count for template
export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const template = await prisma.n8nWorkflowTemplate.update({
      where: { id: params.templateId },
      data: {
        usageCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      usageCount: template.usageCount,
    });
  } catch (error) {
    console.error('Error updating template usage:', error);
    return NextResponse.json(
      { error: 'Failed to update usage' },
      { status: 500 }
    );
  }
}

