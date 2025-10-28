import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    const menu =
      (await prisma.menu.findFirst({
        where: { isDefault: true },
        include: buildMenuInclude(),
      })) ??
      (await prisma.menu.findFirst({ include: buildMenuInclude() }));

    return NextResponse.json({ menu });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json({ menu: null }, { status: 200 });
    }
    throw error;
  }
}
