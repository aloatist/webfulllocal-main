import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Tên phương thức thanh toán không được để trống'),
  type: z.string().min(1, 'Loại thanh toán không được để trống'),
  bankName: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  accountHolder: z.string().optional().nullable(),
  branch: z.string().optional().nullable(),
  qrCode: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  description: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
});

// GET - Get all payment methods
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ paymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new payment method
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = paymentMethodSchema.parse(body);

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        bankName: validatedData.bankName || null,
        accountNumber: validatedData.accountNumber || null,
        accountHolder: validatedData.accountHolder || null,
        branch: validatedData.branch || null,
        qrCode: validatedData.qrCode || null,
        isActive: validatedData.isActive,
        displayOrder: validatedData.displayOrder,
        description: validatedData.description || null,
        instructions: validatedData.instructions || null,
      },
    });

    return NextResponse.json({ paymentMethod }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment method:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

