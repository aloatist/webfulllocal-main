import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { NavigationMenuItem } from './types';
import { mapMenuItems } from './mappers';

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

export async function getDefaultMenuItems(): Promise<NavigationMenuItem[] | null> {
  try {
    const menu =
      (await prisma.menu.findFirst({ where: { isDefault: true }, include: buildMenuInclude() })) ??
      (await prisma.menu.findFirst({ include: buildMenuInclude() }));

    if (!menu) return null;
    return mapMenuItems(menu.MenuItem ?? []);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return null;
    }
    throw error;
  }
}
