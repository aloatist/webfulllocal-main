
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { BookingEntity } from '../bookings/booking.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

@Entity('payments')
export class PaymentEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: string;

  @Column({ type: 'varchar', length: 5, default: 'VND' })
  currency!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column({ type: 'varchar', length: 50 })
  gateway!: string;

  @Column({ name: 'gateway_payment_id', type: 'varchar', length: 255 })
  gatewayPaymentId!: string;

  @ManyToOne(() => BookingEntity, (booking) => booking.payments)
  booking!: BookingEntity;
}
