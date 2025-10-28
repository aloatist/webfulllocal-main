import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { HomestayEntity } from './homestay.entity';
import { HomestayRoomEntity } from './homestay-room.entity';
import { HomestayReviewEntity } from './homestay-review.entity';

export enum HomestayBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('homestay_bookings')
export class HomestayBookingEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  reference!: string;

  @ManyToOne(() => HomestayEntity, (homestay) => homestay.bookings, {
    onDelete: 'CASCADE',
  })
  homestay!: Relation<HomestayEntity>;

  @ManyToOne(() => HomestayRoomEntity, (room) => room.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  room?: Relation<HomestayRoomEntity> | null;

  @Column({ name: 'check_in_date', type: 'datetime' })
  checkInDate!: Date;

  @Column({ name: 'check_out_date', type: 'datetime' })
  checkOutDate!: Date;

  @Column({ type: 'int', default: 1 })
  adults!: number;

  @Column({ type: 'int', default: 0 })
  children!: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: HomestayBookingStatus.PENDING,
  })
  status!: HomestayBookingStatus;

  @Column({ name: 'total_price', type: 'decimal', precision: 12, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency!: string;

  @Column({ name: 'special_requests', type: 'text', nullable: true })
  specialRequests?: string | null;

  @Column({ name: 'guest_name', type: 'varchar', length: 255, nullable: true })
  guestName?: string | null;

  @Column({ name: 'guest_email', type: 'varchar', length: 255, nullable: true })
  guestEmail?: string | null;

  @OneToMany(() => HomestayReviewEntity, (review) => review.booking)
  reviews?: Relation<HomestayReviewEntity[]>;
}
