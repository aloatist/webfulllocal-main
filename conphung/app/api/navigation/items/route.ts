import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';
import { nanoid } from 'nanoid';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function POST(request: Request) {
  const authResponse = await requireAdmin();
  if (authResponse) return authResponse;

  const body = await request.json().catch(() => null);
  const {
    menuId,
    parentId,
    label,
    href,
    icon,
    target,
    order,
    isActive,
    roles,
  } =
    (body as {
      menuId?: string;
      parentId?: string | null;
      label?: string;
      href?: string;
      icon?: string | null;
      target?: string | null;
      order?: number;
      isActive?: boolean;
      roles?: string[];
    }) ?? {};

  if (!menuId || !label?.trim() || !href?.trim()) {
    return NextResponse.json({ error: 'menuId, label và href là bắt buộc' }, { status: 400 });
  }

  const item = await prisma.menuItem.create({
    data: {
      id: nanoid(),
      menuId,
      parentId: parentId || null,
      label: label.trim(),
      href: href.trim(),
      icon: icon?.trim() || null,
      target: target?.trim() || null,
      order: typeof order === 'number' ? order : 0,
      isActive: isActive ?? true,
      roles: Array.isArray(roles) ? roles : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(item, { status: 201 });
}
