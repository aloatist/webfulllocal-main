import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma, Role } from '@prisma/client';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

function buildMenuInclude() {
  return {
    MenuItem: {
      where: { parentId: null },
      orderBy: { order: 'asc' as const },
      include: {
        other_MenuItem: {
          orderBy: { order: 'asc' as const },
          include: {
            other_MenuItem: {
              orderBy: { order: 'asc' as const },
            },
          },
        },
      },
    },
  };
}

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
      include: buildMenuInclude(),
    });
    return NextResponse.json({ menus });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json({ menus: [] });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  const authResponse = await requireAdmin();
  if (authResponse) return authResponse;

  const body = await request.json().catch(() => null);
  const { name, description, isDefault } =
    (body as { name?: string; description?: string; isDefault?: boolean }) ?? {};

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    if (isDefault) {
      await prisma.menu.updateMany({ data: { isDefault: false } });
    }

    const menu = await prisma.menu.create({
      data: {
        id: nanoid(),
        name: name.trim(),
        description: description?.trim() || null,
        isDefault: Boolean(isDefault),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: buildMenuInclude(),
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json(
        {
          error:
            'Navigation tables are missing. Run Prisma migrations to create the Menu/MenuItem tables.',
        },
        { status: 500 },
      );
    }
    throw error;
  }
}
