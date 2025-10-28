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
import { HomestayAvailabilityEntity } from './homestay-availability.entity';
import { HomestayBookingEntity } from './homestay-booking.entity';

export enum HomestayRoomStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Entity('homestay_rooms')
export class HomestayRoomEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({ type: 'varchar', length: 180 })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'size_sqm', type: 'decimal', precision: 8, scale: 2, nullable: true })
  sizeSqm?: number | null;

  @Column({ name: 'base_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  basePrice?: number | null;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency!: string;

  @Column({ name: 'max_guests', type: 'int', nullable: true })
  maxGuests?: number | null;

  @Column({ name: 'bed_types', type: 'simple-array', nullable: true })
  bedTypes?: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  amenities?: string[] | null;

  @Column({
    type: 'varchar',
    length: 40,
    default: HomestayRoomStatus.ACTIVE,
  })
  status!: HomestayRoomStatus;

  @Column({ name: 'hero_image_url', type: 'varchar', length: 255, nullable: true })
  heroImageUrl?: string | null;

  @ManyToOne(() => HomestayEntity, (homestay) => homestay.rooms, {
    onDelete: 'CASCADE',
  })
  homestay!: Relation<HomestayEntity>;

  @OneToMany(() => HomestayAvailabilityEntity, (availability) => availability.room, {
    cascade: true,
  })
  availability?: Relation<HomestayAvailabilityEntity[]>;

  @OneToMany(() => HomestayBookingEntity, (booking) => booking.room)
  bookings?: Relation<HomestayBookingEntity[]>;
}
