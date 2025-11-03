import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

interface Context {
  params: {
    serviceId: string;
  };
}

// PATCH - Update service (admin)
export async function PATCH(
  request: NextRequest,
  context: Context
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { serviceId } = context.params;
    const body = await request.json();

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        isFeatured: body.isFeatured,
        featuredOrder: body.featuredOrder,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

