import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Tên phương thức thanh toán không được để trống').optional(),
  type: z.string().min(1, 'Loại thanh toán không được để trống').optional(),
  bankName: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  accountHolder: z.string().optional().nullable(),
  branch: z.string().optional().nullable(),
  qrCode: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  description: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
});

// GET - Get payment method by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: params.id },
    });

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ paymentMethod });
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update payment method
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Remove undefined values
    const updateData: any = {};
    Object.keys(validatedData).forEach(key => {
      if (validatedData[key as keyof typeof validatedData] !== undefined) {
        updateData[key] = validatedData[key as keyof typeof validatedData];
      }
    });

    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ paymentMethod });
  } catch (error) {
    console.error('Error updating payment method:', error);
    
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

// DELETE - Delete payment method
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.paymentMethod.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

