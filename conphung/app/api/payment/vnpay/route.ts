/**
 * VNPay Payment API
 * Create payment URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { createVNPayService } from '@/lib/payment/vnpay';
import { rateLimit, RateLimitPresets } from '@/lib/security/rate-limiter';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const createPaymentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive(),
  orderInfo: z.string(),
  bankCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // DISABLED: Online payment is not supported
  // Only booking is allowed, payment must be done via bank transfer
  return NextResponse.json(
    { 
      error: 'Thanh toán trực tuyến không được hỗ trợ',
      message: 'Vui lòng đặt hàng online và thanh toán qua chuyển khoản ngân hàng. Thông tin tài khoản: Số tài khoản: 7210783403 - BIDV chi nhánh Bến Tre'
    },
    { status: 403 }
  );

  /* DISABLED CODE - Online payment is not allowed
  try {
    // Rate limiting
    const rateLimitResponse = await rateLimit(request, RateLimitPresets.normal);
    if (rateLimitResponse) return rateLimitResponse;

    // Parse and validate request
    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: validatedData.bookingId },
      include: {
        Customer: true,
        Tour: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking is already paid
    const existingPayment = await prisma.payment.findFirst({
      where: {
        bookingId: booking.id,
        status: 'SUCCEEDED',
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Booking already paid' },
        { status: 400 }
      );
    }

    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        bookingId: booking.id,
        provider: 'BANK_TRANSFER', // Will update to specific provider after success
        amount: validatedData.amount,
        currency: booking.currency,
        status: 'PENDING',
        updatedAt: new Date(),
        metadata: {
          orderInfo: validatedData.orderInfo,
          bankCode: validatedData.bankCode,
          ipAddr: ip,
        },
      },
    });

    // Create VNPay payment URL
    const vnpayService = createVNPayService();
    const paymentUrl = vnpayService.createPaymentUrl({
      amount: validatedData.amount,
      orderInfo: validatedData.orderInfo,
      orderType: 'billpayment',
      orderId: payment.id,
      ipAddr: ip,
      bankCode: validatedData.bankCode,
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      paymentUrl,
    });
  } catch (error) {
    console.error('VNPay payment error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
  */
}
