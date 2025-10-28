import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { NavigationMenuItem } from './types';

function buildMenuInclude() {
  return {
    MenuItem: {
      where: { parentId: null, isActive: true },
      orderBy: { order: 'asc' as const },
      include: {
        other_MenuItem: {
          where: { isActive: true },
          orderBy: { order: 'asc' as const },
          include: {
            other_MenuItem: {
              where: { isActive: true },
              orderBy: { order: 'asc' as const },
            },
          },
        },
      },
    },
  };
}

type MenuItemRecord = {
  id: string;
  label: string;
  href: string;
  icon: string | null;
  target: string | null;
  order: number;
  isActive: boolean;
  roles: string[];
  parentId: string | null;
  other_MenuItem?: MenuItemRecord[];
};

function mapItems(items: MenuItemRecord[] = []): NavigationMenuItem[] {
  return items
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: item.icon,
      target: item.target,
      order: item.order,
      isActive: item.isActive,
      roles: item.roles ?? [],
      parentId: item.parentId ?? null,
      children: item.other_MenuItem ? mapItems(item.other_MenuItem) : [],
    }));
}

export async function getDefaultMenuItems(): Promise<NavigationMenuItem[] | null> {
  try {
    const menu =
      (await prisma.menu.findFirst({ where: { isDefault: true }, include: buildMenuInclude() })) ??
      (await prisma.menu.findFirst({ include: buildMenuInclude() }));

    if (!menu) return null;
    return mapItems(menu.MenuItem ?? []);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return null;
    }
    throw error;
  }
}
