import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../common/entities/base.entity';
import { BookingEntity } from '../bookings/booking.entity';

@Entity('customers')
export class CustomerEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  country?: string | null;

  @Column({
    name: 'preferred_language',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  preferredLanguage?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  source?: string | null;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  preferences?: Record<string, any> | null;

  @Column({ name: 'loyalty_tier', type: 'varchar', length: 40, nullable: true })
  loyaltyTier?: string | null;

  @Column({ name: 'loyalty_points', type: 'int', default: 0 })
  loyaltyPoints!: number;

  @OneToMany(() => BookingEntity, (booking) => booking.customer)
  bookings?: BookingEntity[];
}
