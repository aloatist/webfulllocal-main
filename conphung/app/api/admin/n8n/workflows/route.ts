import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - List all workflow templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const templates = await prisma.n8nWorkflowTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      templates: templates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        workflowJson: t.workflowJson,
        tags: t.tags,
        isActive: t.isPublic, // Using isPublic as isActive for now
        usageCount: t.usageCount,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error loading workflow templates:', error);
    return NextResponse.json(
      { error: 'Failed to load templates' },
      { status: 500 }
    );
  }
}

// POST - Create new workflow template
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
    const { name, description, category, workflowJson, tags, isActive } = body;

    if (!name || !workflowJson) {
      return NextResponse.json(
        { error: 'Name and workflowJson are required' },
        { status: 400 }
      );
    }

    const template = await prisma.n8nWorkflowTemplate.create({
      data: {
        name,
        description: description || null,
        category: category || 'Custom',
        workflowJson,
        tags: tags || [],
        isPublic: isActive ?? false,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
      },
    });
  } catch (error: any) {
    console.error('Error creating workflow template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create template' },
      { status: 500 }
    );
  }
}


