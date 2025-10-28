import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity, PaymentStatus } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BookingsService } from '../bookings/bookings.service';
import { BookingPaymentStatus } from '../bookings/booking.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly repository: Repository<PaymentEntity>,
    private readonly bookingsService: BookingsService,
  ) {}

  async create(dto: CreatePaymentDto): Promise<PaymentEntity> {
    const booking = await this.bookingsService.findById(dto.bookingId);

    // Placeholder for payment gateway logic
    // In a real application, you would integrate with a payment gateway like Stripe or PayPal here
    // For now, we'll just simulate a successful payment
    const gatewayPaymentId = `simulated_${Date.now()}`;

    const payment = this.repository.create({
      ...dto,
      amount: dto.amount.toFixed(2),
      status: PaymentStatus.SUCCESSFUL,
      gatewayPaymentId,
      booking,
    });

    await this.repository.save(payment);

    // Update booking payment status
    const totalPaid = booking.payments.reduce((acc, p) => acc + parseFloat(p.amount), 0) + dto.amount;
    let newPaymentStatus: BookingPaymentStatus;

    if (totalPaid >= parseFloat(booking.totalAmount)) {
      newPaymentStatus = BookingPaymentStatus.PAID;
    } else if (totalPaid > 0) {
      newPaymentStatus = BookingPaymentStatus.PARTIAL;
    } else {
      newPaymentStatus = BookingPaymentStatus.UNPAID;
    }

    await this.bookingsService.update(booking.id, { paymentStatus: newPaymentStatus });

    return payment;
  }
}
