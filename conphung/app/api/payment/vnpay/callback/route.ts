/**
 * VNPay Payment Callback
 * Handle payment return from VNPay
 */

import { NextRequest, NextResponse } from 'next/server';
import { createVNPayService } from '@/lib/payment/vnpay';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // DISABLED: Online payment is not supported
  // Redirect to payment info page
  return NextResponse.redirect(
    new URL('/phuong-thuc-thanh-toan', request.url)
  );

  /* DISABLED CODE - Online payment is not allowed
  try {
    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Verify callback
    const vnpayService = createVNPayService();
    const verification = vnpayService.verifyReturnUrl(params);

    if (!verification.isValid) {
      // Redirect to error page
      return NextResponse.redirect(
        new URL(`/payment/error?message=${encodeURIComponent(verification.message)}`, request.url)
      );
    }

    const { data } = verification;
    if (!data) {
      return NextResponse.redirect(
        new URL('/payment/error?message=Invalid payment data', request.url)
      );
    }

    // Get payment record
    const paymentId = data.vnp_TxnRef;
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        Booking: {
          include: {
            Customer: true,
            Tour: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.redirect(
        new URL('/payment/error?message=Payment not found', request.url)
      );
    }

    // Check if payment is successful
    const isSuccess = data.vnp_ResponseCode === '00';

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: isSuccess ? 'SUCCEEDED' : 'FAILED',
        externalId: data.vnp_TransactionNo,
        paidAt: isSuccess ? new Date() : null,
        failureReason: isSuccess ? null : verification.message,
        updatedAt: new Date(),
        metadata: {
          ...(payment.metadata as any),
          vnpayResponse: data,
        },
      },
    });

    // Update booking status if payment successful
    if (isSuccess) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: 'CONFIRMED',
          updatedAt: new Date(),
        },
      });

      // TODO: Send confirmation email
      // await sendBookingConfirmationEmail(payment.Booking);
    }

    // Redirect to success/failure page
    if (isSuccess) {
      return NextResponse.redirect(
        new URL(`/payment/success?bookingId=${payment.bookingId}&paymentId=${payment.id}`, request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL(`/payment/error?message=${encodeURIComponent(verification.message)}`, request.url)
      );
    }
  } catch (error) {
    console.error('VNPay callback error:', error);
    return NextResponse.redirect(
      new URL('/payment/error?message=Internal server error', request.url)
    );
  }
  */
}
