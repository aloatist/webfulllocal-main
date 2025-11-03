import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

// GET - List all services (admin)
export async function GET(request: NextRequest) {
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

    const services = await prisma.service.findMany({
      orderBy: [
        { featuredOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error loading services:', error);
    return NextResponse.json(
      { error: 'Failed to load services' },
      { status: 500 }
    );
  }
}

