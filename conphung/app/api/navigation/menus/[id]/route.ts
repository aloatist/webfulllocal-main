import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma, Role } from '@prisma/client';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

function buildMenuInclude() {
  return {
    items: {
      where: { parentId: null },
      orderBy: { order: 'asc' as const },
      include: {
        children: {
          orderBy: { order: 'asc' as const },
          include: {
            children: {
              orderBy: { order: 'asc' as const },
            },
          },
        },
      },
    },
  };
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const authResponse = await requireAdmin();
  if (authResponse) return authResponse;

  const body = await request.json().catch(() => null);
  const { name, description, isDefault } =
    (body as { name?: string; description?: string; isDefault?: boolean }) ?? {};

  const updates: Record<string, unknown> = {};
  if (typeof name === 'string') updates.name = name.trim();
  if (typeof description === 'string') updates.description = description.trim() || null;
  if (typeof isDefault === 'boolean') updates.isDefault = isDefault;

  if ('isDefault' in updates && updates.isDefault) {
    await prisma.menu.updateMany({ where: { NOT: { id: params.id } }, data: { isDefault: false } });
  }

  try {
    const menu = await prisma.menu.update({
      where: { id: params.id },
      data: updates,
      include: buildMenuInclude(),
    });

    return NextResponse.json(menu);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json(
        {
          error: 'Navigation tables are missing. Run Prisma migrations before updating menus.',
        },
        { status: 500 },
      );
    }
    throw error;
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const authResponse = await requireAdmin();
  if (authResponse) return authResponse;
  try {
    await prisma.menu.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json(
        {
          error: 'Navigation tables are missing. Run Prisma migrations before deleting menus.',
        },
        { status: 500 },
      );
    }
    throw error;
  }
}
