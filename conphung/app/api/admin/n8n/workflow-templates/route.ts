import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { workflowTemplateSchema } from '@/lib/n8n/workflow-templates';

export const dynamic = 'force-dynamic';

// GET - List all workflow templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = request.nextUrl.searchParams.get('category');
    const publicOnly = request.nextUrl.searchParams.get('public') === 'true';

    const where: any = {};
    if (category) where.category = category;
    if (publicOnly) where.isPublic = true;

    const templates = await prisma.n8nWorkflowTemplate.findMany({
      where,
      orderBy: { usageCount: 'desc' },
    });

    return NextResponse.json({
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        thumbnail: t.thumbnail,
        tags: t.tags,
        isPublic: t.isPublic,
        usageCount: t.usageCount,
        version: t.version,
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
    const validated = workflowTemplateSchema.parse(body);

    const template = await prisma.n8nWorkflowTemplate.create({
      data: {
        name: validated.name,
        description: validated.description,
        category: validated.category,
        workflowJson: validated.workflowJson,
        thumbnail: validated.thumbnail,
        tags: validated.tags || [],
        isPublic: validated.isPublic ?? false,
        version: validated.version || '1.0.0',
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

