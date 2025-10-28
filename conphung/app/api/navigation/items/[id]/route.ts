import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const authResponse = await requireAdmin();
  if (authResponse) return authResponse;

  const body = await request.json().catch(() => null);
  const {
    label,
    href,
    icon,
    target,
    order,
    isActive,
    roles,
    parentId,
  } =
    (body as {
      label?: string;
      href?: string;
      icon?: string | null;
      target?: string | null;
      order?: number;
      isActive?: boolean;
      roles?: string[];
      parentId?: string | null;
    }) ?? {};

  const updates: Record<string, unknown> = {};
  if (typeof label === 'string') updates.label = label.trim();
  if (typeof href === 'string') updates.href = href.trim();
  if (icon !== undefined) updates.icon = icon?.trim() || null;
  if (target !== undefined) updates.target = target?.trim() || null;
  if (typeof order === 'number') updates.order = order;
  if (typeof isActive === 'boolean') updates.isActive = isActive;
  if (Array.isArray(roles)) updates.roles = roles;
  if (parentId !== undefined) updates.parentId = parentId || null;

  const item = await prisma.menuItem.update({
    where: { id: params.id },
    data: updates,
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const authResponse = await requireAdmin();
  if (authResponse) return authResponse;

  await prisma.menuItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
