import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { DestinationEntity } from '../destinations/destination.entity';
import { PropertyEntity } from '../properties/property.entity';
import { PropertyRoomEntity } from '../rooms/property-room.entity';
import { ExperienceEntity } from '../experiences/experience.entity';
import { RestaurantEntity } from '../restaurants/restaurant.entity';
import { CustomerEntity } from '../customers/customer.entity';
import { PaymentEntity } from '../payments/payment.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export enum BookingType {
  ACCOMMODATION = 'accommodation',
  EXPERIENCE = 'experience',
  RESTAURANT = 'restaurant',
  PACKAGE = 'package',
}

export enum BookingSource {
  WEBSITE = 'website',
  MOBILE = 'mobile',
  PHONE = 'phone',
  EMAIL = 'email',
  AGENT = 'agent',
  WALKIN = 'walkin',
  OTHER = 'other',
}

export enum BookingPaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Entity('bookings')
export class BookingEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'reference_code', type: 'varchar', length: 60, unique: true })
  referenceCode!: string;

  @Column({
    type: 'varchar',
    length: 40,
    default: BookingType.ACCOMMODATION,
  })
  type!: BookingType;

  @Column({
    type: 'varchar',
    length: 40,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @Column({
    type: 'varchar',
    length: 40,
    default: BookingSource.WEBSITE,
  })
  source!: BookingSource;

  @Column({ name: 'customer_name', type: 'varchar', length: 180 })
  customerName!: string;

  @Column({
    name: 'customer_email',
    type: 'varchar',
    length: 180,
    nullable: true,
  })
  customerEmail?: string | null;

  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  customerPhone?: string | null;

  @Column({
    name: 'customer_country',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  customerCountry?: string | null;

  @Column({ name: 'check_in_date', type: 'date', nullable: true })
  checkInDate?: Date | null;

  @Column({ name: 'check_out_date', type: 'date', nullable: true })
  checkOutDate?: Date | null;

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  startTime?: Date | null;

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  endTime?: Date | null;

  @Column({ name: 'adult_count', type: 'int', default: 1 })
  adultCount!: number;

  @Column({ name: 'child_count', type: 'int', default: 0 })
  childCount!: number;

  @Column({ name: 'infant_count', type: 'int', default: 0 })
  infantCount!: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalAmount!: string;

  @Column({ type: 'varchar', length: 5, default: 'VND' })
  currency!: string;

  @Column({
    name: 'deposit_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  depositAmount?: string | null;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    length: 40,
    default: BookingPaymentStatus.UNPAID,
  })
  paymentStatus!: BookingPaymentStatus;

  @Column({ name: 'special_requests', type: 'text', nullable: true })
  specialRequests?: string | null;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes?: string | null;

  @Column({ name: 'assigned_staff_id', type: 'uuid', nullable: true })
  assignedStaffId?: string | null;

  @Column({ name: 'metadata', type: 'simple-json', nullable: true })
  metadata?: Record<string, any> | null;

  @ManyToOne(() => DestinationEntity, (destination) => destination.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  destination?: DestinationEntity | null;

  @ManyToOne(() => PropertyEntity, (property) => property.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  property?: PropertyEntity | null;

  @ManyToOne(() => PropertyRoomEntity, { nullable: true, onDelete: 'SET NULL' })
  room?: PropertyRoomEntity | null;

  @ManyToOne(() => ExperienceEntity, { nullable: true, onDelete: 'SET NULL' })
  experience?: ExperienceEntity | null;

  @ManyToOne(() => RestaurantEntity, { nullable: true, onDelete: 'SET NULL' })
  restaurant?: RestaurantEntity | null;

  @ManyToOne(() => CustomerEntity, (customer) => customer.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  customer?: CustomerEntity | null;

  @OneToMany(() => PaymentEntity, (payment) => payment.booking)
  payments!: PaymentEntity[];
}
